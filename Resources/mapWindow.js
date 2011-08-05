var win = Titanium.UI.currentWindow;
//win.barColor = '#000000';
//win.hideNavBar({animated: false});


var mapview = Titanium.Map.createView({
  width: 320,
    height: 460,
    mapType: Titanium.Map.STANDARD_TYPE,
    region:{latitude:40.0, longitude:130, latitudeDelta:30, longitudeDelta:30},
    animate:true,
    regionFit:true,
    userLocation:true,
});


Titanium.Geolocation.purpose = 'Twitter投稿のため';

function setCurrentPosition () {
  Titanium.Geolocation.getCurrentPosition(function(e) {
    if (!e.success || e.error){
      alert('位置情報が取得できませんでした');
      return;
    }

    latitude = e.coords.latitude;
    longitude = e.coords.longitude;
    Ti.API.info(latitude);
    Ti.API.info(longitude);

    var currentPos = Titanium.Map.createAnnotation({
      latitude:latitude,
        longitude:longitude,
        title:"上尾でIKKO見つけたー！！！！",
        subtitle:"21分前 アゲポイント:329",
        pincolor:Titanium.Map.ANNOTATION_GREEN,
        //image: "http://a0.twimg.com/profile_images/70616038/1520969_2886090893_reasonably_small.jpg",
        //rightView: image,
        rightButton: Titanium.UI.iPhone.SystemButton.DISCLOSURE,
        //image: "KS_nav_ui.png",
        animate:true
    });
    
    var currentPos2 = Titanium.Map.createAnnotation({
      latitude:latitude - 0.01,
        longitude:longitude- 0.01,
        pincolor:Titanium.Map.ANNOTATION_GREEN,
        animate:true
    });
    
    var currentPos3 = Titanium.Map.createAnnotation({
      latitude:latitude - 0.02,
        longitude:longitude- 0.01,
        pincolor:Titanium.Map.ANNOTATION_GREEN,
        animate:true
    });

    var currentPos4 = Titanium.Map.createAnnotation({
      latitude:latitude - 0.03,
        longitude:longitude- 0.004,
        pincolor:Titanium.Map.ANNOTATION_GREEN,
        animate:true
    });


    Titanium.Geolocation.reverseGeocoder(latitude,longitude,function(evt){
      if (evt.success) {
        Ti.API.info(evt);
        var places = evt.places;
        if (places && places.length) {
          Ti.API.info(places);
          Ti.API.info(places[0].address);
          Ti.API.info(places[0].city);
        }
      }  else {
        Ti.UI.createAlertDialog({
          title:'Reverse geo error',
          message:evt.error
        }).show();
      }
    });

    mapview.addAnnotation(currentPos);
    mapview.addAnnotation(currentPos2);
    mapview.addAnnotation(currentPos3);
    mapview.addAnnotation(currentPos4);
    //mapview.show();

    mapview.setLocation({
      latitude:latitude,
      longitude:longitude,
      latitudeDelta:0.01,
      longitudeDelta:0.01
    });

  });
}


//mapview.hide();
win.add(mapview);
setCurrentPosition();

