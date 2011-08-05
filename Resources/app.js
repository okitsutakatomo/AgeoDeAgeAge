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
});

var title = Ti.UI.createView({
	text: "上尾であげあげ",
	top: 20,
	textAligh: "center"
});

var twitterLogin = Ti.UI.createButton({
	title: "ツイッターにログイン",
	top: 200,
	width: 280,
	height: 40,
	textAligh: "center"
});

var twitterSignup = Ti.UI.createButton({
	title: "ツイッターアカウントを作成",
	top: 260,
	width: 280,
	height: 40,
	textAligh: "center"
});

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
	Titanium.Platform.openURL(currentUrl); //Safariで開く
});
welcomeWindow.add(title);
welcomeWindow.add(twitterLogin);
welcomeWindow.add(twitterSignup);

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
	title:'アゲ写',
	url: "homeWindow.js"
});

var tab1 = Titanium.UI.createTab({
	icon:'KS_nav_views.png',
	title:'アゲ写',
	window:win1
});
//
// //
// // create controls tab and root window
// //
var win2 = Titanium.UI.createWindow({
	title:'Tab 2',
	url: "mapWindow.js"
});
var tab2 = Titanium.UI.createTab({
	icon:'KS_nav_ui.png',
	title:'Tab 2',
	window:win2
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

//
//  add tabs
//
tabGroup.addTab(tab0);
tabGroup.addTab(tab1);
tabGroup.addTab(tab2);
tabGroup.addTab(tab3);

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