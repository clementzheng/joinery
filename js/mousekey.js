var cursorPt;
var pcursorPt;
var mousePosition;
var moving = false;
var tolerance = 4;
var insideMenu = false;

document.onmousemove = function(e){
	if (initialized) {
		mousePosition = new Point(e.pageX, e.pageY - $(window).scrollTop());
		pcursorPt.x = cursorPt.x;
		pcursorPt.y = cursorPt.y;
		cursorPt = paper.view.viewToProject(mousePosition);
		cursorIcon.position = cursorPt;
		if (insideMenu) {
			cursorIcon.strokeColor = new Color(0, 0);
		} else {
			cursorIcon.strokeColor = '#000';
		}
		switch(mode) {
			case 'arrange':
				highlightShapeBounds();
				if (shapeSelected > -1 && isMouseDown) {
					moving = true;
					$('body').css('cursor', 'move');
					var tV = cursorPt.subtract(pcursorPt);
					shape[shapeSelected].position = shape[shapeSelected].position.add(tV);
				}
				if (!isMouseDown) {
					moving = false;
				}
				break;
			case 'remove':
				if (shape.length > 0) {
					highlightShapeBounds();
				}
				break;
			case 'set':
				highlightShapePath();
				break;
			case 'pan':
				if (isMouseDown) {
					var tV = cursorPt.subtract(pcursorPt);
					cursorIcon.position = cursorIcon.position.add(tV);
					jointLines.position = jointLines.position.add(tV);
					tempLines.position = tempLines.position.add(tV);
					for (i in shape) {
						shape[i].position = shape[i].position.add(tV);
					}
				}
				break;
		}
	}
}

document.onclick = function(e) {
	if ($('#jointTypeDiv .dropdown .optionsDiv .dropdownOption.show').length > 0 && !insideDropdown) {
		$('#jointTypeDiv .dropdown .optionsDiv .dropdownOption').toggleClass('show');
	}
	if (initialized && !insideMenu) {
		switch(mode) {
			case 'remove':
				removeShape();
				break;
			case 'set':
				shapePathClick();
				break;
		}
	}
}

var isMouseDown = false;
document.onmousedown = function(e){
	if (initialized) {
		isMouseDown = true;
		switch(mode) {
			case 'pan':
				$('body').css('cursor', '-webkit-grabbing');
				break;
		}
	}
}
document.onmouseup = function(e){
	if (initialized) {
		isMouseDown = false;
		switch(mode) {
			case 'arrange':
				calProjectBounds();
				break;
			case 'pan':
				$('body').css('cursor', '-webkit-grab');
				break;
		}
	}
}

var scaleSensitivity = 0.0075;
var zoomSpeedLimit = 200;
var zoomThen = Date.now();
var zoomNow = Date.now();
document.onwheel = function(e) {
	if (initialized) {
		zoomNow = Date.now();
		if (!insideMenu && shape.length > 0) {
			cursorPt = paper.view.viewToProject(mousePosition);
			cursorIcon.position = cursorPt;
			var dir = e.deltaY<0 ? -1 : e.deltaY>0 ? 1 : 0;
			var oldScale = paperScale;
			zoomThen = (zoomNow - zoomThen) > zoomSpeedLimit ? zoomNow : zoomThen;
			var scaleFactor = 1 + (zoomNow - zoomThen)*dir*scaleSensitivity;
			scaleFactor = scaleFactor > 1.3 ? 1.3 : scaleFactor;
			scaleFactor = scaleFactor < 0.8 ? 0.8 : scaleFactor;
			paperScale = paperScale * scaleFactor;
			paper.view.zoom = paperScale;
			drawGrid();
		}
		zoomThen = Date.now();
	}
}

var rememberMode = '';
document.onkeyup = function(e) {
	if (initialized && !$("input,textarea").is(":focus")) {		
		var key = e.keyCode ? e.keyCode : e.which;
		if (key==32) { // space
			if (mode=='pan' && rememberMode!='pan') {
				mode = rememberMode;
				$('body').css('cursor', 'default');
				cursorIcon.strokeColor = '#000';
			}
		}
		if (!ctrlDown) {
			if (key==65) {  // 'a'
				arrangeClick();
			}
			if (key==82) {  // 'r'
				removeClick();
			}
			if (key==83) {  // 's'
				setClick();
			}
			if (key==80) {  // 'p'
				panClick();
			}
			// if (key==67) { // 'c'
			// 	for (var i=0; i<joints.length; i++) {
			// 		for (j in joints[i]) {
			// 			if (j=='0' || j=='1') {
			// 				removeJoint(joints[i][j].shape, joints[i][j].path);
			// 			}
			// 		}
			// 	}
			// 	joints = [];
			// 	jointLines.removeChildren();
			// 	refreshShapeDisplay();
			// 	refreshJointList();
			// }
			
			// if (key==66) { // 'b'
			// 	console.log(shape);
			// 	console.log(joints);
			// }
		}
		
		if (ctrlDown) {
			/* if (key==83) {  // 's'
				setMessage('<b>Exporting SVG Please wait</b>', '#F80');
				exportProject();
			} */
		}
		
		if (key==17) {
			ctrlDown = false;
		}
	}
}

var ctrlDown = false;
document.onkeydown = function(e) {
	if (initialized) {
		var key = e.keyCode ? e.keyCode : e.which;
		if (key==32) { // space
			if (mode != 'pan') {
				rememberMode = mode;
				mode = 'pan';
				cursorIcon.strokeColor = new Color(0, 0);
				if (!isMouseDown) {
					$('body').css('cursor', '-webkit-grab');
				}
			}
		}
		if (key==17) {
			ctrlDown = true;
		}
	}
}

$( window ).resize(function() {
	if (initialized) {
		$('#paperCanvas').css({'width':window.innerWidth, 'height':window.innerHeight});
		$('#bgCanvas').attr({'width':window.innerWidth, 'height':window.innerHeight});
		paper.view.viewSize = new Size(window.innerWidth, window.innerHeight);
	}
	drawGrid();
});

$(document).bind('keydown', function(e) {
  if(e.ctrlKey && (e.which == 90)) {
    e.preventDefault();
  }
  if(e.ctrlKey && (e.which == 89)) {
    e.preventDefault();
  }
  if(e.ctrlKey && (e.which == 83)) {
    e.preventDefault();
  }
});