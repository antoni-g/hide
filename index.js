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
  if(second == seekerAngle){
    console.log(second, seekerAngle)
    updateSeekerLocation(seekerDistance);
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
function updateSeekerLocation(seekerDistance){
  seekerDistance = 10;
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

setInterval(function() {
  if ("geolocation" in navigator){ //check geolocation available 
  //try to get user current location using getCurrentPosition() method
  navigator.geolocation.getCurrentPosition(function(position){ 
      console.log("Found your location \nLat : "+position.coords.latitude+" \nLang :"+ position.coords.longitude);
    });
}else{
  console.log("Browser doesn't support geolocation!");
}
}, 1000);
