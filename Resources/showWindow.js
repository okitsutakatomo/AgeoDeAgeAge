var win = Titanium.UI.currentWindow;

var counterValue = 0;
var timer;

var baseView = Ti.UI.createView({
});

var ageageButton = Ti.UI.createButton({
	title: "あげあげ",
	top: 10,
	height: 40,
	width: 300
});

var label = Ti.UI.createLabel({
	text: "0",
	top: 60,
	width: 320,
	height: 30,
	textAlign: "center"
});

var textArea = Ti.UI.createTextArea({
	height:150,
	width:300,
	top:100,
	font: {
		fontSize:20
	},
	borderWidth:2,
	borderColor:'#bbb',
	borderRadius:5
});

var postButton = Ti.UI.createButton({
	top: 270,
	right: 10,
	width: 100,
	height: 44,
	title: 'POST'
});

Ti.include('lib/oauth_adapter.js');
var oAuthAdapter = new OAuthAdapter(
'R8yQg0wiY1IZterDlhUeZFpJTVmRJWP0DkOOnfm6aM',
'sw6t3JfjsYmOknlwz1aw',
'HMAC-SHA1'
);

oAuthAdapter.loadAccessToken('twitter');

function tweet(message) {
	oAuthAdapter.send(
	'https://api.twitter.com/1/statuses/update.json',
	[['status', message]],
	'Twitter', //アラートのタイトル
	'Published.', //成功したときのアラートメッセージ
	'Not published.' //失敗したときのアラートメッセージ
	);

	if (oAuthAdapter.isAuthorized() == false) {
		var receivePin = function() {
			oAuthAdapter.getAccessToken(
			'https://api.twitter.com/oauth/access_token'
			);
			oAuthAdapter.saveAccessToken('twitter');
		};
		oAuthAdapter.showAuthorizeUI(
		'https://api.twitter.com/oauth/authorize?' +
		oAuthAdapter.getRequestToken(
		'https://api.twitter.com/oauth/request_token'
		),
		receivePin
		);
	}
}

postButton.addEventListener('click', function() {
	if (textArea.value) {
		tweet(textArea.value);
	}
});
ageageButton.addEventListener('click', function(e) {
	if(timer) {
		clearTimeout(timer)
	}
	label.text = ++counterValue;
	timer = setTimeout( function() {
		ageageButton.enabled = false;
		Ti.UI.createAlertDialog({
			title:'OK!!',
			message:"OKOKOK!!!"
		}).show();
	}, 3000);
});
baseView.add(ageageButton);
baseView.add(label);
baseView.add(textArea);
baseView.add(postButton);

win.add(baseView);