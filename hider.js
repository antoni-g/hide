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


$( document ).ready(function() {
   var mainCanvas = document.querySelector("#myCanvas");
var mainContext = mainCanvas.getContext("2d");
var canvasWidth = mainCanvas.width;
var canvasHeight = mainCanvas.width;
mainCanvas.width = backingScale(mainContext)*canvasWidth;
mainCanvas.height = backingScale(mainContext)*canvasHeight;
var requestAnimationFrame = window.requestAnimationFrame ||
  window.mozRequestAnimationFrame ||
  window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;


var seekerDistance = 30;
var seekerAngle = 70;
mainContext.translate(canvasWidth/2, canvasHeight/2);

second = 0;

function drawCircle() {
  mainContext.clearRect(-canvasWidth/2, -canvasHeight/2, canvasWidth, canvasHeight);

  // color in the background
  mainContext.fillStyle = "#EEEEEE";
  mainContext.fillRect(-canvasWidth/2, -canvasHeight/2, canvasWidth, canvasHeight);

  // draw the circle
  mainContext.beginPath();

  var radius = canvasWidth/2-30;
  mainContext.arc(0, 0, radius, 0, Math.PI * 2, false);
  mainContext.closePath();
mainContext.fillStyle = "#FFFFFF";
  mainContext.fill();
  mainContext.beginPath();
  mainContext.arc(0, 0, 10, 0, Math.PI * 2, false);
  mainContext.closePath();
  // color in the circle
  mainContext.fillStyle = "black";
  mainContext.fill();

  second++;
  if (second > 360) {
    second = 0;
  }
  drawSeekerLocation(mainContext, seekerAngle, seekerDistance);
  drawHand(mainContext, second/180*Math.PI, radius, 5);
  requestAnimationFrame(drawCircle);
}
function drawHand(ctx, pos, length, width) {
    ctx.beginPath();
    ctx.shadowBlur = 20;
    ctx.shadowColor = "black";
    ctx.lineWidth = width;
    ctx.lineCap = "round";
    ctx.moveTo(0,0);
    ctx.rotate(pos);
    ctx.lineTo(0, -length);
    ctx.stroke();
    ctx.rotate(-pos);
    ctx.shadowBlur = 0;
    
}
drawCircle();

});
function updateSeekerLocation(){
  console.log("updating seeker location")
  var distance;
  db.collection('default').find({hider: false}, { limit: 10}).asArray().then(docs => {
      console.log(docs)
      docs.forEach(function(i){if(docs[i]["hider"] == false){
          seekerDistance = calcDistance(crd.longitude, crd.latitude, docs[i]["location"]["coordinates"][0], docs[i]["location"]["coordinates"][1])
          seekerAngle = Math.acos(docs[i]["location"]["coordinates"][0]/seekerDistance);
          console.log(seekerDistance, seekerAngle);
        }})

    })

}

window.setInterval(function(){
updateSeekerLocation();
}, 1000);

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

function backingScale(context) {

    if ('devicePixelRatio' in window) {

        if (window.devicePixelRatio > 1) {

            return window.devicePixelRatio;

        }

    }

    return 1;
}
function drawSeekerLocation(ctx, seekerDistance, seekerAngle){
  ctx.shadowBlur = 20;
  ctx.shadowColor = "gray";
  ctx.beginPath();
  ctx.arc(seekerDistance*Math.cos(seekerAngle/180*Math.PI), seekerDistance*Math.sin(seekerAngle/180*Math.PI), 7, 0, Math.PI * 2, false);
  ctx.closePath();
  ctx.fillStyle = "#737373";
  ctx.fill();
  ctx.shadowBlur = 0;
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
        },
        updateTime: new Date().getTime(),
        hider: true

      }
    }, {upsert:true})
}
function error(err) {
  console.warn('ERROR(' + err.code + '): ' + err.message);
}
var id = navigator.geolocation.watchPosition(success, error, options);

