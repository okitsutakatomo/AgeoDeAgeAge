var win = Titanium.UI.currentWindow;
var twitterApi = Ti.App.twitterApi;

var baseView = Ti.UI.createView({
	width: 320,
	height: 240,
	top: 0,
	backgroundColor: "#666666"
});

var imageView = Titanium.UI.createImageView({
	width: "auto",
	height: "auto",
	image: win.media
});

var submitButton = Ti.UI.createButton({
	bottom: 10,
	width: 280,
	height: 40,
	title: "あげあげを送信する"
});

submitButton.addEventListener("click", function() {
	showIndicator();
	uploadToTwitPic(imageView.image);
})
baseView.add(imageView);
win.add(baseView);
win.add(submitButton);

var actInd = Titanium.UI.createActivityIndicator();

function uploadToTwitPic(image) {
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
		Ti.API.info('#####ONSENDSTREAM - PROGRESS: ' + e.progress);
	};
	xhr.open('POST','http://api.twitpic.com/2/upload.json');
	xhr.setRequestHeader('X-Verify-Credentials-Authorization',header);
	xhr.setRequestHeader('X-Auth-Service-Provider',verifyURL);

	//	showIndicator();
	xhr.send({
		key: Ti.App.AppConfig.Twitter.twitPicApyKey,
		message: "あげあげtest",
		media: image
	});
}

function tweet(twitPicResJson) {

	var text = twitPicResJson.text + " " + twitPicResJson.url

	twitterApi.statuses_update({
		onSuccess: function(responce) {
			alert('tweet success');
			hideIndicator();
		},
		onError: function(error) {
			alert('tweet error');
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
	actInd.style = Titanium.UI.iPhone.ActivityIndicatorStyle.PLAIN;
	actInd.font = {
		fontFamily:'Helvetica Neue',
		fontSize:15,
		fontWeight:'bold'
	};
	actInd.color = 'white';
	actInd.message = 'Uploading...';
	win.setToolbar([actInd], {
		animated:true
	});
	actInd.show();
}

function hideIndicator() {
	actInd.hide();
	win.setToolbar(null, {
		animated:true
	});
}