const client = stitch.Stitch.initializeDefaultAppClient("hide-yntsk");
client.auth.loginWithCredential(new stitch.AnonymousCredential());
  // Get a MongoDB Service Client
  const mongodb = client.getServiceClient(
    stitch.RemoteMongoClient.factory,
    "mongodb-atlas"
  );
const db = mongodb.db("game");


$( document ).ready(function() {
   var mainCanvas = document.querySelector("#myCanvas");
var mainContext = mainCanvas.getContext("2d");

var canvasWidth = mainCanvas.width;
var canvasHeight = mainCanvas.width;
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
