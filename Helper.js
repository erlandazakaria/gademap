import { Shape, Color } from 'three';
var progressAndText = function (progress, text, progressValue, textValue) {
    if (progress === void 0) { progress = null; }
    if (text === void 0) { text = null; }
    progress && progress(progressValue);
    text && text(textValue);
};
var addToRaycaster = function (objects) {
    if (!objects)
        return [];
    var objArr = [];
    objects.traverse(function (c) {
        if (c.type === 'Group') {
            c.traverse(function (cc) { return objArr.push(cc); });
        }
        else if (c && c.material && c.material.visible && c.userData && (c.userData.type === 'shape' || c.userData.type === 'building')) {
            objArr.push(c);
        }
    });
    return objArr;
};
var generateDefaultCalibration = function (grounds) {
    var x = 0;
    var y = 10;
    var z = 20;
    if (grounds.length > 0) {
        var groundLocation = findGroundLocation(grounds);
        var zBasedOnWidth = -(groundLocation.mostFront - ((groundLocation.mostBack - groundLocation.mostFront) / 2));
        var zBasedOnLength = -(groundLocation.mostLeft - ((groundLocation.mostRight - groundLocation.mostLeft) / 2));
        x = (groundLocation.mostRight + groundLocation.mostLeft) / 2;
        y = groundLocation.highest / 2;
        z = zBasedOnWidth > zBasedOnLength ? zBasedOnWidth * 2 : zBasedOnLength;
    }
    return {
        view: 'multifloor',
        position: { x: x, y: y, z: z },
        target: { x: 0, y: 0, z: 0 }
    };
};
var generateLevelCalibration = function (level) {
    var highest = 0;
    level.children && level.children.length > 0 && level.children.forEach(function (c) {
        if (c.userData && c.userData.height && c.userData.height > highest) {
            highest = c.userData.height;
        }
    });
    var groundLoc = findGroundLocation([level.userData]);
    var zBasedOnWidth = level.userData.type === 'building' ? level.userData.height : -(groundLoc.mostFront - ((groundLoc.mostBack - groundLoc.mostFront) / 2));
    var zBasedOnLength = level.userData.type === 'building' ? level.userData.height : -(groundLoc.mostLeft - ((groundLoc.mostRight - groundLoc.mostLeft) / 2));
    return {
        position: {
            x: level && level.geometry && level.geometry.boundingSphere ? level.geometry.boundingSphere.center.x : 0,
            y: level.userData.type === 'building' ? level.userData.height : level.userData.position.y + highest + 10,
            z: zBasedOnWidth > zBasedOnLength ? zBasedOnWidth : zBasedOnLength
        },
        target: {
            x: level && level.geometry && level.geometry.boundingSphere ? level.geometry.boundingSphere.center.x : 0,
            y: level.userData.type === 'building' ? level.userData.height / 2 : level.userData.position.y,
            z: level && level.geometry && level.geometry.boundingSphere ? level.geometry.boundingSphere.center.z : 0,
        }
    };
};
var findGroundLocation = function (grounds) {
    var highest = 0;
    var mostLeft = 0;
    var mostRight = 0;
    var mostBack = 0;
    var mostFront = 0;
    if (grounds.length > 0) {
        grounds.forEach(function (g, gi) {
            if (gi === 0) {
                highest = g.position.y;
            }
            if (g.position.y > highest) {
                highest = g.position.y;
            }
            g.shape_points.forEach(function (sp, spi) {
                if (spi === 0 && gi === 0) {
                    mostLeft = sp.x;
                    mostRight = sp.x;
                    mostBack = sp.y;
                    mostFront = sp.y;
                }
                if (sp.x < mostLeft) {
                    mostLeft = sp.x;
                }
                if (sp.x > mostRight) {
                    mostRight = sp.x;
                }
                if (sp.y > mostBack) {
                    mostBack = sp.y;
                }
                if (sp.y < mostFront) {
                    mostFront = sp.y;
                }
            });
        });
    }
    return {
        highest: highest,
        mostLeft: mostLeft,
        mostRight: mostRight,
        mostBack: mostBack,
        mostFront: mostFront
    };
};
var generateZShape = function (shape_points) {
    var lessZ = 0;
    var mostZ = 0;
    shape_points.forEach(function (sp) {
        if (sp.y > mostZ) {
            mostZ = sp.y;
        }
        if (sp.y < lessZ) {
            lessZ = sp.y;
        }
    });
    return {
        lessZ: lessZ,
        mostZ: mostZ
    };
};
var generateCurves = function (curves) {
    var shape = new Shape();
    curves.forEach(function (c) {
        if (c.type === 'moveTo') {
            shape.moveTo(c.endPoint.x, c.endPoint.y);
        }
        else if (c.type === 'lineTo') {
            shape.lineTo(c.endPoint.x, c.endPoint.y);
        }
        else if (c.type === 'quadTo') {
            shape.quadraticCurveTo(c.quad ? c.quad.x : 0, c.quad ? c.quad.y : 0, c.endPoint.x, c.endPoint.y);
        }
        else if (c.type === 'beziTo') {
            shape.bezierCurveTo(c.bezi1 ? c.bezi1.x : 0, c.bezi1 ? c.bezi1.y : 0, c.bezi2 ? c.bezi2.x : 0, c.bezi2 ? c.bezi2.y : 0, c.endPoint.x, c.endPoint.y);
        }
    });
    return shape;
};
var newColor = function (arg) {
    return new Color(arg).convertSRGBToLinear();
};
var pluralIt = function (text) {
    if (text === "ground")
        return "grounds";
    if (text === "building")
        return "buildings";
    if (text === "shape")
        return "shapes";
    if (text === "place")
        return "places";
    if (text === "pathVertice")
        return "pathVertices";
    if (text === "pathEdge")
        return "pathEdges";
    if (text === "label")
        return "labels";
    return text;
};
var singularIt = function (text) {
    if (text === "grounds")
        return "ground";
    if (text === "buildings")
        return "building";
    if (text === "shapes")
        return "shape";
    if (text === "places")
        return "place";
    if (text === "pathVertices")
        return "pathVertice";
    if (text === "pathEdges")
        return "pathEdge";
    if (text === "labels")
        return "label";
    return text;
};
var calculateLength = function (pos1, pos2) {
    var length = pos1.x === pos2.x ? pos1.z - pos2.z : pos1.x - pos2.x;
    return length < 0 ? length * -1 : length;
};
var getMaxDistace = function (pos1, pos2) {
    // Get Difference
    var x = pos1.x - pos2.x;
    var y = pos1.y - pos2.y;
    var z = pos1.z - pos2.z;
    // Turn into Positive
    x = x < 0 ? x * -1 : x;
    y = y < 0 ? y * -1 : y;
    z = z < 0 ? z * -1 : z;
    // Return The Max Distance
    return x > y
        ? x > z ? x : z
        : y > z ? y : z;
};
var getYDistanceDiff = function (firstY, secondY) {
    return firstY - secondY <= 0 ? -(firstY - secondY) : firstY - secondY;
};
export { progressAndText, addToRaycaster, generateDefaultCalibration, generateLevelCalibration, findGroundLocation, generateZShape, generateCurves, newColor, pluralIt, singularIt, calculateLength, getMaxDistace, getYDistanceDiff };
