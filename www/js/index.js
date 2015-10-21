// Animation variables
var FPS = 1000/30;
var PXPS = 1;
var SIZE = 2;
var MAX_DIST = 150;
var NUM_POINTS = 75;
var MAX_TRANS = 0.1;

// Implementation 
var $canvas;
var width;
var height;

var distance = function(a, b){
	return Math.sqrt(Math.pow(a.x-b.x,2) + Math.pow(a.y-b.y,2));
}

$( document ).ready(function() {

	if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
		return;
	}

    $canvas = $("#canvas");

    width = $(document).width();
    height = $(document).height();
    
    $canvas.prop("width", width);
    $canvas.prop("height", height);

    var c = $canvas[0];
	var ctx = c.getContext("2d");

	var points = [];
	for(var i=0;i<NUM_POINTS;i++){
		points.push(makePoint(width, height));
	}

    setInterval(function() {
    	ctx.clearRect(0,0,width,height);
    	ctx.fillStyle = "#000000";
    	ctx.setLineDash([5,2]);

		for(i in points){

			points[i].x += Math.sin(points[i].theta) * PXPS;
			points[i].y += Math.cos(points[i].theta) * PXPS;

			points[i].trans += FPS/2000;
			points[i].trans = Math.min(MAX_TRANS, points[i].trans);

			if(points[i].x + MAX_DIST < 0 || points[i].x - MAX_DIST > width ||
				points[i].y + MAX_DIST < 0 || points[i].y - MAX_DIST > height){
				points[i] = makePoint(width,height);
			}

			ctx.fillStyle = "rgba(175, 175, 175, " + points[i].trans + ")";
			drawPoint(ctx, points[i]);
			
			var tree = new kdTree(points.slice(i), distance, ["x", "y"]);
			var relatedPoints = tree.nearest(points[i], points.length-1, MAX_DIST);

			for(var j in relatedPoints){
				var max_trans = Math.min(points[i].trans, relatedPoints[j][0].trans);
				var ideal_trans = Math.pow((Math.sin(((3*MAX_DIST/4)+relatedPoints[j][1])*Math.PI/(MAX_DIST/2)) + 1)/2, 2);

				ctx.strokeStyle = "rgba(150, 150, 150, " + Math.min(max_trans, ideal_trans) + ")";
				drawLine(ctx, points[i], relatedPoints[j][0]);
			}
		}
	}, FPS);

});

$(window).resize(function(){
	width = $(document).width();
    height = $(document).height();

    $canvas.prop("width", width);
    $canvas.prop("height", height);
});

function makePoint(width, height){
	return {
		x: Math.random() * width,
		y: Math.random() * height,
		theta: Math.random() * Math.PI * 2,
		trans: 0
	}
}

function drawPoint(ctx, point){
	ctx.beginPath();
	ctx.arc(point.x - SIZE, point.y-SIZE, SIZE, 0, 2*Math.PI);
	ctx.fill();
}

function drawLine(ctx, p1, p2){
	ctx.beginPath();
	ctx.moveTo(p1.x, p1.y);
	ctx.lineTo(p2.x, p2.y);
	ctx.stroke();
}

