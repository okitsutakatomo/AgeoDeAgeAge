var win = Titanium.UI.currentWindow;
var twitterApi = Ti.App.twitterApi;
win.barColor = '#79D448';

var sourceSelect = Titanium.UI.createOptionDialog({
    options:['撮影する', 'アルバムから選ぶ', 'キャンセル'],
    cancel:2,
    title:'アゲアゲを激写'
});

sourceSelect.addEventListener('click', function(e) {
    switch( e.index ) {
        case 0:
            startCamera();
            break;
        case 1:
            selectFromPhotoGallery();
            break;
        default:
            win.close();
            break;
    }
});
sourceSelect.show();

function startCamera() {
    Titanium.Media.showCamera({
        success: function(event) {
            var image = event.media;
            var uploadWindow = Titanium.UI.createWindow({
                url: "uploadWindow.js",
                media: image,
                title: "Newあげあげ",
            });
            uploadWindow.open({
                transition:Titanium.UI.iPhone.AnimationStyle.CURL_UP
            });
            // win.close();
        },
        //cancel:function(){},
        error: function(error) {
            if (error.code == Titanium.Media.NO_CAMERA) {
                alert('カメラがありません');
            }
        },
        saveToPhotoGallery:true,
        allowEditing:true,
        mediaTypes:[Ti.Media.MEDIA_TYPE_PHOTO]
    });
}

function selectFromPhotoGallery() {
    Ti.Media.openPhotoGallery({
        success: function(event) {
            var image = event.media;
            var uploadWindow = Titanium.UI.createWindow({
                url: "uploadWindow.js",
                media: image,
                title: "Newあげあげ"
            });
            uploadWindow.open({
                transition:Titanium.UI.iPhone.AnimationStyle.CURL_UP
            });
            //			Titanium.UI.currentTab.open(uploadWindow);
            // win.close();
        },
        // error:  function(error) { },
        // cancel: function() { },
        allowEditing: true,
        mediaTypes:[Ti.Media.MEDIA_TYPE_PHOTO]
    });
}