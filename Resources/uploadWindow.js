var win = Titanium.UI.currentWindow;
win.backgroundColor = "#FCFFD2";
win.barColor = '#79D448';
//win.layout = "vertical";

var actInd = Titanium.UI.createActivityIndicator({
    top:350, 
    height:50,
    width:10,
    style:Titanium.UI.iPhone.ActivityIndicatorStyle.DARK
});

var twitterApi = Ti.App.twitterApi;

var baseView = Titanium.UI.createTableView({
    backgroundImage: "images/bg.png",
    separatorColor:'transparent',
    width: 320,
    height: 300,
    top: 0
});

var back = Titanium.UI.createButton({
    title:"やめる",
    color: "#FFFFFF",
    style:Titanium.UI.iPhone.SystemButtonStyle.BORDERED,
    right: 0,
});

back.addEventListener("click", function() {
  win.close({top:480, duration: 500});
});
var toolbar = Titanium.UI.createToolbar({
    items:[back],
    top:0,
    barColor:'#79D448',
});

baseView.add(toolbar);

var imageView = Titanium.UI.createImageView({
    top: 50,
    width: "240",
    height: "240",
    image: win.media,
    borderWidth: 10,
    borderColor: "#FFFFFF"
});

baseView.add(imageView)

var formView = Ti.UI.createView({
    layout: "vertical"
});

var tweetLabel = Ti.UI.createLabel({
    text: "ツイート",
    font: {
        fontSize:16,
        color: "#000000",
        fontWeight: "bold",
    },
    top: 310,
    left: 10,
    width: "auto",
    height: "auto",
})

var textArea = Ti.UI.createTextArea({
    top: 310,
    right: 10,
    height: 90,
    width: 230,
    font: {
        fontSize:16
    },
    borderWidth:1,
    borderColor:'#bbb',
    borderRadius:5
});

var submitButton = Ti.UI.createButton({
    bottom: 10,
    width: 300,
    height: 40,
    title: "あげあげをつぶやく"
});

submitButton.addEventListener("click", function() {
    showIndicator();
    uploadToTwitPic(imageView.image, textArea.value);
})
// formView.add(textArea);
// formView.add(submitButton);

baseView.add(imageView);
win.add(baseView);
win.add(tweetLabel);
win.add(textArea);
win.add(submitButton);

function uploadToTwitPic(image, text) {
    var xhr = Ti.Network.createHTTPClient();

    var verifyURL = 'https://api.twitter.com/1/account/verify_credentials.json';
    var params = {
        url:verifyURL,
        method: 'GET'
    };
    var header = twitterApi.oAuthAdapter.createOAuthHeader(params);

    xhr.onload = function() {
        var resJson = JSON.parse(this.responseText);
        updateData(resJson, 0, 0);
    };
    xhr.onerror = function() {
        alert("アップロードに失敗しました");
        hideIndicator();
    };
    xhr.onsendstream = function(e) {
        //Ti.API.info('#####ONSENDSTREAM - PROGRESS: ' + e.progress);
    };
    xhr.open('POST','http://api.twitpic.com/2/upload.json');
    xhr.setRequestHeader('X-Verify-Credentials-Authorization',header);
    xhr.setRequestHeader('X-Auth-Service-Provider',verifyURL);

    //	showIndicator();
    xhr.send({
        key: Ti.App.AppConfig.Twitter.twitPicApyKey,
        message: text,
        media: image
    });
}

function tweet(twitPicResJson) {

    var text = twitPicResJson.text + " " + twitPicResJson.url

    twitterApi.statuses_update({
        onSuccess: function(responce) {
            hideIndicator();
        },
        onError: function(error) {
            hideIndicator();
        },
        parameters: {
            status: text
        }
    });
}

function updateData(twitPicResJson, latitude, longitude) {
    //TODO サーバにデータを送信する
    tweet(twitPicResJson);
}

function showIndicator() {
    submitButton.title = "アップロード中..."
    actInd.style = Titanium.UI.iPhone.ActivityIndicatorStyle.DARK;
    actInd.font = {fontFamily:'Helvetica Neue', fontSize:15,fontWeight:'bold'};
    actInd.color = 'black';
    actInd.message = 'Loading...';
    actInd.width = 210;
    actInd.show();
}

function hideIndicator() {
    actInd.hide();
}