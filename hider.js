
var seekerDistance = 0;
var seekerAngle = 0;
var seekerOpacity = 1;
var drawing = false;
var multiplier = 1;
var hiders = [];

const client = stitch.Stitch.initializeDefaultAppClient('hide-yntsk');

  const db = client.getServiceClient(stitch.RemoteMongoClient.factory, 'mongodb-atlas').db('game');

  client.auth.loginWithCredential(new stitch.AnonymousCredential())



$( document ).ready(function() {
   var mainCanvas = document.querySelector("#myCanvas");
var mainContext = mainCanvas.getContext("2d");
var canvasWidth = mainCanvas.width;
var canvasHeight = mainCanvas.height;
mainCanvas.width = backingScale(mainContext)*canvasWidth;
mainCanvas.height = backingScale(mainContext)*canvasHeight;
var requestAnimationFrame = window.requestAnimationFrame ||
  window.mozRequestAnimationFrame ||
  window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;


mainContext.translate(canvasWidth/2, canvasHeight/2);
mainContext.rotate(-Math.PI/2)
second = 0;

function drawCircle() {
  mainContext.clearRect(-canvasWidth/2, -canvasHeight/2, canvasWidth, canvasHeight);

  // color in the background
  mainContext.fillStyle = "#FFFFFF";
  mainContext.fillRect(-canvasWidth/2, -canvasHeight/2, canvasWidth, canvasHeight);

  // draw the circle
  mainContext.beginPath();

  var radius = canvasWidth/2-30;
  mainContext.arc(0, 0, radius, 0, Math.PI * 2, false);
  mainContext.closePath();
  mainContext.fillStyle = "#EEEEEE";
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

  var handAngle = second
  var tempSeekerAngle = Math.round(seekerAngle)+90
  if (tempSeekerAngle > 360) {
    tempSeekerAngle -= 360;
  }
  if (second === tempSeekerAngle) {
    drawing = true;
    seekerOpacity = 1;
  }
  if (drawing) {
    drawSeekerLocation(mainContext,seekerOpacity);
    seekerOpacity*=.99;
  }
  if (seekerOpacity < .02) {
    drawing = false;
  }  
  hiders.forEach(function(el) {
    if (Math.round(el.angle)+90 === second || el.drawing) {
      if (!el.drawing) {
        el.opacity = 1;
        el.drawing = true;
      }
      if (el.opacity > .01 && el.dist > .5) {
        drawHiderLocation(mainContext,el.opacity,el.dist,el.angle);
        el.opacity *= .98;
      }
      else {
        el.drawing = false;
        var ind = hiders.indexOf(el);
        hiders.splice(ind, 1);
      }
    }
  });
  drawHand(mainContext, second/180*Math.PI, radius, 5);

  drawLine(mainContext);

  

  requestAnimationFrame(drawCircle);
}

function drawHand(ctx, pos, length, width) {
    ctx.beginPath();
    ctx.strokeStyle = 'rgba(0,0,0,1)';
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

};
drawCircle();
function updateSeekerLocation(){
  var distance;
  db.collection('default').find({}, { limit: 10}).asArray().then(docs => {
      if (!crd) {
        console.log('local location error')
        return;
      }
      docs.forEach(function(i){
        if (i) {
          if(i["hider"] === false){
            seekerDistance = multiplier*calcDistance(crd.longitude, crd.latitude, i["location"]["coordinates"][0], i["location"]["coordinates"][1])
            seekerAngle = angle(crd.longitude, crd.latitude, i["location"]["coordinates"][0], i["location"]["coordinates"][1]);
          }
          else {
            var hiderDistance = multiplier*calcDistance(crd.longitude, crd.latitude, i["location"]["coordinates"][0], i["location"]["coordinates"][1])
            var hiderAngle = angle(crd.longitude, crd.latitude, i["location"]["coordinates"][0], i["location"]["coordinates"][1]);
            var car = {dist: hiderDistance, angle: hiderAngle, opacity: 0, drawing: false};
            hiders.push(car)
          }
        }
    })
  })
}

function angle(cx, cy, ex, ey) {
  var dy = ey - cy;
  var dx = ex - cx;
  var theta = Math.atan2(dy, dx); // range (-PI, PI]
  theta *= 180 / Math.PI; // rads to degs, range (-180, 180]
  //if (theta < 0) theta = 360 + theta; // range [0, 360)
  return theta;
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
function drawSeekerLocation(ctx,opacity){
  ctx.shadowBlur = 20;
  ctx.shadowColor = "black";
  ctx.beginPath();
  seekerDistance = 8.765+22.15*Math.log(seekerDistance);
  ctx.arc(seekerDistance*Math.cos(seekerAngle/180*Math.PI), seekerDistance*Math.sin(seekerAngle/180*Math.PI), 8, 0, Math.PI * 2, false);
  ctx.closePath();
  ctx.fillStyle = 'rgba(115, 115, 115, '+opacity+')';
  ctx.fill();
  ctx.shadowBlur = 0;
}
function drawHiderLocation(ctx,opacity,dist,angle){
  ctx.shadowBlur = 20;
  ctx.shadowColor = "gray";
  ctx.beginPath();
  dist = 8.765+22.15*Math.log(dist);
  ctx.arc(dist*Math.cos(angle/180*Math.PI), dist*Math.sin(angle/180*Math.PI), 5, 0, Math.PI * 2, false);
  ctx.closePath();
  ctx.fillStyle = 'rgba(162, 201, 239, '+opacity+')';
  ctx.fill();
  ctx.shadowBlur = 0;
}


function drawLine(ctx) {
  ctx.strokeStyle = 'rgba(0,0,0,0.2)';
  ctx.beginPath();

  //down
  ctx.moveTo(0,0);
  ctx.lineTo(0, 170);
  ctx.lineWidth = 2;
  ctx.stroke();

  //right
  ctx.beginPath();
  ctx.moveTo(0,0);
  ctx.lineTo(170, 0);
  ctx.lineWidth = 2;
  ctx.stroke();

  // up
  ctx.beginPath();
  ctx.moveTo(0,0);
  ctx.lineTo(0, -170);
  ctx.lineWidth = 2;
  ctx.stroke();

  // left
  ctx.beginPath();
  ctx.moveTo(0,0);
  ctx.lineTo(-170, 0);
  ctx.lineWidth = 2;
  ctx.stroke();

  ctx.strokeStyle = 'rgba(0,0,0,0.2)';
  ctx.beginPath();
  ctx.arc(0, 0, 50, 0, Math.PI * 2, false);
  ctx.closePath();
  ctx.stroke();
  ctx.strokeStyle = 'rgba(0,0,0,0.1)';
  ctx.beginPath();
  ctx.arc(0, 0, 100, 0, Math.PI * 2, false);
  ctx.closePath();
  ctx.stroke();
  ctx.strokeStyle = 'rgba(0,0,0,0.06)';
  ctx.beginPath();
  ctx.arc(0, 0, 150, 0, Math.PI * 2, false);
  ctx.closePath();
  ctx.stroke();
}

var target = {
  latitude : 0,
  longitude: 0
};

var options = {
  enableHighAccuracy: true,
  timeout: 1000,
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
});