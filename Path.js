var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
import { SphereBufferGeometry, MeshBasicMaterial, Mesh } from 'three';
import _ from 'lodash';
import { newColor, generateZShape, getYDistanceDiff } from './Helper';
var GadePath = /** @class */ (function () {
    function GadePath(data, scene, objects, animation) {
        var _this = this;
        this.drawingEdgeSpheres = function () {
            _this.pathEdges = _this.objects.data.pathEdges.map(function (edge) {
                var from = edge.from
                    ? _this.objects.data.pathVertices.find(function (vertice) { return vertice._id === edge.from; })
                    : {
                        gateway: null,
                        gateway_type: null,
                        place: null,
                        position: _this.pinPosition,
                        shape: null,
                        type: "userpoint",
                        _id: edge._id
                    };
                var to = _this.objects.data.pathVertices.find(function (vertice) { return vertice._id === edge.to; });
                if (!from || !to) {
                    return null;
                }
                // CALCULATE SPHERES
                var spheres = [];
                var affect = null;
                var isPositive = false;
                switch (true) {
                    case from && from.position && to && to.position && from.position.x !== to.position.x:
                        affect = "x";
                        isPositive = from && from.position && to && to.position ? from.position.x < to.position.x : false;
                        break;
                    case from && from.position && to && to.position && from.position.y !== to.position.y:
                        affect = "y";
                        isPositive = from && from.position && to && to.position ? from.position.y < to.position.y : false;
                        break;
                    case from && from.position && to && to.position && from.position.z !== to.position.z:
                        affect = "z";
                        isPositive = from && from.position && to && to.position ? from.position.z < to.position.z : false;
                        break;
                    default: break;
                }
                if (from.position && to.position && affect === "x") {
                    for (var i = from.position.x; isPositive ? i <= to.position.x : i >= to.position.x; isPositive ? i = i + _this.gap : i = i - _this.gap) {
                        spheres.push(__assign(__assign({}, from.position), { x: i }));
                    }
                }
                else if (from.position && to.position && affect === "y") {
                    for (var i = from.position.y; isPositive ? i <= to.position.y : i >= to.position.y; isPositive ? i = i + _this.gap : i = i - _this.gap) {
                        spheres.push(__assign(__assign({}, from.position), { y: i }));
                    }
                }
                else if (from.position && to.position && affect === "z") {
                    for (var i = from.position.z; isPositive ? i <= to.position.z : i >= to.position.z; isPositive ? i = i + _this.gap : i = i - _this.gap) {
                        spheres.push(__assign(__assign({}, from.position), { z: i }));
                    }
                }
                if (!edge.from) {
                    _this.pinEdge = { _id: edge._id, from: from !== null && from !== void 0 ? from : null, to: to !== null && to !== void 0 ? to : null, length: edge.length, spheres: _this.drawSpheres(spheres) };
                    _this.pinVertice = { gateway: null, gateway_type: null, place: null, position: _this.pinPosition, shape: null, type: "userpoint", _id: edge._id };
                }
                return !edge.from ? _this.pinEdge : {
                    _id: edge._id,
                    from: from,
                    to: to,
                    length: edge.length,
                    spheres: _this.drawSpheres(spheres)
                };
            });
        };
        this.drawSpheres = function (spheres) {
            return spheres.map(function (sphere) {
                var sphereGeometry = new SphereBufferGeometry(0.25, 32, 32);
                var sphereMaterial = new MeshBasicMaterial({ color: newColor(_this.pathColor) });
                var sphereMesh = new Mesh(sphereGeometry, sphereMaterial);
                sphereMesh.position.set(sphere.x, sphere.y, sphere.z);
                sphereMesh.name = 'drawedPath';
                sphereMesh.visible = false;
                sphereMesh.layers.enableAll();
                _this.scene.add(sphereMesh);
                return sphereMesh;
            });
        };
        this.findPath = function (to, from) {
            if (!to)
                return;
            var pathFound = [];
            // IF CUSTOM DEPARTURE NOT YET
            var fromVertice = from
                ? _this.objects.data.pathVertices.find(function (vertice) { return vertice.place === from; })
                : _this.pinVertice;
            var destVertice = _this.objects.data.pathVertices.find(function (vertice) { return vertice.place && vertice.place === to; });
            var destEdge = _this.pathEdges.filter(function (edge) { return destVertice && edge.to._id === destVertice._id; });
            if (!fromVertice)
                return;
            destEdge.forEach(function (de) {
                var findNextEdge = function (path, edges) {
                    var unVisitedEdges = edges.filter(function (edge) { return edge._id !== path[path.length - 1]._id; });
                    var last = path[path.length - 1].from;
                    if (fromVertice && last !== null && last !== undefined && typeof last !== "string" && last._id === fromVertice._id) {
                        pathFound.push(path);
                        return;
                    }
                    var nextEdge = unVisitedEdges.filter(function (edge) {
                        return edge.to === path[path.length - 1].from
                            || edge.from === path[path.length - 1].from;
                    });
                    if (nextEdge.length > 0) {
                        nextEdge.forEach(function (edge) {
                            if (path[path.length - 1].from === edge.from || path[path.length - 1].to === edge.to) {
                                var tempSphere = edge.spheres ? __spreadArray([], edge.spheres, true) : [];
                                findNextEdge(__spreadArray(__spreadArray([], path, true), [__assign(__assign({}, edge), { to: edge.from, from: edge.to, spheres: _.reverse(tempSphere) })], false), unVisitedEdges);
                            }
                            else {
                                findNextEdge(__spreadArray(__spreadArray([], path, true), [edge], false), unVisitedEdges);
                            }
                        });
                    }
                };
                findNextEdge([de], _this.pathEdges);
            });
            // FIND BEST ROUTE
            var bestRoute = _.reverse(pathFound.reduce(function (accumulator, current) {
                if (!accumulator)
                    return current;
                var accLength = accumulator.reduce(function (acc, curr) { return curr.length + acc; }, 0);
                var currLength = current.reduce(function (acc, curr) { return curr.length + acc; }, 0);
                return accLength > currLength ? current : accumulator;
            }, null));
            // GENERATE STEPS
            return _this.generateSteps(bestRoute);
        };
        this.generateSteps = function (paths) {
            var calculatedSteps = [];
            paths.forEach(function (path, index) {
                // STEP EVEN: CHANGE FLOOR DAN DRAW
                if (index === 0) {
                    if (path.from !== null && path.from !== undefined && typeof path.from !== "string" && path.from.type === "userpoint") {
                        var calibration = _this.data.calibrations.find(function (clb) { return _this.pinLevel && typeof clb.level !== "string" && clb.level._id === _this.pinLevel.userData._id; });
                        calculatedSteps.push({
                            type: "single",
                            levels: _this.pinLevel ? [_this.pinLevel] : [],
                            calibration: calibration,
                            // position: usercalibration ? usercalibration.position : {...path.from.position, y: path.from.position + 10},
                        });
                    }
                    else {
                        var shape_1 = _this.data.shapes.find(function (shape) {
                            return path.from && path.from !== null && path.from !== undefined && typeof path.from !== "string"
                                && shape._id === path.from.shape;
                        });
                        var level_1 = _this.objects.rendered.grounds.find(function (o) { return shape_1 && o.userData._id === shape_1.parent; });
                        var calibration = _this.data.calibrations.find(function (clb) { return level_1 && clb && typeof clb.level !== "string" && clb.level._id === level_1.userData._id; });
                        calculatedSteps.push({
                            type: "single",
                            levels: [level_1],
                            calibration: calibration,
                            // position: {...path.from.position, y: path.from.position + 10}
                        });
                    }
                }
                if (path.from && typeof path.from !== "string" && path.from.type === "gateway") {
                    if (path.to && typeof path.to !== "string" && path.to.type === "gateway") {
                        calculatedSteps[calculatedSteps.length - 1].lookAt = path.from.position;
                        var fromLevel = _this.objects.rendered.grounds.find(function (lvl) { return path.from && typeof path.from !== "string" && lvl.userData._id === path.from.gateway; });
                        var toLevel = _this.objects.rendered.grounds.find(function (lvl) { return path.to && typeof path.to !== "string" && lvl.userData._id === path.to.gateway; });
                        var multiCalibration = {
                            _id: "multi",
                            map: "multi-map",
                            view: "single",
                            level: fromLevel === null || fromLevel === void 0 ? void 0 : fromLevel.userData,
                            level_type: fromLevel === null || fromLevel === void 0 ? void 0 : fromLevel.userData.type,
                            position: {
                                x: fromLevel.userData.position.x,
                                y: fromLevel.userData.position.y + fromLevel.userData.height,
                                // z: 100
                                z: generateZShape(fromLevel.userData.shape_points).mostZ
                                    + getYDistanceDiff(toLevel.userData.position.y, fromLevel.userData.position.y) + 20
                            },
                            target: path.from.position
                        };
                        calculatedSteps.push({
                            type: "multi",
                            levels: [fromLevel, toLevel],
                            lookAt: path.from.position,
                            calibration: multiCalibration,
                        });
                    }
                    else {
                        var level_2 = _this.objects.rendered.grounds.find(function (lvl) { return path.from && typeof path.from !== "string" && lvl.userData._id === path.from.gateway; });
                        var calibration = _this.data.calibrations.find(function (clb) { return level_2 && typeof clb.level !== "string" && clb.level._id === level_2.userData._id; });
                        calculatedSteps.push({
                            type: "single",
                            levels: [level_2],
                            calibration: calibration,
                        });
                    }
                }
                // LAST STEP: LOOK AT DESTINATION
                if (path && path.to && typeof path.to !== "string" && path.to.type === "destination") {
                    calculatedSteps[calculatedSteps.length - 1].lookAt = path.to.position;
                }
                // ADD SPHERES
                var spheres = [];
                if (path && path.spheres) {
                    spheres = calculatedSteps[calculatedSteps.length - 1].spheres
                        ? __spreadArray(__spreadArray([], calculatedSteps[calculatedSteps.length - 1].spheres, true), path.spheres, true) : __spreadArray([], path.spheres, true);
                }
                calculatedSteps[calculatedSteps.length - 1].spheres = spheres;
            });
            var newPaths = __spreadArray([], paths, true);
            return {
                from: newPaths[0].from.type === "userpoint" ? null : newPaths[0].from.place,
                to: newPaths.length > 0 ? newPaths[newPaths.length - 1].to.place : null,
                steps: calculatedSteps
            };
            ;
        };
        this.data = data;
        this.gap = data.path_gap || 1;
        this.scene = scene;
        this.objects = objects;
        this.animation = animation;
        this.pathColor = data.highlight_color || "#2AA5A5";
        this.pinLevel = undefined;
        this.pinPosition = null;
        this.pinVertice = null;
        this.pinEdge = null;
        this.pathEdges = [];
        this.calculatedPath = [];
        this.drawedPath = [];
        this.visiblePath = [];
    }
    GadePath.prototype.init = function () {
        var _this = this;
        return new Promise(function (res) {
            try {
                // SET PIN
                if (_this.data && _this.data.pin && _this.data.pin.level) {
                    _this.pinLevel = _this.objects.rendered.grounds.find(function (o) { return o.userData._id === _this.data.pin.level; });
                }
                _this.pinPosition = _this.data.pin
                    ? __assign(__assign({}, _this.data.pin.position), { y: _this.pinLevel
                            ? _this.pinLevel.userData.position.y + _this.pinLevel.userData.height
                            : _this.data.pin.position.y }) : { x: 0, y: 0, z: 0 };
                // USER
                _this.drawingEdgeSpheres();
                // CALCULATE ALL DESTINATION PLACE
                _this.calculatedPath = _this.objects.data.pathVertices
                    .filter(function (vertice) { return vertice.type === 'destination'; })
                    .map(function (vertice) { return vertice.place && _this.findPath(vertice.place); });
                res('done');
            }
            catch (err) {
                console.error('Path Init Error');
                console.log(err);
            }
        });
    };
    return GadePath;
}());
export default GadePath;
//# sourceMappingURL=Path.js.map