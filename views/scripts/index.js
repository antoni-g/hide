var mainCanvas = document.querySelector("#myCanvas");
var mainContext = mainCanvas.getContext("2d");

var canvasWidth = mainCanvas.width;
var canvasHeight = mainCanvas.height;
var requestAnimationFrame = window.requestAnimationFrame ||
  window.mozRequestAnimationFrame ||
  window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
mainContext.translate(225, 225);

second = 0;

function drawCircle() {
  mainContext.clearRect(-225, -225, canvasWidth, canvasHeight);

  // color in the background
  mainContext.fillStyle = "#EEEEEE";
  mainContext.fillRect(-225, -225, canvasWidth, canvasHeight);

  // draw the circle
  mainContext.beginPath();

  var radius = 175;
  mainContext.arc(0, 0, radius, 0, Math.PI * 2, false);
  mainContext.closePath();

  // color in the circle
  mainContext.fillStyle = "#FFFFFF";
  mainContext.fill();

  second++;
  if (second > 59) {
    second = 0;
  }
  console.log(second);
  drawHand(mainContext, second/30*Math.PI, 175, 5);
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

