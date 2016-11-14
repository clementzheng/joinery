var jointProfileCount = 0;

var paramInteger = [
	'hook count'
];

var paramAngle = [
	'interior angle',
	'flap angle'
];

var loopInsert = {
	'name':'loop insert (overlap)',
	'profile':'',
	'notes': 'notes',
	'param': {
		'material thickness (M)': 0.5,
		'material thickness (F)': 0.5,
		'hem offset': 8,
		'insert width': 8,
		'hook width': 4,
		'hook count': 2,
		'joint spacing': 8,
		'slack': 0,
		'offset start': 0,
		'offset end': 0
	}
};

var loopInsertH = {
	'name':'loop insert',
	'profile':'',
	'notes': 'notes',
	'param': {
		'material thickness (M)': 0.5,
		'material thickness (F)': 0.5,
		'hem offset': 8,
		'insert width': 8,
		'hook width': 4,
		'hook count': 2,
		'joint spacing': 8,
		'slack': 0,
		'offset start': 0,
		'offset end': 0
	}
};

var loopInsertSurface = {
	'name':'loop insert (surface)',
	'profile':'',
	'notes': 'notes',
	'param': {
		'material thickness (M)': 0.5,
		'material thickness (F)': 0.5,
		'hem offset': 8,
		'insert width': 8,
		'hook width': 4,
		'hook count': 4,
		'joint spacing': 8,
		'slack': 0,
		'offset start': 0,
		'offset end': 0
	}
};

var fingerJoint = {
	'name':'finger joint (90deg)',
	'profile':'',
	'notes': 'notes',
	'param': {
		'material thickness (M)': 3,
		'material thickness (F)': 3,
		'finger width': 8,
		'finger radius': 0,
		'offset start': 0,
		'offset end': 0,
		'tolerance': 0
	}
};

var fingerJointA = {
	'name':'finger joint (angle)',
	'profile':'',
	'notes': 'notes',
	'param': {
		'material thickness': 3,
		'finger width': 8,
		'finger radius': 0,
		'interior angle': 90,
		'tolerance': 0
	}
};

var hemJoint = {
	'name':'hem',
	'profile':'',
	'notes': 'notes',
	'param': {
		'hem offset': 8,
		'hole diameter': 0,
		'hole spacing': 10
	}
};

var tabInsertJoint = {
	'name':'tab insert',
	'profile':'',
	'notes': 'notes',
	'param': {
		'material thickness (M)': 1.0,
		'material thickness (F)': 1.0,
		'insert width': 10,
		'insert height': 8,
		'flap height': 8,
		'flap angle': 60,
		'joint spacing': 30,
		'offset start': 15,
		'offset end': 15,
		'grip': 0.7
	}
};

var interlockingJoint = {
	'name':'interlocking',
	'profile':'',
	'notes': 'notes',
	'param': {
		'material thickness (M)': 1.0,
		'material thickness (F)': 1.0,
		'interlocking width': 15,
		'interlocking height': 8,
		'flap angle': 85,
		'offset start': 0,
		'offset end': 0,
		'grip': 2,
		'tolerance': 0.1
	}
};

var flapJoint = {
	'name':'flap',
	'profile':'',
	'notes': 'notes',
	'param': {
		'height (M)': 10,
		'height (F)': 10,
		'flap angle': 60,
		'hole diameter': 0,
		'hole spacing': 20
	}
};

var noneJoint = {
	'name':'none',
	'profile':'',
	'notes': 'notes',
	'param': {
	}
};

var jointType = [loopInsert, loopInsertH, loopInsertSurface, hemJoint, interlockingJoint, fingerJoint, fingerJointA, tabInsertJoint, flapJoint, noneJoint];

var jointProfileList = [];

function createJointProfile(n) {
	if (n < jointType.length) {
		var joint1 = $.extend(true,{},jointType[n]);
		joint1.profile = joint1.name+' '+jointProfileCount;
		jointProfileCount++;
		jointProfileList.push(joint1);
	}
}

function initJoint(s, p) {
	var g = new Group();
	g.name = p+'_joint';
	shape[s].addChild(g);
	shape[s].children[p].name = 'joint';
	shape[s].children[p].strokeWidth = 0;
}

function removeJoint(s, p) {
	for (var i=0; i<shape[s].children.length; i++) {
		if (shape[s].children[i].className=='Group' && shape[s].children[i].name!==undefined) {
			var str = shape[s].children[i].name.split('_');
			if (parseInt(str[0])==p) {
				shape[s].children.splice(i, 1);
				i--;
			}
		}
	}
	shape[s].children[p+'_joint'].remove();
	shape[s].children[p].name = '';
	shape[s].children[p].strokeWidth = 1;
	activateDim(dimBool);
}

function generateJoint(index) {
	
	var shapeA, shapeB, pathA, pathB;
	
	if (joints[index]['m']==0) {
		shapeA = joints[index]['0'].shape;
		shapeB = joints[index]['1'].shape;
		pathA = joints[index]['0'].path;
		pathB = joints[index]['1'].path;
	} else {
		shapeA = joints[index]['1'].shape;
		shapeB = joints[index]['0'].shape;
		pathA = joints[index]['1'].path;
		pathB = joints[index]['0'].path;
	}
	
	shape[shapeA].children[pathA+'_joint'].removeChildren();
	shape[shapeB].children[pathB+'_joint'].removeChildren();
	
	var jType;
	var param;
	for (i in jointProfileList) {
		if (joints[index].profile==jointProfileList[i].profile) {
			jType = jointProfileList[i].name;
			param = $.extend(true,{},jointProfileList[i].param);
			break;
		}
	}
		
	switch (jType) {
		case 'loop insert (overlap)':
			var childPath = generateLoopInsert(index, shapeA, pathA, shapeB, pathB, param, true, false, Math.floor(param['hook count']));
			shape[shapeA].children[pathA+'_joint'].addChildren(childPath.returnA);
			shape[shapeA].children[pathA+'_joint'].strokeColor = '#000';
			shape[shapeA].children[pathA+'_joint'].strokeWidth = 1;

			var g = new Group();
			g.name = 'folds';
			shape[shapeB].children[pathB+'_joint'].addChild(g);
			shape[shapeB].children[pathB+'_joint'].children['folds'].addChildren(childPath.returnBFold);
			shape[shapeB].children[pathB+'_joint'].children['folds'].strokeColor = '#AAA';
			shape[shapeB].children[pathB+'_joint'].strokeWidth = 1;

			shape[shapeB].children[pathB+'_joint'].addChildren(childPath.returnB);
			shape[shapeB].children[pathB+'_joint'].strokeColor = '#000';
			shape[shapeB].children[pathB+'_joint'].strokeWidth = 1;
			break;
			
		case 'loop insert':
			var childPath = generateLoopInsert(index, shapeA, pathA, shapeB, pathB, param, false, false, Math.floor(param['hook count']));
			shape[shapeA].children[pathA+'_joint'].addChildren(childPath.returnA);
			shape[shapeA].children[pathA+'_joint'].strokeColor = '#000';
			shape[shapeA].children[pathA+'_joint'].strokeWidth = 1;
			shape[shapeB].children[pathB+'_joint'].addChildren(childPath.returnB);
			shape[shapeB].children[pathB+'_joint'].strokeColor = '#000';
			shape[shapeB].children[pathB+'_joint'].strokeWidth = 1;
			break;

		case 'loop insert (surface)':
			var childPath = generateLoopInsert(index, shapeA, pathA, shapeB, pathB, param, false, true, Math.floor(param['hook count']));
			if (childPath) {
				shape[shapeA].children[pathA+'_joint'].addChildren(childPath.returnA);
				shape[shapeA].children[pathA+'_joint'].strokeColor = '#000';
				shape[shapeA].children[pathA+'_joint'].strokeWidth = 1;
				shape[shapeB].children[pathB+'_joint'].addChildren(childPath.returnB);
				shape[shapeB].children[pathB+'_joint'].strokeColor = '#000';
				shape[shapeB].children[pathB+'_joint'].strokeWidth = 1;
			} else {
				shape[shapeA].children[pathA+'_joint'].addChild(shape[shapeA].children[pathA].clone());
				shape[shapeB].children[pathB+'_joint'].addChild(shape[shapeB].children[pathB].clone());
				shape[shapeA].children[pathA+'_joint'].strokeWidth = 1;
				shape[shapeB].children[pathB+'_joint'].strokeWidth = 1;
			}
			break;
			
		case 'finger joint (90deg)':
			var childPath = generateFingerJoint(index, shapeA, pathA, shapeB, pathB, param);
			if (childPath) {
				shape[shapeA].children[pathA+'_joint'].addChildren(childPath.returnA);
				shape[shapeA].children[pathA+'_joint'].strokeColor = '#000';
				shape[shapeA].children[pathA+'_joint'].strokeWidth = 1;
				shape[shapeB].children[pathB+'_joint'].addChildren(childPath.returnB);
				shape[shapeB].children[pathB+'_joint'].strokeColor = '#000';
				shape[shapeB].children[pathB+'_joint'].strokeWidth = 1;
			} else {
				shape[shapeA].children[pathA+'_joint'].addChild(shape[shapeA].children[pathA].clone());
				shape[shapeB].children[pathB+'_joint'].addChild(shape[shapeB].children[pathB].clone());
				shape[shapeA].children[pathA+'_joint'].strokeWidth = 1;
				shape[shapeB].children[pathB+'_joint'].strokeWidth = 1;
			}
			break;

		case 'finger joint (angle)':
			var childPath = generateFingerJointA(index, shapeA, pathA, shapeB, pathB, param);
			if (childPath) {
				shape[shapeA].children[pathA+'_joint'].addChildren(childPath.returnA);
				shape[shapeA].children[pathA+'_joint'].strokeColor = '#000';
				shape[shapeA].children[pathA+'_joint'].strokeWidth = 1;
				shape[shapeB].children[pathB+'_joint'].addChildren(childPath.returnB);
				shape[shapeB].children[pathB+'_joint'].strokeColor = '#000';
				shape[shapeB].children[pathB+'_joint'].strokeWidth = 1;
			} else {
				shape[shapeA].children[pathA+'_joint'].addChild(shape[shapeA].children[pathA].clone());
				shape[shapeB].children[pathB+'_joint'].addChild(shape[shapeB].children[pathB].clone());
				shape[shapeA].children[pathA+'_joint'].strokeWidth = 1;
				shape[shapeB].children[pathB+'_joint'].strokeWidth = 1;
			}
			break;
			
		case 'hem':
			var childPath = generateHemJoint(index, shapeA, pathA, shapeB, pathB, param);
			var g = new Group();
			g.name = 'folds';
			shape[shapeA].children[pathA+'_joint'].addChild(g);
			shape[shapeA].children[pathA+'_joint'].children['folds'].addChildren(childPath.returnAFold);
			shape[shapeA].children[pathA+'_joint'].children['folds'].strokeColor = '#AAA';
			shape[shapeA].children[pathA+'_joint'].strokeWidth = 1;

			shape[shapeA].children[pathA+'_joint'].addChildren(childPath.returnA);
			shape[shapeA].children[pathA+'_joint'].strokeColor = '#000';
			shape[shapeA].children[pathA+'_joint'].strokeWidth = 1;

			var g2 = new Group();
			g2.name = 'folds';
			shape[shapeB].children[pathB+'_joint'].addChild(g2);
			shape[shapeB].children[pathB+'_joint'].children['folds'].addChildren(childPath.returnBFold);
			shape[shapeB].children[pathB+'_joint'].children['folds'].strokeColor = '#AAA';
			shape[shapeB].children[pathB+'_joint'].strokeWidth = 1;

			shape[shapeB].children[pathB+'_joint'].addChildren(childPath.returnB);
			shape[shapeB].children[pathB+'_joint'].strokeColor = '#000';
			shape[shapeB].children[pathB+'_joint'].strokeWidth = 1;
			break;
			
		case 'tab insert':
			var childPath = generateTabInsertJoint(index, shapeA, pathA, shapeB, pathB, param);
			if (childPath) {
				var g = new Group();
				g.name = 'folds';
				shape[shapeA].children[pathA+'_joint'].addChild(g);
				shape[shapeA].children[pathA+'_joint'].children['folds'].addChildren(childPath.returnAFold);
				shape[shapeA].children[pathA+'_joint'].children['folds'].strokeColor = '#AAA';
				shape[shapeA].children[pathA+'_joint'].strokeWidth = 1;

				shape[shapeA].children[pathA+'_joint'].addChildren(childPath.returnA);
				shape[shapeA].children[pathA+'_joint'].strokeColor = '#000';
				shape[shapeA].children[pathA+'_joint'].strokeWidth = 1;

				var g2 = new Group();
				g2.name = 'folds';
				shape[shapeB].children[pathB+'_joint'].addChild(g2);
				shape[shapeB].children[pathB+'_joint'].children['folds'].addChildren(childPath.returnBFold);
				shape[shapeB].children[pathB+'_joint'].children['folds'].strokeColor = '#AAA';
				shape[shapeB].children[pathB+'_joint'].strokeWidth = 1;

				shape[shapeB].children[pathB+'_joint'].addChildren(childPath.returnB);
				shape[shapeB].children[pathB+'_joint'].strokeColor = '#000';
				shape[shapeB].children[pathB+'_joint'].strokeWidth = 1;
			} else {
				shape[shapeA].children[pathA+'_joint'].addChild(shape[shapeA].children[pathA].clone());
				shape[shapeB].children[pathB+'_joint'].addChild(shape[shapeB].children[pathB].clone());
				shape[shapeA].children[pathA+'_joint'].strokeWidth = 1;
				shape[shapeB].children[pathB+'_joint'].strokeWidth = 1;
			}
			break;
			
		case 'interlocking':
			var childPath = generateInterlockingJoint(index, shapeA, pathA, shapeB, pathB, param);
			var g = new Group();
			g.name = 'folds';
			shape[shapeA].children[pathA+'_joint'].addChild(g);
			shape[shapeA].children[pathA+'_joint'].children['folds'].addChildren(childPath.returnAFold);
			shape[shapeA].children[pathA+'_joint'].children['folds'].strokeColor = '#AAA';
			shape[shapeA].children[pathA+'_joint'].strokeWidth = 1;

			shape[shapeA].children[pathA+'_joint'].addChildren(childPath.returnA);
			shape[shapeA].children[pathA+'_joint'].strokeColor = '#000';
			shape[shapeA].children[pathA+'_joint'].strokeWidth = 1;
			
			var g2 = new Group();
			g2.name = 'folds';
			shape[shapeB].children[pathB+'_joint'].addChild(g2);
			shape[shapeB].children[pathB+'_joint'].children['folds'].addChildren(childPath.returnBFold);
			shape[shapeB].children[pathB+'_joint'].children['folds'].strokeColor = '#AAA';
			shape[shapeB].children[pathB+'_joint'].strokeWidth = 1;

			shape[shapeB].children[pathB+'_joint'].addChildren(childPath.returnB);
			shape[shapeB].children[pathB+'_joint'].strokeColor = '#000';
			shape[shapeB].children[pathB+'_joint'].strokeWidth = 1;
			break;

		case 'flap':
			var childPath = generateFlapJoint(index, shapeA, pathA, shapeB, pathB, param);
			if (childPath) {
				var g = new Group();
				g.name = 'folds';
				shape[shapeA].children[pathA+'_joint'].addChild(g);
				shape[shapeA].children[pathA+'_joint'].children['folds'].addChildren(childPath.returnAFold);
				shape[shapeA].children[pathA+'_joint'].children['folds'].strokeColor = '#AAA';
				shape[shapeA].children[pathA+'_joint'].strokeWidth = 1;

				shape[shapeA].children[pathA+'_joint'].addChildren(childPath.returnA);
				shape[shapeA].children[pathA+'_joint'].strokeColor = '#000';
				shape[shapeA].children[pathA+'_joint'].strokeWidth = 1;

				var g2 = new Group();
				g2.name = 'folds';
				shape[shapeB].children[pathB+'_joint'].addChild(g2);
				shape[shapeB].children[pathB+'_joint'].children['folds'].addChildren(childPath.returnBFold);
				shape[shapeB].children[pathB+'_joint'].children['folds'].strokeColor = '#AAA';
				shape[shapeB].children[pathB+'_joint'].strokeWidth = 1;

				shape[shapeB].children[pathB+'_joint'].addChildren(childPath.returnB);
				shape[shapeB].children[pathB+'_joint'].strokeColor = '#000';
				shape[shapeB].children[pathB+'_joint'].strokeWidth = 1;
			} else {
				shape[shapeA].children[pathA+'_joint'].addChild(shape[shapeA].children[pathA].clone());
				shape[shapeB].children[pathB+'_joint'].addChild(shape[shapeB].children[pathB].clone());
				shape[shapeA].children[pathA+'_joint'].strokeWidth = 1;
				shape[shapeB].children[pathB+'_joint'].strokeWidth = 1;
			}
			break;

		default:
			shape[shapeA].children[pathA+'_joint'].addChild(shape[shapeA].children[pathA].clone());
			shape[shapeB].children[pathB+'_joint'].addChild(shape[shapeB].children[pathB].clone());
			shape[shapeA].children[pathA+'_joint'].strokeWidth = 1;
			shape[shapeB].children[pathB+'_joint'].strokeWidth = 1;
			break;
	}
	
	refreshShapeDisplay();
	activateDim(dimBool);
}

function generateFingerJointA(index, shapeA, pathA, shapeB, pathB, param) {
	var returnA = [];
	var returnB = [];
	var generateBool = true;
	if (shape[shapeA].children[pathA].segments.length==2 && shape[shapeB].children[pathB].segments.length==2) {
		for (i in shape[shapeA].children[pathA].segments) {
			if (shape[shapeA].children[pathA].segments[i].hasHandles()) {
				generateBool = false;
			}
		}
		for (i in shape[shapeB].children[pathB].segments) {
			if (shape[shapeB].children[pathB].segments[i].hasHandles()) {
				generateBool = false;
			}
		}
	} else {
		setMessage('<b>Paths have more than two points</b> Joint generated based on the start and end points.', '#F80');
	}
	if (!generateBool) {
		setMessage('<b>Paths are not straight</b> Joint generated based on the start and end points.', '#F80');
	} 
	if (param['interior angle'] < 30 || param['interior angle'] > 330 ) {
		setMessage('<b>"interior angle" not between 30 and 330 degrees</b> Joint not generated.', '#F80');
		return false;
	} else {
		var intAngle = param['interior angle']/180*Math.PI;
		var ascend = 0;
		var descend = 0;
		if (intAngle<=Math.PI/2) {
			ascend = (param['material thickness'])/Math.cos(Math.PI/2-intAngle);
		} else if (intAngle>Math.PI/2 && intAngle<=Math.PI) {
			ascend = (param['material thickness'])*(Math.tan(Math.PI/2-intAngle/2));
			descend = ascend*Math.cos(Math.PI-intAngle);
		} else if (intAngle>Math.PI && intAngle<Math.PI*1.5) {
			descend = 2*param['material thickness']*Math.sin(intAngle/4-Math.PI/4)*Math.cos(intAngle/4-Math.PI/4);
		} else if (intAngle>=Math.PI*1.5) {
			descend = param['material thickness']/(Math.tan((Math.PI*2-intAngle)/2));
		}
		if (ascend==0 && descend==0) {
			return false;
		} else {
			var pathAStart = shape[shapeA].children[pathA].firstSegment.point;
			var pathAEnd = shape[shapeA].children[pathA].lastSegment.point;
			var pathBStart = shape[shapeB].children[pathB].firstSegment.point;
			var pathBEnd = shape[shapeB].children[pathB].lastSegment.point;
			var dirA = pathAEnd.subtract(pathAStart).normalize();
			var dirB = pathBEnd.subtract(pathBStart).normalize();
			var normA = new Point(dirA.y, -dirA.x);
			var normB = new Point(dirB.y, -dirB.x);
			var fingerCount = Math.floor(pathAStart.getDistance(pathAEnd)/(param['finger width']*2))*2;
			var gap = pathAStart.getDistance(pathAEnd)/fingerCount;
			var pathAStartCloneIndex = -1;
			var pathAEndCloneIndex = -1;
			var pathBStartCloneIndex = -1;
			var pathBEndCloneIndex = -1;
			for (i in shape[shapeA].children) {
				if (i!=pathA && shape[shapeA].children[i].className=='Path') {
					var d1 = pathAStart.getDistance(shape[shapeA].children[i].firstSegment.point);
					var d2 = pathAStart.getDistance(shape[shapeA].children[i].lastSegment.point);
					if ((d1<0.1 || d2<0.1) && !isNaN(i)) {
						pathAStartCloneIndex = i;
					}
					d1 = pathAEnd.getDistance(shape[shapeA].children[i].firstSegment.point);
					d2 = pathAEnd.getDistance(shape[shapeA].children[i].lastSegment.point);
					if ((d1<0.1 || d2<0.1) && !isNaN(i)) {
						pathAEndCloneIndex = i;
					}
				}
			}
			for (i in shape[shapeB].children) {
				if (i!=pathB && shape[shapeB].children[i].className=='Path') {
					var d1 = pathBStart.getDistance(shape[shapeB].children[i].firstSegment.point);
					var d2 = pathBStart.getDistance(shape[shapeB].children[i].lastSegment.point);
					if ((d1<0.1 || d2<0.1) && !isNaN(i)) {
						pathBStartCloneIndex = i;
					}
					d1 = pathBEnd.getDistance(shape[shapeB].children[i].firstSegment.point);
					d2 = pathBEnd.getDistance(shape[shapeB].children[i].lastSegment.point);
					if ((d1<0.1 || d2<0.1) && !isNaN(i)) {
						pathBEndCloneIndex = i;
					}
				}
			}
			var pathAStartPt = pathAStart;
			var pathAEndPt = pathAEnd;
			var pathBStartPt = pathBStart;
			var pathBEndPt = pathBEnd;
			if (pathAEndCloneIndex!=-1) {
				var pt1 = pathAStart.add(normA.multiply(-descend*joints[index]['dirM']));
				var pt2 = pathAEnd.add(normA.multiply(-descend*joints[index]['dirM']));
				var pt3 = pathAStart.add(dirA.multiply(pt1.getDistance(pt2)*10));
				var intPath = new Path.Line(pt1, pt3);
				var xPtList;
				xPtList = intPath.getIntersections(shape[shapeA].children[pathAEndCloneIndex]);
				var xPt = xPtList.length>0 ? xPtList[0].point : null;
				if (xPt != null && intAngle>Math.PI && fingerCount%2==0) {
					pathAEndPt = new Point(xPt.x, xPt.y);
				}
				intPath.remove();
			}
			if (pathBStartCloneIndex!=-1) {
				var pt1 = pathBStart.add(normB.multiply(-descend*joints[index]['dirF']));
				var pt2 = pathBEnd.add(normB.multiply(-descend*joints[index]['dirF']));
				var pt3 = pathBEnd.add(dirB.multiply(pt1.getDistance(pt2)*-10));
				var intPath = new Path.Line(pt2, pt3);
				var xPtList;
				xPtList = intPath.getIntersections(shape[shapeB].children[pathBStartCloneIndex]);
				var xPt = xPtList.length>0 ? xPtList[0].point : null;
				if (xPt != null && intAngle>Math.PI) {
					pathBStartPt = new Point(xPt.x, xPt.y);
				}
				intPath.remove();
			}
			if (pathBEndCloneIndex!=-1) {
				var pt1 = pathBStart.add(normB.multiply(-descend*joints[index]['dirF']));
				var pt2 = pathBEnd.add(normB.multiply(-descend*joints[index]['dirF']));
				var pt3 = pathBStart.add(dirB.multiply(pt1.getDistance(pt2)*10));
				var intPath = new Path.Line(pt1, pt3);
				var xPtList;
				xPtList = intPath.getIntersections(shape[shapeB].children[pathBEndCloneIndex]);
				var xPt = xPtList.length>0 ? xPtList[0].point : null;
				if (xPt != null && intAngle>Math.PI && fingerCount%2==1) {
					pathBEndPt = new Point(xPt.x, xPt.y);
				}
				intPath.remove();
			}
			var radiusArray = [ascend, param['finger width']/2];
			radiusArray.sort(function (a, b) {
				return a-b;
			});
			var fillet = param['finger radius']>radiusArray[0] ? radiusArray[0] : param['finger radius'];
			var ptListA = [pathAStart, pathAStartPt];
			var ptListB = [pathBStart, pathBStartPt];
			var filletListA = [0];
			var filletListB = [0];
			for (var i=0; i<fingerCount; i++) {
				if (i%2==0) {
					var ptA1 = pathAStart.add(dirA.multiply(gap*i+param['tolerance']/2));
					var ptA2 = ptA1.add(normA.multiply(ascend*joints[index]['dirM']));
					var ptA3 = ptA2.add(dirA.multiply(gap-param['tolerance']));
					var ptA4 = ptA1.add(dirA.multiply(gap-param['tolerance']));
					var ptB1 = pathBStart.add(dirB.multiply(gap*i-param['tolerance']/2)).add(normB.multiply(-descend*joints[index]['dirF']));
					var ptB2 = ptB1.add(dirB.multiply(gap+param['tolerance']));
					ptListA.push(ptA1, ptA2, ptA3, ptA4);
					ptListB.push(ptB1, ptB2);
					filletListA.push(0, fillet, fillet, 0);
					filletListB.push(0, 0);
				} else {
					var ptB1 = pathBStart.add(dirB.multiply(gap*i+param['tolerance']/2));
					var ptB2 = ptB1.add(normB.multiply(ascend*joints[index]['dirF']));
					var ptB3 = ptB2.add(dirB.multiply(gap-param['tolerance']));
					var ptB4 = ptB1.add(dirB.multiply(gap-param['tolerance']));
					var ptA1 = pathAStart.add(dirA.multiply(gap*i-param['tolerance']/2)).add(normA.multiply(-descend*joints[index]['dirM']));
					var ptA2 = ptA1.add(dirA.multiply(gap+param['tolerance']));
					ptListB.push(ptB1, ptB2, ptB3, ptB4);
					ptListA.push(ptA1, ptA2);
					filletListB.push(0, fillet, fillet, 0);
					filletListA.push(0, 0);
				}
			}
			ptListA.push(pathAEndPt, pathAEnd);
			ptListB.push(pathBEndPt, pathBEnd);
			filletListA.push(0);
			filletListB.push(0);
			returnA.push(generateFilletPath(ptListA, filletListA));
			returnB.push(generateFilletPath(ptListB, filletListB));
			
			return {'returnA':returnA, 'returnB':returnB};
		}
	}
}

function generateFlapJoint(index, shapeA, pathA, shapeB, pathB, param) {
	var returnA = [];
	var returnB = [];
	var returnBFold = [];
	var returnAFold = [];
	var generateBool = true;
	if (shape[shapeA].children[pathA].segments.length==2 && shape[shapeB].children[pathB].segments.length==2) {
		for (i in shape[shapeA].children[pathA].segments) {
			if (shape[shapeA].children[pathA].segments[i].hasHandles()) {
				generateBool = false;
			}
		}
		for (i in shape[shapeB].children[pathB].segments) {
			if (shape[shapeB].children[pathB].segments[i].hasHandles()) {
				generateBool = false;
			}
		}
	} else {
		setMessage('<b>Paths have more than two points</b> Joint generated based on the start and end points.', '#F80');
	}
	if (!generateBool) {
		setMessage('<b>Paths are not straight</b> Joint generated based on the start and end points.', '#F80');
	} 
	var pathAStart = shape[shapeA].children[pathA].firstSegment.point;
	var pathAEnd = shape[shapeA].children[pathA].lastSegment.point;
	var pathBStart = shape[shapeB].children[pathB].firstSegment.point;
	var pathBEnd = shape[shapeB].children[pathB].lastSegment.point;
	var tanA = pathAEnd.subtract(pathAStart).normalize();
	var tanB = pathBEnd.subtract(pathBStart).normalize();
	var normA = new Point(tanA.y, -tanA.x);
	var normB = new Point(tanB.y, -tanB.x);
	normA = normA.multiply(joints[index]['dirM']);
	normB = normB.multiply(joints[index]['dirF']);
	if (param['height (M)'] > 0) {
		var pt1 = pathAStart;
		var pt2 = pt1.add(normA.multiply(param['height (M)'])).add(tanA.multiply(param['height (M)']/Math.tan(param['flap angle']/180*Math.PI)));
		var pt4 = pathAEnd;
		var pt3 = pt4.add(normA.multiply(param['height (M)'])).add(tanA.multiply(-param['height (M)']/Math.tan(param['flap angle']/180*Math.PI)));
		var fil = calFillet(param['height (M)']*0.75, param['flap angle']);
		returnA.push(generateFilletPath([pt1, pt2, pt3, pt4], [fil, fil]));
		returnAFold.push(new Path.Line(pathAStart, pathAEnd));
		if (param['hole diameter'] > 0) {
			var len = pathAStart.getDistance(pathAEnd);
			var holeCount = Math.floor(len/param['hole spacing']);
			var gapLen = len/holeCount;
			for (var i=0; i<holeCount; i++) {
				var ptA = (pathAStart.add(tanA.multiply(gapLen/2+i*gapLen))).add(normA.multiply(param['height (M)']/2));
				var ptB = (pathBStart.add(tanB.multiply(gapLen/2+i*gapLen))).add(normB.multiply(-param['height (M)']/2));
				returnA.push(new Path.Circle(ptA, param['hole diameter']/2));
				returnB.push(new Path.Circle(ptB, param['hole diameter']/2));
			}
		}
	} else {
		returnA.push(new Path.Line(pathAStart, pathAEnd));
	}
	if (param['height (F)'] > 0) {
		var pt1 = pathBStart;
		var pt2 = pt1.add(normB.multiply(param['height (F)'])).add(tanB.multiply(param['height (F)']/Math.tan(param['flap angle']/180*Math.PI)));
		var pt4 = pathBEnd;
		var pt3 = pt4.add(normB.multiply(param['height (F)'])).add(tanB.multiply(-param['height (F)']/Math.tan(param['flap angle']/180*Math.PI)));
		var fil = calFillet(param['height (F)']*0.75, param['flap angle']);
		returnB.push(generateFilletPath([pt1, pt2, pt3, pt4], [fil, fil]));
		returnBFold.push(new Path.Line(pathBStart, pathBEnd));
		if (param['hole diameter'] > 0) {
			var len = pathBStart.getDistance(pathBEnd);
			var holeCount = Math.floor(len/param['hole spacing']);
			var gapLen = len/holeCount;
			for (var i=0; i<holeCount; i++) {
				var ptA = (pathAStart.add(tanA.multiply(gapLen/2+i*gapLen))).add(normA.multiply(-param['height (F)']/2));
				var ptB = (pathBStart.add(tanB.multiply(gapLen/2+i*gapLen))).add(normB.multiply(param['height (F)']/2));
				returnA.push(new Path.Circle(ptA, param['hole diameter']/2));
				returnB.push(new Path.Circle(ptB, param['hole diameter']/2));
			}
		}
	} else {
		returnB.push(new Path.Line(pathBStart, pathBEnd));	
	}

	return {'returnA':returnA, 'returnB':returnB, 'returnAFold':returnAFold, 'returnBFold':returnBFold};
}

function calFillet(rightAngleHeight, angle) {
	if (angle > 90) {
		var val = rightAngleHeight/(1+Math.sin((angle-90)/180*Math.PI));
		return val;
	} else if (angle < 90) {
		var val = rightAngleHeight/(1-Math.sin((90-angle)/180*Math.PI));
		return val;
	} else {
		return rightAngleHeight;
	}
}

function generateInterlockingJoint(index, shapeA, pathA, shapeB, pathB, param) {
	var returnB = [];
	var returnA = [];
	var returnBFold = [];
	var returnAFold = [];
	
	shape[shapeA].children[pathA+'_joint'].addChild(shape[shapeA].children[pathA].clone());
	shape[shapeB].children[pathB+'_joint'].addChild(shape[shapeB].children[pathB].clone());
	var edgeA = shape[shapeA].children[pathA+'_joint'].children[0];
	var edgeB = shape[shapeB].children[pathB+'_joint'].children[0];
	
	var aEnd = param['offset end']==0 ? edgeA.length-0.001 : edgeA.length-param['offset end'];
	var aStart = param['offset start']==0 ? 0.001 : param['offset start'];
	var bEnd = param['offset end']==0 ? edgeB.length-0.001 : edgeB.length-param['offset end'];
	var bStart = param['offset start']==0 ? 0.001 : param['offset start'];
	var edgeAEnd = edgeA.split(aEnd);
	var edgeAMid = edgeA.split(aStart);
	var edgeBEnd = edgeB.split(bEnd);
	var edgeBMid = edgeB.split(bStart);
	
	var jW = param['interlocking width'];
	var jointCount = Math.floor(edgeAMid.length/jW);
	jointCount = jointCount + jointCount%2;
	var edgeSegmentA = dividePath(edgeAMid, jointCount);
	var edgeSegmentB = dividePath(edgeBMid, jointCount);
	shape[shapeA].children[pathA+'_joint'].removeChildren();
	shape[shapeB].children[pathB+'_joint'].removeChildren();
	
	var intersectPath;
	
	if (edgeA.length>0) {
		returnA.push(edgeA);
	}
	if (edgeAEnd.length>0) {
		returnA.push(edgeAEnd);
	}
	if (edgeB.length>0) {
		returnB.push(edgeB);
	}
	if (edgeBEnd.length>0) {
		returnB.push(edgeBEnd);
	}
	
	for (i in edgeSegmentA) {

		var chordA = new Path([edgeSegmentA[i].firstSegment.point, edgeSegmentA[i].lastSegment.point]);
		var chordB = new Path([edgeSegmentB[i].firstSegment.point, edgeSegmentB[i].lastSegment.point]);
		
		var dirA = chordA.getNormalAt(chordA.length/2).multiply(joints[index]['dirM']);
		var dirB = chordB.getNormalAt(chordB.length/2).multiply(joints[index]['dirF']);
		var tanA = new Point(dirA.y, -dirA.x);
		var tanB = new Point(dirB.y, -dirB.x);
		tanA = tanA.multiply(joints[index]['dirM']);
		tanB = tanB.multiply(joints[index]['dirF']);
		
		if (i%2==0) {
			var pt1 = edgeSegmentA[i].firstSegment.point;
			var pt2 = pt1.add(tanA.multiply(-param['tolerance']));
			var pt3 = pt2.add(dirA.multiply(param['material thickness (F)']));
			var pt4 = pt3.add(tanA.multiply(param['grip']+param['tolerance']));
			var pt5 = pt4.add(dirA.multiply(param['interlocking height'])).add(tanA.multiply(-param['interlocking height']/Math.tan(param['flap angle']/180*Math.PI)));
			var pt10 = edgeSegmentA[i].lastSegment.point;
			var pt9 = pt10.add(tanA.multiply(param['tolerance']));
			var pt8 = pt9.add(dirA.multiply(param['material thickness (F)']));
			var pt7 = pt8.add(tanA.multiply(-param['grip']-param['tolerance']));
			var pt6 = pt7.add(dirA.multiply(param['interlocking height'])).add(tanA.multiply(param['interlocking height']/Math.tan(param['flap angle']/180*Math.PI)));
			var pt6a = pt10.add(dirA.multiply(param['interlocking height']+param['material thickness (F)'])).add(tanA.multiply(param['interlocking height']/Math.tan(param['flap angle']/180*Math.PI)));
			var topFillet = param['interlocking width']>param['interlocking height'] ? calFillet(param['interlocking height']*0.5, param['flap angle']) : calFillet(param['interlocking width']*0.5, param['flap angle']);
			var cornerFillet = param['grip']*2 >= param['interlocking height'] ? calFillet(param['interlocking height']*0.3, 180-param['flap angle']) : calFillet(param['grip']*0.5, 180-param['flap angle']);
			var innerFillet = Math.abs(param['tolerance']) <= param['material thickness (F)'] ? Math.abs(param['tolerance'])/3 : param['material thickness (F)']/3;
			if (i==0) {
				returnA.push(generateFilletPath([pt1, pt2, pt3, pt4, pt5, pt6a, pt10], [innerFillet, innerFillet, cornerFillet, topFillet, topFillet]));
				returnAFold.push(edgeSegmentA[i]);
				returnB.push(edgeSegmentB[i]);
			} else {
				returnA.push(generateFilletPath([pt1, pt2, pt3, pt4, pt5, pt6, pt7, pt8, pt9, pt10], [innerFillet, innerFillet, cornerFillet, topFillet, topFillet, cornerFillet, innerFillet, innerFillet]));
				returnAFold.push(edgeSegmentA[i]);
				returnB.push(edgeSegmentB[i]);
			}		
		} else {
			var pt1 = edgeSegmentB[i].firstSegment.point;
			var pt2 = pt1.add(tanB.multiply(-param['tolerance']));
			var pt3 = pt2.add(dirB.multiply(param['material thickness (M)']));
			var pt4 = pt3.add(tanB.multiply(param['grip']+param['tolerance']));
			var pt5 = pt4.add(dirB.multiply(param['interlocking height'])).add(tanB.multiply(-param['interlocking height']/Math.tan(param['flap angle']/180*Math.PI)));
			var pt5a = pt1.add(dirB.multiply(param['interlocking height']+param['material thickness (M)'])).add(tanB.multiply(-param['interlocking height']/Math.tan(param['flap angle']/180*Math.PI)));
			var pt10 = edgeSegmentB[i].lastSegment.point;
			var pt9 = pt10.add(tanB.multiply(param['tolerance']));
			var pt8 = pt9.add(dirB.multiply(param['material thickness (M)']));
			var pt7 = pt8.add(tanB.multiply(-param['grip']-param['tolerance']));
			var pt6 = pt7.add(dirB.multiply(param['interlocking height'])).add(tanB.multiply(param['interlocking height']/Math.tan(param['flap angle']/180*Math.PI)));
			var topFillet = param['interlocking width']>param['interlocking height'] ? calFillet(param['interlocking height']*0.5, param['flap angle']) : calFillet(param['interlocking width']*0.5, param['flap angle']);
			var cornerFillet = param['grip']*2 >= param['interlocking height'] ? calFillet(param['interlocking height']*0.3, 180-param['flap angle']) : calFillet(param['grip']*0.5, 180-param['flap angle']);
			var innerFillet = Math.abs(param['tolerance']) <= param['material thickness (F)'] ? Math.abs(param['tolerance'])/3 : param['material thickness (F)']/3;
			if (i==(edgeSegmentA.length-1)) {
				returnB.push(generateFilletPath([pt1, pt5a, pt6, pt7, pt8, pt9, pt10], [topFillet, topFillet, cornerFillet, innerFillet, innerFillet]));
				returnBFold.push(edgeSegmentB[i]);
				returnA.push(edgeSegmentA[i]);	
			} else {
				returnB.push(generateFilletPath([pt1, pt2, pt3, pt4, pt5, pt6, pt7, pt8, pt9, pt10], [innerFillet, innerFillet, cornerFillet, topFillet, topFillet, cornerFillet, innerFillet, innerFillet]));
				returnBFold.push(edgeSegmentB[i]);
				returnA.push(edgeSegmentA[i]);
			}
		}
		
		chordA.remove();
		chordB.remove();
	}
	return {'returnA':returnA, 'returnB':returnB, 'returnAFold':returnAFold, 'returnBFold':returnBFold};
}

function generateTabInsertJoint(index, shapeA, pathA, shapeB, pathB, param) {
	var returnA = [];
	var returnB = [];
	var returnAFold = [];
	var returnBFold = [];
	var generateBool = true;
	if (shape[shapeA].children[pathA].segments.length==2 && shape[shapeB].children[pathB].segments.length==2) {
		for (i in shape[shapeA].children[pathA].segments) {
			if (shape[shapeA].children[pathA].segments[i].hasHandles()) {
				generateBool = false;
			}
		}
		for (i in shape[shapeB].children[pathB].segments) {
			if (shape[shapeB].children[pathB].segments[i].hasHandles()) {
				generateBool = false;
			}
		}
	} else {
		setMessage('<b>Paths have more than two points</b> Joint generated based on the start and end points.', '#F80');
	}
	if (!generateBool) {
		setMessage('<b>Paths are not straight</b> Joint generated based on the start and end points.', '#F80');
	} 
	var lineA = new Path.Line(shape[shapeA].children[pathA].firstSegment.point, shape[shapeA].children[pathA].lastSegment.point);
	var lineB = new Path.Line(shape[shapeB].children[pathB].firstSegment.point, shape[shapeB].children[pathB].lastSegment.point);
	var ptAStart, ptAEnd, ptBStart, ptBEnd;
	if (param['offset start'] > 0) {
		ptAStart = lineA.getPointAt(param['offset start']);
		ptBStart = lineB.getPointAt(param['offset start']);
	} else {
		ptAStart = shape[shapeA].children[pathA].firstSegment.point;
		ptBStart = shape[shapeB].children[pathB].firstSegment.point;
	}
	if (param['offset end'] > 0) {
		ptAEnd = lineA.getPointAt(lineA.length-param['offset end']);
		ptBEnd = lineB.getPointAt(lineB.length-param['offset end']);
	} else {
		ptAEnd = shape[shapeA].children[pathA].lastSegment.point;
		ptBEnd = shape[shapeB].children[pathB].lastSegment.point;
	}
	var dirA = ptAEnd.subtract(ptAStart).normalize();
	var dirB = ptBEnd.subtract(ptBStart).normalize();
	var normA = new Point(dirA.y, -dirA.x);
	var normB = new Point(dirB.y, -dirB.x);
	normA = normA.multiply(joints[index]['dirM']);
	normB = normB.multiply(joints[index]['dirF']);
	var pathLength = ptAStart.getDistance(ptAEnd);
	if (Math.floor(pathLength/param['insert width'])==0) {
		setMessage('<b>Paths too short</b> Joint not generated.', '#F80');
		return false;
	} else {
		var insertCount = Math.floor(pathLength/(param['insert width']+param['joint spacing']))+1;
		var insertStart, insertEnd;
		var gap = (pathLength-insertCount*param['insert width'])/(insertCount-1);
		var flapFoldStart = lineB.firstSegment.point;
		for (var i=0; i<insertCount; i++) {
			var pathOffsetStart;
			var pathOffsetEnd;
			if (insertCount==1) {
				pathOffsetStart = pathLength/2-param['insert width']/2;
				pathOffsetEnd = pathLength/2+param['insert width']/2;
			} else {
				pathOffsetStart = i*gap+i*param['insert width'];
				pathOffsetEnd = i*gap+(i+1)*param['insert width'];
			}
			var insertPt1 = ptAStart.add(dirA.multiply(pathOffsetStart));
			var insertPt8 = ptAStart.add(dirA.multiply(pathOffsetEnd));
			var flapPt1 = ptBStart.add(dirB.multiply(pathOffsetStart));
			var flapPt8 = ptBStart.add(dirB.multiply(pathOffsetEnd));
			if (i==0) {
				insertStart = insertPt1;
			}
			if (i==insertCount-1) {
				insertEnd = insertPt8;
			}
			var insertPt2 = insertPt1.add(normA.multiply(param['material thickness (F)']));
			var insertPt3 = insertPt2.add(dirA.multiply(-param['grip']));
			var insertPt4 = insertPt2.add(normA.multiply(param['insert height'])).add(dirA.multiply(param['insert width']/16));
			var insertPt7 = insertPt8.add(normA.multiply(param['material thickness (F)']));
			var insertPt6 = insertPt7.add(dirA.multiply(param['grip']));
			var insertPt5 = insertPt7.add(normA.multiply(param['insert height'])).add(dirA.multiply(-param['insert width']/16));
			returnA.push(generateFilletPath([insertPt1, insertPt2, insertPt3, insertPt4, insertPt5, insertPt6, insertPt7, insertPt8], [0, param['grip']/3, param['insert width']/4, param['insert width']/4, param['grip']/3, 0]));
			returnB.push(generateSlit(flapPt1, flapPt8, param['material thickness (M)']));
			returnAFold.push(generateFilletPath([insertPt1, insertPt8], []));
			returnBFold.push(generateFilletPath([flapFoldStart, flapPt1], []));
			flapFoldStart = flapPt8;
		}
		returnBFold.push(generateFilletPath([flapFoldStart, lineB.lastSegment.point], []));
		for (var i=0; i<insertCount-1; i++) {
			var pathOffsetStart = i*gap+(i+1)*param['insert width'];
			var pathOffsetEnd = (i+1)*gap+(i+1)*param['insert width'];
			var insertPt1 = ptAStart.add(dirA.multiply(pathOffsetStart));
			var insertPt8 = ptAStart.add(dirA.multiply(pathOffsetEnd));
			returnA.push(new Path.Line(insertPt1, insertPt8));
		}
		if (insertCount==1) {
			var pathOffsetStart = pathLength/2-param['insert width']/2;
			var pathOffsetEnd = pathLength/2+param['insert width']/2;
			var insertPt1 = ptAStart.add(dirA.multiply(pathOffsetStart));
			var insertPt8 = ptAStart.add(dirA.multiply(pathOffsetEnd));
			//returnA.push(new Path.Line(insertPt1, insertPt8));
		}
		returnA.push(new Path.Line(shape[shapeA].children[pathA].firstSegment.point, insertStart));
		returnA.push(new Path.Line(shape[shapeA].children[pathA].lastSegment.point, insertEnd));
		var flapStart = shape[shapeB].children[pathB].firstSegment.point;
		var flapEnd = shape[shapeB].children[pathB].lastSegment.point;
		var flapStartTip = flapStart.add(normB.multiply(param['flap height'])).add(dirB.multiply(param['flap height']/Math.tan(param['flap angle']/180*Math.PI)));
		var flapEndTip = flapEnd.add(normB.multiply(param['flap height'])).add(dirB.multiply(-param['flap height']/Math.tan(param['flap angle']/180*Math.PI)));
		var fil = calFillet(param['flap height']*0.8, param['flap angle']);
		returnB.push(generateFilletPath([flapStart, flapStartTip, flapEndTip, flapEnd], [fil, fil]));
		lineA.remove();
		lineB.remove();
		return {'returnA':returnA, 'returnB':returnB, 'returnAFold':returnAFold, 'returnBFold':returnBFold};
	}
}

function generateHemJoint(index, shapeA, pathA, shapeB, pathB, param) {
	var returnB = [];
	var returnA = [];
	var returnAFold = [];
	var returnBFold = [];
	
	shape[shapeA].children[pathA+'_joint'].addChild(shape[shapeA].children[pathA].clone());
	shape[shapeB].children[pathB+'_joint'].addChild(shape[shapeB].children[pathB].clone());
	var edgeA = shape[shapeA].children[pathA+'_joint'].children[0];
	var edgeB = shape[shapeB].children[pathB+'_joint'].children[0];

	shape[shapeA].children[pathA+'_joint'].removeChildren();
	shape[shapeB].children[pathB+'_joint'].removeChildren();
	
	shape[shapeA].children[pathA+'_joint'].addChild(shape[shapeA].children[pathA].clone());
	shape[shapeB].children[pathB+'_joint'].addChild(shape[shapeB].children[pathB].clone());
	var edgeA2 = shape[shapeA].children[pathA+'_joint'].children[0];
	var edgeB2 = shape[shapeB].children[pathB+'_joint'].children[0];
	shape[shapeA].children[pathA+'_joint'].removeChildren();
	shape[shapeB].children[pathB+'_joint'].removeChildren();
	var edgeA3 = new Path();
	var edgeB3 = new Path();
	var amount = Math.floor(edgeB2.length/10);
	amount = amount<3 ? 3 : amount;
	for (var i=0; i<amount+1; i++) {
		var pt = edgeA2.getPointAt(i/amount*edgeA2.length);
		var normal = edgeA2.getNormalAt(i/amount*edgeA2.length).multiply(joints[index]['dirM']);
		var pt2 = pt.add(normal.multiply(param['hem offset']));
		edgeA3.add(pt2);
		pt = edgeB2.getPointAt(i/amount*edgeB2.length);
		normal = edgeB2.getNormalAt(i/amount*edgeB2.length).multiply(joints[index]['dirF']);
		pt2 = pt.add(normal.multiply(param['hem offset']));
		edgeB3.add(pt2);
	}
	edgeA3.smooth();
	edgeB3.smooth();
	edgeA3.insert(0, edgeA2.firstSegment.point);
	edgeA3.insert(edgeA3.segments.length, edgeA2.lastSegment.point);
	edgeB3.insert(0, edgeB2.firstSegment.point);
	edgeB3.insert(edgeB3.segments.length, edgeB2.lastSegment.point);
	returnA.push(edgeA3);
	returnB.push(edgeB3);
	returnAFold.push(edgeA);
	returnBFold.push(edgeB);
	
	if (param['hole diameter']>0 && param['hole spacing']>0) {
		var holeCount = Math.floor(edgeA.length/param['hole spacing']);
		var gapA = edgeA.length/holeCount;
		var gapB = edgeB.length/holeCount;
		for (var i=0; i<holeCount; i++) {
			var ptA = edgeA.getPointAt(i*gapA+gapA/2);
			var ptB = edgeB.getPointAt(i*gapB+gapB/2);
			returnA.push(new Path.Circle(ptA, param['hole diameter']));
			returnB.push(new Path.Circle(ptB, param['hole diameter']));
		}
	}
	
	return {'returnA':returnA, 'returnB':returnB, 'returnAFold':returnAFold, 'returnBFold':returnBFold};
}

function generateFingerJoint(index, shapeA, pathA, shapeB, pathB, param) {
	var returnA = [];
	var returnB = [];
	var generateBool = true;
	if (shape[shapeA].children[pathA].segments.length==2 && shape[shapeB].children[pathB].segments.length==2) {
		for (i in shape[shapeA].children[pathA].segments) {
			if (shape[shapeA].children[pathA].segments[i].hasHandles()) {
				generateBool = false;
			}
		}
		for (i in shape[shapeB].children[pathB].segments) {
			if (shape[shapeB].children[pathB].segments[i].hasHandles()) {
				generateBool = false;
			}
		}
	} else {
		setMessage('<b>Paths have more than two points</b> Joint generated based on the start and end points.', '#F80');
	}
	if (!generateBool) {
		setMessage('<b>Paths are not straight</b> Joint generated based on the start and end points.', '#F80');
	}
	var lineA = new Path.Line(shape[shapeA].children[pathA].firstSegment.point, shape[shapeA].children[pathA].lastSegment.point);
	var lineB = new Path.Line(shape[shapeB].children[pathB].firstSegment.point, shape[shapeB].children[pathB].lastSegment.point);
	var ptAStart, ptAEnd, ptBStart, ptBEnd;
	if (param['offset start'] > 0) {
		ptAStart = lineA.getPointAt(param['offset start']);
		ptBStart = lineB.getPointAt(param['offset start']);
		//returnA.push(new Path.Line(shape[shapeA].children[pathA].firstSegment.point, ptAStart));
		//returnB.push(new Path.Line(shape[shapeB].children[pathB].firstSegment.point, ptBStart));
	} else {
		ptAStart = shape[shapeA].children[pathA].firstSegment.point;
		ptBStart = shape[shapeB].children[pathB].firstSegment.point;
	}
	if (param['offset end'] > 0) {
		ptAEnd = lineA.getPointAt(lineA.length-param['offset end']);
		ptBEnd = lineB.getPointAt(lineB.length-param['offset end']);
		//returnA.push(new Path.Line(shape[shapeA].children[pathA].lastSegment.point, ptAEnd));
		//returnB.push(new Path.Line(shape[shapeB].children[pathB].lastSegment.point, ptBEnd));
	} else {
		ptAEnd = shape[shapeA].children[pathA].lastSegment.point;
		ptBEnd = shape[shapeB].children[pathB].lastSegment.point;
	}
	var dirA = ptAEnd.subtract(ptAStart).normalize();
	var dirB = ptBEnd.subtract(ptBStart).normalize();
	var normA = new Point(dirA.y, -dirA.x);
	var normB = new Point(dirB.y, -dirB.x);
	var fingerCount = Math.floor(ptAStart.getDistance(ptAEnd)/(param['finger width']*2))*2;
	var gap = ptAStart.getDistance(ptAEnd)/fingerCount;
	var ptListA = [shape[shapeA].children[pathA].firstSegment.point];
	var ptListB = [shape[shapeB].children[pathB].firstSegment.point];
	var radiusArray = [param['material thickness (F)'], param['material thickness (M)'], param['finger width']/2];
	radiusArray.sort(function (a, b) {
		return a-b;
	});
	var fillet = param['finger radius']>radiusArray[0] ? radiusArray[0] : param['finger radius'];
	var filletArrayA = [];
	var filletArrayB = [];
	for (var i=0; i<fingerCount; i++) {
		if (i%2==0) {
			var ptA1 = ptAStart.add(dirA.multiply(i*gap));
			var ptA2 = ptA1.add(dirA.multiply(param['tolerance']/2));
			var ptA3 = ptA2.add(normA.multiply(param['material thickness (F)']*joints[index]['dirM']));
			var ptA6 = ptA1.add(dirA.multiply(gap));
			var ptA5 = ptA6.add(dirA.multiply(-param['tolerance']/2));
			var ptA4 = ptA5.add(normA.multiply(param['material thickness (F)']*joints[index]['dirM']));
			ptListA.push(ptA1, ptA2, ptA3, ptA4, ptA5, ptA6);
			filletArrayA.push(0, 0, fillet, fillet, 0, 0);
			
			var ptB1 = ptBStart.add(dirB.multiply(i*gap));
			var ptB2 = ptB1.add(dirB.multiply(gap));
			ptListB.push(ptB1, ptB2);
			filletArrayB.push(0, 0);
		} else {
			var ptB1 = ptBStart.add(dirB.multiply(i*gap));
			var ptB2 = ptB1.add(dirB.multiply(param['tolerance']/2));
			var ptB3 = ptB2.add(normB.multiply(param['material thickness (M)']*joints[index]['dirF']));
			var ptB6 = ptB1.add(dirB.multiply(gap));
			var ptB5 = ptB6.add(dirB.multiply(-param['tolerance']/2));
			var ptB4 = ptB5.add(normB.multiply(param['material thickness (M)']*joints[index]['dirF']));
			ptListB.push(ptB1, ptB2, ptB3, ptB4, ptB5, ptB6);
			filletArrayB.push(0, 0, fillet, fillet, 0, 0);
			
			var ptA1 = ptAStart.add(dirA.multiply(i*gap));
			var ptA2 = ptA1.add(dirA.multiply(gap));
			ptListA.push(ptA1, ptA2);
			filletArrayA.push(0, 0);
		}
	}
	ptListA.push(shape[shapeA].children[pathA].lastSegment.point);
	ptListB.push(shape[shapeB].children[pathB].lastSegment.point);
	
	returnA.push(generateFilletPath(ptListA, filletArrayA));
	returnB.push(generateFilletPath(ptListB, filletArrayB));
	
	lineA.remove();
	lineB.remove();
	
	return {'returnA':returnA, 'returnB':returnB};
}

function generateLoopInsert(index, shapeA, pathA, shapeB, pathB, param, softBool, surfBool, hookCount) {
	var returnB = [];
	var returnA = [];
	var returnAFold = [];
	var returnBFold = [];
	var generateBool = true;
	if (surfBool) {
		if (shape[shapeA].children[pathA].segments.length==2 && shape[shapeB].children[pathB].segments.length==2) {
			for (i in shape[shapeA].children[pathA].segments) {
				if (shape[shapeA].children[pathA].segments[i].hasHandles()) {
					generateBool = false;
				}
			}
			for (i in shape[shapeB].children[pathB].segments) {
				if (shape[shapeB].children[pathB].segments[i].hasHandles()) {
					generateBool = false;
				}
			}
		} else {
			setMessage('<b>Paths have more than two points</b> Joint generated based on the start and end points.', '#F80');
		}
	}
	
	if (!generateBool) {
		setMessage('<b>Paths are not straight</b> Joint generated based on the start and end points.', '#F80');
	}
	shape[shapeA].children[pathA+'_joint'].addChild(shape[shapeA].children[pathA].clone());
	shape[shapeB].children[pathB+'_joint'].addChild(shape[shapeB].children[pathB].clone());
	var edgeA = shape[shapeA].children[pathA+'_joint'].children[0];
	var edgeB = shape[shapeB].children[pathB+'_joint'].children[0];
	
	var aEnd = param['offset end']==0 ? edgeA.length-0.001 : edgeA.length-param['offset end'];
	var aStart = param['offset start']==0 ? 0.001 : param['offset start'];
	var bEnd = param['offset end']==0 ? edgeB.length-0.001 : edgeB.length-param['offset end'];
	var bStart = param['offset start']==0 ? 0.001 : param['offset start'];
	var edgeAEnd = edgeA.split(aEnd);
	var edgeAMid = edgeA.split(aStart);
	var edgeBEnd = edgeB.split(bEnd);
	var edgeBMid = edgeB.split(bStart);
	
	var jW = param['insert width']+param['joint spacing']*2;
	var jointCount = Math.floor(edgeAMid.length/jW);
	var edgeSegmentA = dividePath(edgeAMid, jointCount);
	var edgeSegmentB = dividePath(edgeBMid, jointCount);
	shape[shapeA].children[pathA+'_joint'].removeChildren();
	shape[shapeB].children[pathB+'_joint'].removeChildren();
	
	if (softBool && !surfBool) {
		shape[shapeB].children[pathB+'_joint'].addChild(shape[shapeB].children[pathB].clone());
		var edgeB2 = shape[shapeB].children[pathB+'_joint'].children[0];
		shape[shapeB].children[pathB+'_joint'].removeChildren();
		var edgeB3 = new Path();
		var amount = Math.floor(edgeB2.length/10);
		amount = amount<3 ? 3 : amount;
		for (var i=0; i<amount+1; i++) {
			var pt = edgeB2.getPointAt(i/amount*edgeB2.length);
			var normal = edgeB2.getNormalAt(i/amount*edgeB2.length).multiply(joints[index]['dirF']);
			var pt2 = pt.add(normal.multiply(param['hem offset']));
			edgeB3.add(pt2);
		}
		edgeB3.smooth();
		edgeB3.insert(0, edgeB2.firstSegment.point);
		edgeB3.insert(edgeB3.segments.length, edgeB2.lastSegment.point);
		returnB.push(edgeB3);
		returnBFold.push(edgeB2);
	} else if (!surfBool) {
		shape[shapeB].children[pathB+'_joint'].addChild(shape[shapeB].children[pathB].clone());
		var edgeB2 = shape[shapeB].children[pathB+'_joint'].children[0];
		shape[shapeB].children[pathB+'_joint'].removeChildren();
		returnB.push(edgeB2);
	}
	
	var intersectPath;
	
	if (edgeA.length>0) {
		returnA.push(edgeA);
	}
	if (edgeAEnd.length>0) {
		returnA.push(edgeAEnd);
	}
	
	for (i in edgeSegmentA) {

		var chordA = new Path([edgeSegmentA[i].firstSegment.point, edgeSegmentA[i].lastSegment.point]);
		var chordB = new Path([edgeSegmentB[i].firstSegment.point, edgeSegmentB[i].lastSegment.point]);
		
		var dirA = chordA.getNormalAt(chordA.length/2).multiply(joints[index]['dirM']);
		var chordAMidPt = chordA.getPointAt(chordA.length/2);
		var chordAJointStart = chordA.getPointAt(chordA.length/2-param['insert width']/2);
		var chordAJointEnd = chordA.getPointAt(chordA.length/2+param['insert width']/2);
		intersectPath = new Path([chordAJointStart.add(dirA.multiply(-100)), chordAJointStart.add(dirA.multiply(100))]);
		var pathAStartLoc = edgeSegmentA[i].getIntersections(intersectPath)[0];
		var pathAStart = pathAStartLoc.point;
		intersectPath.remove();
		intersectPath = new Path([chordAJointEnd.add(dirA.multiply(-100)), chordAJointEnd.add(dirA.multiply(100))]);
		var pathAEndLoc = edgeSegmentA[i].getIntersections(intersectPath)[0];
		var pathAEnd = pathAEndLoc.point;
		intersectPath.remove();
		var dirB = chordB.getNormalAt(chordB.length/2).multiply(joints[index]['dirF']);
		var chordBMidPt = chordB.getPointAt(chordB.length/2);
		var chordBJointStart = chordB.getPointAt(chordB.length/2-param['insert width']/2);
		var chordBJointEnd = chordB.getPointAt(chordB.length/2+param['insert width']/2);
		intersectPath = new Path([chordBJointStart.add(dirB.multiply(-100)), chordBJointStart.add(dirB.multiply(100))]);
		var pathBStartLoc = edgeSegmentB[i].getIntersections(intersectPath)[0];
		var pathBStart = pathBStartLoc.point;
		intersectPath.remove();
		intersectPath = new Path([chordBJointEnd.add(dirB.multiply(-100)), chordBJointEnd.add(dirB.multiply(100))]);
		var pathBEndLoc = edgeSegmentB[i].getIntersections(intersectPath)[0];
		var pathBEnd = pathBEndLoc.point;
		intersectPath.remove();
		var segmentA = edgeSegmentA[i].clone();
		var endSegment = segmentA.split(segmentA.getLocationOf(pathAEnd));
		var midSegment = segmentA.split(segmentA.getLocationOf(pathAStart)); // segmentA left with start segment
		
		var tanA = new Point(dirA.y, -dirA.x);
		tanA = tanA.multiply(joints[index]['dirM']);
		var extension = (chordAJointStart.getDistance(pathAStart)+chordAJointEnd.getDistance(pathAEnd))/2;
		var jointHeight;
		if (softBool || surfBool) {
			jointHeight = param['hem offset']+param['material thickness (F)']+param['material thickness (F)']+param['slack'];
		} else {
			jointHeight = Math.sqrt(Math.pow(param['hem offset'], 2)+Math.pow(param['material thickness (F)'], 2))+param['hem offset']*2+param['material thickness (F)']+param['slack'];
		}
		var ptAS = [];
		var ptAE = [];
		var ptAST = [];
		var ptAET = [];
		var matThick = param['material thickness (M)'];
		if (surfBool) {
			matThick = param['material thickness (F)']+param['material thickness (M)'];
		}
		for (var i=0; i<hookCount; i++) {
			if (i==0) {
				ptAS.push(chordAJointStart.add(dirA.multiply(extension+jointHeight)));
				ptAE.push(chordAJointEnd.add(dirA.multiply(extension+jointHeight)));
				ptAST.push(ptAS[0].add(dirA.multiply(-param['hook width'])).add(tanA.multiply(param['hook width'])));
				ptAET.push(ptAE[0].add(dirA.multiply(-param['hook width'])).add(tanA.multiply(-param['hook width'])));
			} else {
				ptAS.push(ptAS[(i-1)*2].add(dirA.multiply(param['insert width']+matThick)));
				ptAE.push(ptAE[(i-1)*2].add(dirA.multiply(param['insert width']+matThick)));
				ptAST.push(ptAST[(i-1)*2].add(dirA.multiply(param['insert width']+matThick)));
				ptAET.push(ptAET[(i-1)*2].add(dirA.multiply(param['insert width']+matThick)));
			}
			ptAS.push(ptAS[i*2].add(dirA.multiply(param['insert width'])));
			ptAE.push(ptAE[i*2].add(dirA.multiply(param['insert width'])));
			ptAST.push(ptAST[i*2].add(dirA.multiply(param['insert width'])));
			ptAET.push(ptAET[i*2].add(dirA.multiply(param['insert width'])));
		}
		var ptATip = chordAMidPt.add(dirA.multiply(extension+jointHeight+param['insert width']*(hookCount+0.5)+matThick*(hookCount-1)));
		var ptList = [pathAStart];
		var fillet = [];
		for (var i=0; i<ptAS.length; i++) {
			if (i%2==0) {
				ptList.push(ptAS[i]);
				fillet.push(0);
				ptList.push(ptAST[i]);
				fillet.push(param['hook width']/5);
			} else {
				ptList.push(ptAST[i]);
				fillet.push(param['hook width']/3);
				if (i<ptAS.length-1) {
					ptList.push(ptAS[i]);
					fillet.push(0);
				}
			}
		}
		ptList.push(ptATip);
		fillet.push(param['hook width']/1.5);
		for (var i=ptAE.length-1; i>=0; i--) {
			if (i%2==1) {
				if (i<ptAE.length-1) {
					ptList.push(ptAE[i]);
					fillet.push(0);
				}
				ptList.push(ptAET[i]);
				fillet.push(param['hook width']/3);
			} else {
				ptList.push(ptAET[i]);
				fillet.push(param['hook width']/5);
				ptList.push(ptAE[i]);
				fillet.push(0);
			}
			
		}
		ptList.push(pathAEnd);

		var insertPath = generateFilletPath(ptList, fillet);
		returnA.push(insertPath);
		returnA.push(endSegment);
		returnA.push(segmentA);
		
		var slitAS = [chordAJointStart.add(dirA.multiply(-param['hem offset']))];
		var slitAE = [chordAJointEnd.add(dirA.multiply(-param['hem offset']))];
		for (var i=0; i<hookCount-1; i++) {
			slitAS.push(slitAS[i].add(dirA.multiply(-param['insert width'])));
			slitAE.push(slitAE[i].add(dirA.multiply(-param['insert width'])));
		}	
		var slitBS = [];
		var slitBE = [];
		if (softBool && !surfBool) {
			slitBS.push(chordBJointStart);
			slitBE.push(chordBJointEnd);
		} else if ( !surfBool ) {
			slitBS.push(chordBJointStart.add(dirB.multiply(-param['hem offset'])));
			slitBE.push(chordBJointEnd.add(dirB.multiply(-param['hem offset'])));
		} else if (surfBool) {
			slitBS.push(chordBJointStart);
			slitBE.push(chordBJointEnd);
			for (var i=0; i<hookCount; i++) {
				if (i==0) {
					slitBS.push(slitBS[i].add(dirB.multiply(-param['hem offset'])));
					slitBE.push(slitBE[i].add(dirB.multiply(-param['hem offset'])));
				} else {
					slitBS.push(slitBS[i].add(dirB.multiply(-param['insert width'])));
					slitBE.push(slitBE[i].add(dirB.multiply(-param['insert width'])));
				}
			}
		}
		
		
		if (param['material thickness (M)']==0) {
			for (i in slitAS) {
				var AS = new Path([slitAS[i], slitAE[i]]);
				returnA.push(AS);
				returnA.push(new Path.Circle(slitAS[i], 0.25));
				returnA.push(new Path.Circle(slitAE[i], 0.25));
			}
			for (i in slitBS) {
				var BS = new Path([slitBS[i], slitBE[i]]);
				returnB.push(BS);
				returnB.push(new Path.Circle(slitBS[i], 0.25));
				returnB.push(new Path.Circle(slitBE[i], 0.25));
			}					
		} else {
			for (i in slitAS) {
				slitA = generateSlit(slitAS[i], slitAE[i], param['material thickness (M)']);	
				returnA.push(slitA);
			}
			for (i in slitBS) {
				slitB = generateSlit(slitBS[i], slitBE[i], param['material thickness (M)']);	
				returnB.push(slitB);
			}
		}
		chordA.remove();
		chordB.remove();
	}
	return {'returnA':returnA, 'returnB':returnB, 'returnAFold':returnAFold, 'returnBFold':returnBFold};
}

function dividePath(p, n) {
	var path = p;
	var segment = [];
	var gap = p.length/n;
	for (var i=n-1; i>0; i--) {
		var path1 = path.split(i*gap);
		segment.push(path1);
	}
	segment.push(path);
	path.remove();
	return segment;
}

function generateFilletPath(ptList, fillet) {
	var path = new Path();
	path.add(ptList[0]);
	for (var i=1; i<ptList.length-1; i++) {
		if (fillet[i-1]==0) {
			path.add(ptList[i]);
		} else {
			var vec1 = ptList[i-1].subtract(ptList[i]).normalize();
			var vec2 = ptList[i+1].subtract(ptList[i]).normalize();
			var angle = Math.abs(angleBetween(ptList[i-1], ptList[i], ptList[i+1]));
			var d1 = fillet[i-1]/Math.tan(angle/2);
			var d2 = fillet[i-1]/Math.sin(angle/2)-fillet[i-1];
			var arcS = ptList[i].add(vec1.multiply(d1));
			var arcE = ptList[i].add(vec2.multiply(d1));
			var vecMid = vec1.add(vec2).normalize();
			var arcMid = ptList[i].add(vecMid.multiply(d2));
			var arc = new Path.Arc(arcS, arcMid, arcE);
			path.addSegments(arc.segments);
			arc.remove();
		}
	}
	path.add(ptList[ptList.length-1]);
	
	return path;
}

function generatePath(ptList) {
	var path = new Path();
	for (var i=0; i<ptList.length; i++) {
		path.add(ptList[i]);
	}
	
	return path;
}

function generateSlit(start, end, thickness) {
	var tangent = end.subtract(start).normalize();
	var normal = new Point(tangent.y, -tangent.x);
	var start1 = start.add(normal.multiply(thickness/2)).add(tangent.multiply(thickness/2));
	var start2 = start.add(normal.multiply(-thickness/2)).add(tangent.multiply(thickness/2));
	var end1 = end.add(normal.multiply(thickness/2)).add(tangent.multiply(-thickness/2));
	var end2 = end.add(normal.multiply(-thickness/2)).add(tangent.multiply(-thickness/2));
	var slitPath = new Path();
	var arc1 = new Path.Arc(start1, start, start2);
	var arc2 = new Path.Arc(end2, end, end1);
	slitPath.addSegments(arc1.segments);
	slitPath.addSegments(arc2.segments);
	slitPath.addSegment(start1);
	arc1.remove();
	arc2.remove();
	return slitPath;
}

function angleVec(BA, CD) { //Angle between BA and CD
	var theta = Math.atan2(BA.x*CD.y-BA.y*CD.x, BA.x*CD.x+BA.y*CD.y);
	return theta;
}

function angleBetween(ptA, ptB, ptC) { //Angle between BA and BC
	var BA = {'x':(ptA.x-ptB.x), 'y':(ptA.y-ptB.y)};
	var BC = {'x':(ptC.x-ptB.x), 'y':(ptC.y-ptB.y)};
	var theta = Math.atan2(BA.x*BC.y-BA.y*BC.x, BA.x*BC.x+BA.y*BC.y);
	return theta;
}

function lineIntersection(line1Start, line1End, line2Start, line2End) {
    // if the lines intersect, the result contains the x and y of the intersection (treating the lines as infinite) and booleans for whether line segment 1 or line segment 2 contain the point
    var denominator, a, b, numerator1, numerator2, result = {
        x: null,
        y: null,
        onLine1: false,
        onLine2: false
    };
	
    denominator = ((line2End.y - line2Start.y) * (line1End.x - line1Start.x)) - ((line2End.x - line2Start.x) * (line1End.y - line1Start.y));
    if (denominator == 0) {
        return result;
    }
	
    a = line1Start.y - line2Start.y;
    b = line1Start.x - line2Start.x;
    numerator1 = ((line2End.x - line2Start.x) * a) - ((line2End.y - line2Start.y) * b);
    numerator2 = ((line1End.x - line1Start.x) * a) - ((line1End.y - line1Start.y) * b);
    a = numerator1 / denominator;
    b = numerator2 / denominator;

    // if we cast these lines infinitely in both directions, they intersect here:
    result.x = line1Start.x + (a * (line1End.x - line1Start.x));
    result.y = line1Start.y + (a * (line1End.y - line1Start.y));

    // if line1 is a segment and line2 is infinite, they intersect if:
    if (a > 0 && a < 1) {
        result.onLine1 = true;
    }
    // if line2 is a segment and line1 is infinite, they intersect if:
    if (b > 0 && b < 1) {
        result.onLine2 = true;
    }
    // if line1 and line2 are segments, they intersect if both of the above are true
    return result;
};

function exportProject() {
	emptyAll();
	activateDim(false);
	paper.view.zoom = 1;
	if (shape.length > 0) {
		calProjectBounds();
		for (i in shape) {
			for (j in shape[i].children) {
				shape[i].children[j].strokeWidth = 0.001;
				if (shape[i].children[j].className=='Path') {
					if (shape[i].children[j].name=='joint') {
						shape[i].children[j].strokeColor = '#F00';
					} else {
						shape[i].children[j].strokeColor = shapeColor[i][j];
					}
				} else if (shape[i].children[j].className=='Group') {
					var shapeName = shape[i].children[j].name;
					if (typeof(shapeName)==='undefined') {
						shape[i].children[j].strokeColor = '#F0F';
					} else {
						var shapeNameStr = shapeName.split('_');
						if (shapeNameStr[shapeNameStr.length-1] == 'joint') {
							shape[i].children[j].strokeColor = '#00F';
							if (shape[i].children[j].children['folds']) {
								shape[i].children[j].children['folds'].strokeColor = '#0FF';
							}
						} else {
							shape[i].children[j].strokeColor = '#F0F';
						}
					}
				}
			}
		}
		var svgWidth = projectBounds.maxX;
		var svgHeight = projectBounds.maxY;
		var svgContent = $(project.exportSVG()).html();
		var svgString = '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="'+svgWidth+'mm" height="'+svgHeight+'mm" viewBox="'+0+' '+0+' '+svgWidth+' '+svgHeight+'">'+svgContent+'</svg>';
		
		var blob = new Blob([svgString], {type: 'image/svg+xml'});
		var d = new Date();
		saveAs(blob, 'joinery_'+d.getFullYear()+'-'+(d.getMonth()+1)+'-'+d.getDate()+'_'+d.getHours()+'.'+d.getMinutes()+'.'+d.getSeconds()+'.svg');
		refreshShapeDisplay();
		setMessage('<b>SVG Exported</b>', '#444');
	} else {
		setMessage('<b>No drawings to export</b>', '#F80');
	}
	paper.view.zoom = paperScale;
	activateDim(dimBool);
	refreshShapeDisplay();
}