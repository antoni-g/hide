const client = stitch.Stitch.initializeDefaultAppClient('hide-yntsk');

  const db = client.getServiceClient(stitch.RemoteMongoClient.factory, 'mongodb-atlas').db('game');

  client.auth.loginWithCredential(new stitch.AnonymousCredential())


window.setInterval(function(){
var distance;
db.collection('default').find({}, { limit: 100}).asArray().then(docs => {
	$('#distance').html(getMin(docs).toFixed(2));
})

}, 500);


function calcDistance(lat1, lon1, lat2, lon2){  // generally used geo measurement function
    var R = 6378.137; // Radius of earth in KM
    var dLat = lat2 * Math.PI / 180 - lat1 * Math.PI / 180;
    var dLon = lon2 * Math.PI / 180 - lon1 * Math.PI / 180;
    var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon/2) * Math.sin(dLon/2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    var d = R * c;
    return d * 1000; // meters
}

var target = {
  latitude : 0,
  longitude: 0
};

var options = {
  enableHighAccuracy: true,
  timeout: 100000,
  maximumAge: 0
};
var crd;
function success(pos) {
  crd = pos.coords;
  db.collection('default').updateMany({owner_id: client.auth.user.id}, {
    $set:{
      location:{
        type: "Point", coordinates: [
          crd.longitude, crd.latitude]
        },
        updateTime: new Date().getTime(),
        hider: false
      }
    }, {upsert:true})
}
function error(err) {
  console.warn('ERROR(' + err.code + '): ' + err.message);
}

var id = navigator.geolocation.watchPosition(success, error, options);


function getMin(arr) {
    var min;
    min = 100;
    for (var i=0 ; i<arr.length ; i++) {
    	if(arr[i]["hider"] == false){
    		continue;
    	}

    	var dist = calcDistance(crd.longitude, crd.latitude, arr[i]["location"]["coordinates"][0], arr[i]["location"]["coordinates"][1])
        if (!min || dist < min){
        	console.log(dist)
            min = dist;
        }
    }
    return min;
}