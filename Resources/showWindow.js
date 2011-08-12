var win = Titanium.UI.currentWindow;
win.barColor = '#79D448';
win.backgroundColor = "#FCFFD2";

var baseView = Titanium.UI.createTableView({
    backgroundImage: "images/bg.png",
    separatorColor:'transparent',
    width: 320,
    height: 180,
    top: 0
});

var imageView = Titanium.UI.createImageView({
    top: 10,
    width: "160",
    height: "160",
    image: "http://avexnet.jp/image/artist/JPOPa_k/AIL_IKKOX.jpg",
    borderWidth: 10,
    borderColor: "#FFFFFF"
});

baseView.add(imageView);

var textLabel = Ti.UI.createLabel({
    text : "IKKO見つけた！",
    font: {
        fontSize:18,
        color: "#000000",
    },
    top: 190,
    width: "auto",
    height: "auto",
    left: 10
});

var point = Ti.UI.createLabel({
    font: {
        fontSize:44,
        fontWeight: "bold"
    },
    color: "#FF2E00",
    top: 180,
    right:60,
    width: "auto",
    height: "auto",
    text: "344"
});

var pointUnit = Ti.UI.createImageView({
    image: "images/age_unit.png",
    top: 188,
    right:15,
    width: 36,
    height: 36,
});

var button = Ti.UI.createButton({
    backgroundImage:"images/ageage_button.png",
    width: 201,
    height: 110,
    top: 240
});

win.add(baseView);
win.add(textLabel);
win.add(point);
win.add(pointUnit);
win.add(button);

// var counterValue = 0;
// var timer;
//
// var baseView = Ti.UI.createView({
// });
//
// var ageageButton = Ti.UI.createButton({
// title: "あげあげ",
// top: 10,
// height: 40,
// width: 300
// });
//
// var label = Ti.UI.createLabel({
// text: "0",
// top: 60,
// width: 320,
// height: 30,
// textAlign: "center"
// });
//
// var textArea = Ti.UI.createTextArea({
// height:150,
// width:300,
// top:100,
// font: {
// fontSize:20
// },
// borderWidth:2,
// borderColor:'#bbb',
// borderRadius:5
// });
//
// var postButton = Ti.UI.createButton({
// top: 270,
// right: 10,
// width: 100,
// height: 44,
// title: 'POST'
// });
//
// Ti.include('lib/oauth_adapter.js');
// var oAuthAdapter = new OAuthAdapter(
// 'R8yQg0wiY1IZterDlhUeZFpJTVmRJWP0DkOOnfm6aM',
// 'sw6t3JfjsYmOknlwz1aw',
// 'HMAC-SHA1'
// );
//
// oAuthAdapter.loadAccessToken('twitter');
//
// function tweet(message) {
// oAuthAdapter.send(
// 'https://api.twitter.com/1/statuses/update.json',
// [['status', message]],
// 'Twitter', //アラートのタイトル
// 'Published.', //成功したときのアラートメッセージ
// 'Not published.' //失敗したときのアラートメッセージ
// );
//
// if (oAuthAdapter.isAuthorized() == false) {
// var receivePin = function() {
// oAuthAdapter.getAccessToken(
// 'https://api.twitter.com/oauth/access_token'
// );
// oAuthAdapter.saveAccessToken('twitter');
// };
// oAuthAdapter.showAuthorizeUI(
// 'https://api.twitter.com/oauth/authorize?' +
// oAuthAdapter.getRequestToken(
// 'https://api.twitter.com/oauth/request_token'
// ),
// receivePin
// );
// }
// }
//
// postButton.addEventListener('click', function() {
// if (textArea.value) {
// tweet(textArea.value);
// }
// });
// ageageButton.addEventListener('click', function(e) {
// if(timer) {
// clearTimeout(timer)
// }
// label.text = ++counterValue;
// timer = setTimeout( function() {
// ageageButton.enabled = false;
// Ti.UI.createAlertDialog({
// title:'OK!!',
// message:"OKOKOK!!!"
// }).show();
// }, 3000);
// });
// baseView.add(ageageButton);
// baseView.add(label);
// baseView.add(textArea);
// baseView.add(postButton);
//
// win.add(baseView);