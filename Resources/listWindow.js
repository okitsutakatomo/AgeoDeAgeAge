var win = Titanium.UI.currentWindow;
win.barColor = '#79D448';
win.backgroundImage = "images/bg.png";

var flexSpace = Titanium.UI.createButton({
    systemButton:Titanium.UI.iPhone.SystemButton.FLEXIBLE_SPACE
});

var tabBar = Titanium.UI.createTabbedBar({
    labels:['新着あげあげ', '人気のあげあげ', '上尾のあげあげ'],
    index:0,
    backgroundColor: "#79D448",
    style:Titanium.UI.iPhone.SystemButtonStyle.BAR,
});

var toolbar1 = Titanium.UI.createToolbar({
    items:[tabBar],
    top: 0,
    barColor:'#79D448',
    zIndex: 10
});

win.add(toolbar1);

if(win.type == "popular") {
    // title control
    var popularTab = Titanium.UI.createTabbedBar({
        labels:['閲覧数が多い順', 'コメントが多い順'],
        index:0,
        backgroundColor: "#79D448",
        style:Titanium.UI.iPhone.SystemButtonStyle.BAR
    });
    win.setTitleControl(popularTab);

    popularTab.addEventListener('click', function(e) {

        init();

        if(e.index == 0) {
            win.apiPath = "/api/docs.json?order=popular";
        } else if(e.index == 1) {
            win.apiPath = "/api/docs.json?order=comment";
        } else {
            win.apiPath = "/api/docs.json?order=popular";
        }

        //インジゲーターを表示する。
        showLoadingIndicator();

        //データをロードする
        loadingData(currentPage);

        tableView.scrollToTop(0);
    });
}

var currentPage = 1;

var loadingRowIndex = 0;

var pulling = false;
var reloading = false;

var data = [];
var tableView = Titanium.UI.createTableView({
    data: data,
    backgroundImage: "images/bg.png",
    //backgroundColor: "transparent",
    separatorColor:'transparent',
    top: 44
});

var loadingBorder = Ti.UI.createView({
    backgroundColor:"#B6EE6A",
    height:2,
    bottom:0
});

var loading = Titanium.UI.createView({
    top:44,
    height:1,
    backgroundColor: "#dbf7b5",
    zIndex: 2,
    color: '#000000',
    text: "loading...",
    textAlign: "center",
    font: {
        fontWeight: "bold"
    },
});

loading.add(loadingBorder);

var loadingIndicator = Titanium.UI.createActivityIndicator({
    style:Titanium.UI.iPhone.ActivityIndicatorStyle.DARK,
    color: '#000000',
    left: 30,
    width: 60,
});

var loadingLabel = Titanium.UI.createLabel({
    color: '#000000',
    text: "loading...",
    textAlign: "center",
    font: {
        fontWeight: "bold"
    },
    zIndex: 999,
    top:0
});

loading.add(loadingIndicator);
loading.add(loadingLabel);

//もっと見るリンク
var nextRow = Ti.UI.createTableViewRow({
    selectedBackgroundColor:'#999999',
    height: 60,
    className: "next",
});

var nextLabel = Ti.UI.createLabel({
    text: "もっと見る",
    textAlign: "center"
});

var nextLoading = Titanium.UI.createActivityIndicator({
    style:Titanium.UI.iPhone.ActivityIndicatorStyle.DARK,
    color: 'gray',
    zIndex: 999,
    height: 60,
    top: 0
});

nextRow.addEventListener('click', function(event) {
    nextLoading.show({
        animated: false
    });
    nextLabel.hide({
        animated: false
    });
    loadingData(currentPage + 1);
    currentPage++;
});
nextRow.add(nextLabel);
nextRow.add(nextLoading);

//PullToRefresh Component
var border = Ti.UI.createView({
    backgroundColor:"#FCFFD2",
    height:2,
    bottom:0
});

//背景をrepeatしたいので、TableViewを利用する。
var tableHeader = Ti.UI.createTableView({
    backgroundImage: "images/bg.png",
    separatorColor:'transparent',
    width:320,
    height:60
});

tableHeader.add(border);

var arrow = Ti.UI.createView({
    backgroundImage:"images/blackArrow.png",
    width:23,
    height:60,
    bottom:10,
    left:20
});

var statusLabel = Ti.UI.createLabel({
    text:"Pull to reload",
    left:55,
    width:200,
    bottom:20,
    height:"auto",
    color:"#000000",
    textAlign:"center",
    font: {
        fontSize:13,
        fontWeight:"bold"
    },
    shadowColor:"#999",
});

var actInd = Titanium.UI.createActivityIndicator({
    style:Titanium.UI.iPhone.ActivityIndicatorStyle.DARK,
    left:20,
    bottom:13,
    width:30,
    height:30
});

tableHeader.add(arrow);
tableHeader.add(statusLabel);
tableHeader.add(actInd);

tableView.headerPullView = tableHeader;

tableView.addEventListener('scroll', function(e) {
    var offset = e.contentOffset.y;
    if (offset <= -65.0 && !pulling) {
        var t = Ti.UI.create2DMatrix();
        t = t.rotate(-180);
        pulling = true;
        arrow.animate({
            transform:t,
            duration:180
        });
        statusLabel.text = "Release to refresh...";
    } else if (pulling && offset > -65.0 && offset < 0) {
        pulling = false;
        var t = Ti.UI.create2DMatrix();
        arrow.animate({
            transform:t,
            duration:180
        });
        statusLabel.text = "Pull down to refresh...";
    }
});
tableView.addEventListener('scrollEnd', function(e) {
    Ti.API.info("scrollend");
    if (pulling && !reloading && e.contentOffset.y <= -65.0) {
        reloading = true;
        pulling = false;
        arrow.hide();
        actInd.show();
        statusLabel.text = "Loading...";
        tableView.setContentInsets({
            top:60
        }, {
            animated:true
        });
        arrow.transform=Ti.UI.create2DMatrix();
        beginReloading();
    }
});
if(Titanium.Network.online == false) {
    // エラー表示
    Ti.API.info("offline");
    var errorDialog = Ti.UI.createAlertDialog();
    errorDialog.setTitle("error");
    errorDialog.setMessage("network is unreachable.");
    errorDialog.open();
}

//win.add(loading);

//インジゲーターを表示する。
//showLoadingIndicator();

//データをロードする
loadingData(currentPage);

//Windowにスクロールビューを追加する
win.add(tableView);

////////////////////////////////////////
// method
////////////////////////////////////////

//画面を初期化する
function init() {
    currentPage = 1;
    loadingRowIndex = 0;
    data = [];
    tableView.data = data;
}

function showLoadingIndicator() {
    loading.show();
    loading.animate({
        height: 60,
        duration: 200
    }, function() {
        loadingIndicator.show();
    });
}

function hideLoadingIndicator() {
    loadingIndicator.hide();
    loading.animate({
        height: 1,
        duration: 200
    }, function() {
        loading.hide();
    });
}

function loadingData(page) {

    var samplejson = [{
        "id": 0,
        "tweet": "やべえIKKO見つけた！！！",
        "created_at" : "2011/12/12 12:12:12",
        "user": {
            "name": "okitsu"
        },
        "thumbnail_small": "http://avexnet.jp/image/artist/JPOPa_k/AIL_IKKOX.jpg",
        "point": 344,
        "content_comments_count": 23,
        "address": "横浜市"
    },{
        "id": 1,
        "tweet": "やべえIKKO見つけた！！！",
        "created_at" : "2011/12/12 12:12:12",
        "user": {
            "name": "okitsu"
        },
        "thumbnail_small": "http://avexnet.jp/image/artist/JPOPa_k/AIL_IKKOX.jpg",
        "point": 344,
        "content_comments_count": 23,
        "address": "横浜市"
    },{
        "id": 2,
        "tweet": "やべえIKKO見つけた！！！",
        "created_at" : "2011/12/12 12:12:12",
        "user": {
            "name": "okitsu"
        },
        "thumbnail_small": "http://avexnet.jp/image/artist/JPOPa_k/AIL_IKKOX.jpg",
        "point": 344,
        "content_comments_count": 23,
        "address": "横浜市"
    },
    ];

    var xhr = Titanium.Network.createHTTPClient();
    xhr.open("GET",Ti.App.AppConfig.server.url + win.apiPath + "&page=" + page);
    xhr.onload = function() {
        var json= JSON.parse(this.responseText);
        updateTableView(samplejson);
        hideLoadingIndicator();
    };
    // エラー発生時のイベント
    xhr.onerror = function(error) {
        updateTableView(samplejson);
        hideLoadingIndicator();
    };
    xhr.send();
}

function updateTableView(json) {

    for (var i = 0; i < json.length; i++) {
        // datarowクラスとしてTableViewRowを作成
        var row = Ti.UI.createTableViewRow();
        row.selectedBackgroundColor = '#F59C00';
        row.backgroundColor = '#FCFFD2';
        row.height = 114;
        row.width = "auto";
        row.className = 'row';
        row.contentId = json[i].id;
        row.tweet = json[i].tweet;
        row.userName = json[i].user.name;

        row.addEventListener('click', function(event) {

            var showWindow = Titanium.UI.createWindow({
                backgroundColor: "#FFFFFF",
                url: "showWindow.js",
                contentId: event.row.contentId,
                tweet: event.row.tweet,
                userName: event.row.userName,
                windowTitle: win.title,
                title: "あげあげ"
            });
            showWindow.hideTabBar({
                animated: false
            });
            Titanium.UI.currentTab.open(showWindow);

        });
        var thumb = Ti.UI.createImageView({
            image: json[i].thumbnail_small,
            defaultImage: "",
            top:10,
            left:10,
            width:90,
            height:90,
            borderColor: "#D6D6D6",
            borderWidth: 2,
        });
        thumb.rowNum = i;
        row.add(thumb);

        var user = Ti.UI.createLabel({
            font: {
                fontSize:14,
                fontWeight:'bold',
            },
            color: "#8FE238",
            top:10,
            left:110,
            width:"auto",
            height:"auto",
            text: json[i].user.name
        });
        user.rowNum = i;
        row.add(user);

        var timestamp = Ti.UI.createLabel({
            font: {
                fontSize:14,
            },
            color: "#858587",
            top:10,
            right:10,
            width:"auto",
            height:"auto",
            text: json[i].created_at
        });
        row.add(timestamp);

        var tweet = Ti.UI.createLabel({
            font: {
                fontSize:14,
            },
            left:110,
            top:25,
            height:30,
            width:200,
            text: json[i].tweet
        });
        tweet.rowNum = i;
        row.add(tweet);

        var point = Ti.UI.createLabel({
            font: {
                fontSize:32,
                fontWeight: "bold"
            },
            color: "#FF2E00",
            top: 50,
            left:110,
            width: "auto",
            height: "auto",
            text: json[i].point
        });
        row.add(point);

        var pointUnit = Ti.UI.createImageView({
            image: "images/age_unit.png",
            top:54,
            left:165,
            width: 28,
            height: 28,
        });
        row.add(pointUnit);

        var commentCount = Ti.UI.createLabel({
            font: {
                fontSize:14
            },
            top: 83,
            left: 110,
            width: "auto",
            height: "auto",
            text: 'Comments: '+ json[i].content_comments_count
        });
        //row.add(commentCount);
        
        var listButton = Ti.UI.createImageView({
            image:"images/list_button.png",
            width :26,
            height: 26,
            top:50,
            right:10
        })
        row.add(listButton);

        var rowBorder = Ti.UI.createView({
            backgroundColor:"#B6EE6A",
            height:2,
            bottom:0
        });
        row.add(rowBorder);

        tableView.appendRow(row);
    };

    //もっと読むリンクを削除する
    if(loadingRowIndex > 0) {
        tableView.deleteRow(loadingRowIndex);
    }

    if(json.length == 20) {
        tableView.appendRow(nextRow);
        setTimeout( function() {
            nextLabel.show({
                animated: false
            });
            nextLoading.hide({
                animated: false
            });
        }, 500)
    }

    loadingRowIndex += 20;
}

// PullToReloading
function beginReloading() {
    // just mock out the reload
    setTimeout(endReloading,2000);
}

function endReloading() {
    // simulate loading
    // ここに行を追加する処理を記述する
    //for (var c=lastRow;c<lastRow+10;c++){
    //	tableView.appendRow({title:"Row "+c});
    //}
    //lastRow += 10;

    // もとに戻す
    tableView.setContentInsets({
        top:0
    }, {
        animated:true
    });
    reloading = false;
    statusLabel.text = "Pull down to refresh...";
    statusLabel.font = {
        fontWeight: "bold"
    };
    actInd.hide();
    arrow.show();
}

function formatDate() {
    var date = new Date;
    var datestr = (date.getMonth() + 1) +'/'+date.getDate()+'/'+date.getFullYear();
    if (date.getHours()>=12) {
        datestr+=' '+(date.getHours()==12 ? date.getHours() : date.getHours()-12)+':'+date.getMinutes()+' PM';
    } else {
        datestr+=' '+date.getHours()+':'+date.getMinutes()+' AM';
    }
    return datestr;
}