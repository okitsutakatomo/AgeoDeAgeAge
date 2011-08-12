// this sets the background color of the master UIView (when there are no windows/tab groups on it)
Ti.App.AppConfig = require("config");
Ti.include("lib/twitter_api.js");
//Titanium.UI.setBackgroundColor('#FFF');
Titanium.UI.iPhone.setStatusBarStyle(Titanium.UI.iPhone.StatusBar.OPAQUE_BLACK);

//initialization
Ti.App.twitterApi = new TwitterApi({
    consumerKey: Ti.App.AppConfig.Twitter.consumerKey,
    consumerSecret: Ti.App.AppConfig.Twitter.consumerSecret
});
var twitterApi = Ti.App.twitterApi;
twitterApi.oAuthAdapter.loadAccessToken('twitter');
//twitterApi.init();

/***********************
 //welcome window
 ************************/
var welcomeWindow = Ti.UI.createWindow({
    backgroundColor : "#B9ED78",
    top:0,
    left: 0,
});

var header = Ti.UI.createView({
    layout: 'vertical',
    top: 10,
    height: 300
})

var welcomeText = Ti.UI.createLabel({
    color: "#000000",
    text: "上尾であげあげへようこそ。上尾であげあげは、埼玉県上尾市の活性化の目的としたあげあげコミュニケーションメディアです。",
    width: 280,
    font: {
        size:8
    },
    textAlign: "left",
    height: "auto",
})

header.add(welcomeText);
welcomeWindow.add(header);

var body = Ti.UI.createView({
    layout: 'vertical',
    top: 300,
    height: 100,
})

var twitterLogin = Ti.UI.createButton({
    title: "ツイッターにログイン",
    width: 280,
    height: 40,
    textAligh: "center"
});

var twitterSignup = Ti.UI.createButton({
    title: "ツイッターアカウントを作成",
    top: 20,
    width: 280,
    height: 40,
    textAligh: "center"
});

body.add(twitterLogin);
body.add(twitterSignup);
welcomeWindow.add(body);

var mini_chara_img = Ti.UI.createImageView({
    image: "images/mini_afro.png",
    width: 58,
    height: 48,
    bottom: -48,//枠外に表示
    left: 120,
    zIndex: 99,
})

var onpu = Ti.UI.createImageView({
    image: "images/onpu.png",
    width: 16,
    height: 19,
    bottom: 25,
    left: 178,
    zIndex: 99,
    visible: false
})

welcomeWindow.add(mini_chara_img);
welcomeWindow.add(onpu);

//アフロミニおやじのアニメーション
var animation = Ti.UI.createAnimation({
    duration: 1000,
    delay:1000,
    bottom: 0,
    curve: Titanium.UI.ANIMATION_CURVE_EASE_OUT
}, function() {
    onpu.animate({
        visible:true
    }, function() {
        onpu.animate({
            curve: Titanium.UI.ANIMATION_CURVE_EASE_IN,
            dulation: 50,
            bottom: 40,
        }, function() {
            onpu.animate({
                curve: Titanium.UI.ANIMATION_CURVE_EASE_IN,
                dulation: 1000,
                bottom: 25,
            }, function() {
                onpu.animate({
                    duration: 1000,
                    delay:3000,
                    bottom: -23,
                    curve: Titanium.UI.ANIMATION_CURVE_EASE_OUT
                }, function() {
                    onpu.animate({
                        bottom: 25,
                        visible: false
                    })
                });
                mini_chara_img.animate({
                    duration: 1000,
                    delay:3000,
                    bottom: -48,
                    curve: Titanium.UI.ANIMATION_CURVE_EASE_OUT
                })
            })
        })
    })
})
mini_chara_img.animate(animation);

twitterLogin.addEventListener("click", function(e) {
    var receivePin = function() {
        twitterApi.oAuthAdapter.getAccessToken('https://api.twitter.com/oauth/access_token');
        twitterApi.oAuthAdapter.saveAccessToken('twitter');
        welcomeWindow.close();
        openTabGroup();
    };
    twitterApi.oAuthAdapter.showAuthorizeUI('https://api.twitter.com/oauth/authorize?' +
    twitterApi.oAuthAdapter.getRequestToken('https://api.twitter.com/oauth/request_token'), receivePin);
});
twitterSignup.addEventListener("click", function(e) {
    Titanium.Platform.openURL("http://twitter.com"); //Safariで開く
});
/***********************
 //tab group
 ************************/

// create tab group
var tabGroup = Titanium.UI.createTabGroup();

//
// create base UI tab and root window
//
var win0 = Titanium.UI.createWindow({
    title:'あげあげ一覧',
    url: "listWindow.js"
});

var tab0 = Titanium.UI.createTab({
    icon:'KS_nav_views.png',
    title:'あげあげ一覧',
    window:win0
});

var win1 = Titanium.UI.createWindow({
    title:'人気',
    url: "homeWindow.js"
});

var tab1 = Titanium.UI.createTab({
    icon:'KS_nav_views.png',
    title:'人気',
    window:win1
});

var win2 = Titanium.UI.createWindow({
    title:'Newあげあげ',
    url: "mapWindow.js"
});
var tab2 = Titanium.UI.createTab({
    // icon:'KS_nav_ui.png',
    title:'Newあげあげ',
    // window:win2
});

var win3 = Titanium.UI.createWindow({
    title:'Tab 3',
    url: "showWindow.js"
});

var tab3 = Titanium.UI.createTab({
    icon:'KS_nav_views.png',
    title:'Tab 3',
    window:win3
});

var win4 = Titanium.UI.createWindow({
    title:'Tab 4',
    url: "showWindow.js"
});

var tab4 = Titanium.UI.createTab({
    icon:'KS_nav_views.png',
    title:'Tab 4',
    window:win4
});

//
//    add tabs
//
tabGroup.addTab(tab0);
tabGroup.addTab(tab1);
tabGroup.addTab(tab2);
tabGroup.addTab(tab3);
tabGroup.addTab(tab4);

var share_button = Ti.UI.createImageView({
    image: "images/afro_pink.png",
    bottom: 12,
    width: 50,
    height: 52,
})

tabGroup.add(share_button);

share_button.addEventListener("click", function() {
    var cameraWindow = Titanium.UI.createWindow({
        url: "cameraWindow.js",
    });
    cameraWindow.open();
    cameraWindow.hideTabBar();
    //Titanium.UI.currentTab.open(cameraWindow);
})
if (twitterApi.oAuthAdapter.isAuthorized() == false) {
    openWelcomeWindow();
} else {
    openTabGroup();
}

function openWelcomeWindow() {
    welcomeWindow.open();
}

function openTabGroup() {
    tabGroup.open({
        animated: true
    });
}