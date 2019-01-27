const client = stitch.Stitch.initializeDefaultAppClient('hide-yntsk');

  const db = client.getServiceClient(stitch.RemoteMongoClient.factory, 'mongodb-atlas').db('game');

  client.auth.loginWithCredential(new stitch.AnonymousCredential()).then(user =>
    db.collection('default').updateOne({owner_id: client.auth.user.id}, {$set:{number:42}}, {upsert:true})
  ).then(() =>
    db.collection('default').find({owner_id: client.auth.user.id}, { limit: 100}).asArray()
  ).then(docs => {
      console.log("Found docs", docs)
      console.log("[MongoDB Stitch] Connected to Stitch")
      console.log(db.collection("default").find({}).asArray());

  }).catch(err => {
    console.error(err)
  });


window.setInterval(function(){
var distance;
db.collection('default').find({}, { limit: 100}).asArray().then(docs => {
	db.collection('default').find({owner_id: {$not: client.auth.user.id}}, { limit: 100}).asArray().then(docs => 
		{
			console.log(docs)
			console.log("calculating distance")
			$('#distance').html(getMin(docs));
		})

})

}, 5000);

function calcDistance(lat1, lon1, lat2, lon2, lat2){

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
  db.collection('default').updateOne({owner_id: client.auth.user.id}, {
    $set:{
      location:{
        type: "Point", coordinates: [
          crd.longitude, crd.latitude]
        }
      }
    }, {upsert:true})
  console.log(crd);
}
function error(err) {
  console.warn('ERROR(' + err.code + '): ' + err.message);
}

var id = navigator.geolocation.watchPosition(success, error, options);


function getMin(arr) {
    var min;
    for (var i=0 ; i<arr.length ; i++) {
    	var dist = calcDistance(crd.longitude, crd.latitude, arr[i]["location"]["coordinates"][0], arr[i]["location"]["coordinates"][1])
        if (!min || dist < min){
        	console.log(dist)
            min = dist;
        }
    }
    return min;
}