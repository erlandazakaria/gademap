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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
import { Vector3 } from 'three';
import { gsap } from 'gsap';
import { newColor } from './Helper';
var Animation = /** @class */ (function () {
    function Animation(camera, control, changeLevel) {
        this.camera = camera;
        this.control = control;
        this.changeLevel = changeLevel;
        this.hiddenLevel = [];
        this.isAnimating = false;
        this.pathSpeed = 1;
        this.animatePerSphere = 5;
        this.generalYDistance = 30; // 15
        this.generalZDistance = 30; // 15
        this.pathYDistance2 = 60;
        this.dummyStart = { x: 0, y: 0, z: 0 };
        this.dummyFinish = { x: 0, y: 0, z: 0 };
    }
    Animation.prototype.calibrateCamera = function (calibration) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (res) {
                        var calibrateCameraGSAP = gsap.timeline({
                            paused: true,
                            onComplete: function () { res(true); }
                        });
                        // GSAP CAMERA
                        calibrateCameraGSAP.to(_this.camera.position, {
                            duration: 2,
                            onStart: function () {
                                _this.camera.lookAt(new Vector3(calibration.target.x, calibration.target.y, calibration.target.z));
                                _this.camera.updateProjectionMatrix();
                            },
                            x: calibration.position.x,
                            y: calibration.position.y,
                            z: calibration.position.z
                        }, "calibrate-camera-control");
                        // GSAP CONTROL
                        calibrateCameraGSAP.to(_this.control.target, {
                            duration: 2,
                            onUpdate: function () {
                                _this.control.update();
                            },
                            x: calibration.target.x,
                            y: calibration.target.y,
                            z: calibration.target.z
                        }, "calibrate-camera-control");
                        calibrateCameraGSAP.play();
                    })];
            });
        });
    };
    Animation.prototype.showAllLevels = function () {
        var _this = this;
        this.hiddenLevel.forEach(function (level) {
            _this.showHideObject3D(level, true);
        });
    };
    Animation.prototype.hideLevels = function (levels) {
        var _this = this;
        var hiddenList = this.hiddenLevel.map(function (lvl) { return lvl.userData._id; });
        levels.forEach(function (level) {
            if (!hiddenList.includes(level.userData._id))
                gsap.to(level.material, {
                    duration: 0.5,
                    onStart: function () {
                        level.visible = true;
                        level.material.transparent = true;
                    },
                    onComplete: function () {
                        _this.hiddenLevel.push(level);
                        level.visible = false;
                    },
                    opacity: 0
                });
        });
    };
    Animation.prototype.showTwoLevels = function (levels) {
        var _this = this;
        return new Promise(function (res) {
            var showTwoLevelsGSAP = gsap.timeline({
                paused: true,
                onComplete: function () { res(true); }
            });
            var hiddenList = _this.hiddenLevel.map(function (lvl) { return lvl.userData._id; });
            levels.forEach(function (level) {
                if (hiddenList.includes(level.userData._id))
                    showTwoLevelsGSAP.to(level.material, {
                        duration: 0.5,
                        onStart: function () {
                            level.visible = true;
                        },
                        onComplete: function () {
                            level.material.transparent = false;
                            level.material.needsUpdate = true;
                        },
                        opacity: 1
                    });
            });
            showTwoLevelsGSAP.play();
        });
    };
    Animation.prototype.calibrateTwoLevels = function (calibration) {
        var _this = this;
        return new Promise(function (res) {
            var calibrateTwoLevelsGSAP = gsap.timeline({
                paused: true,
                onComplete: function () { res(true); }
            });
            calibrateTwoLevelsGSAP.to(_this.camera.position, {
                duration: 2,
                onStart: function () {
                    _this.camera.lookAt(new Vector3(calibration.target.x, calibration.target.y, calibration.target.z));
                },
                onUpdate: function () { _this.camera.updateProjectionMatrix(); _this.control.update(); },
                x: calibration.position.x,
                y: calibration.position.y,
                z: calibration.position.z,
            });
            calibrateTwoLevelsGSAP.play();
        });
    };
    Animation.prototype.showHideObject3D = function (object, show) {
        var _this = this;
        if (show) {
            this.hiddenLevel = this.hiddenLevel.filter(function (lvl) { return lvl.userData._id !== object.userData._id; });
            gsap.to(object.material, {
                duration: 0.5,
                onStart: function () {
                    object.visible = true;
                    // object.material.opacity = 0;
                },
                onComplete: function () {
                    object.material.transparent = false;
                    object.material.needsUpdate = true;
                },
                opacity: 1
            });
        }
        else {
            gsap.to(object.material, {
                duration: 0.5,
                onStart: function () {
                    object.visible = true;
                    object.material.transparent = true;
                },
                onComplete: function () {
                    _this.hiddenLevel.push(object);
                    object.visible = false;
                },
                opacity: 0
            });
        }
    };
    Animation.prototype.addTransparentBuilding = function (object) {
        var _this = this;
        object.visible = true;
        object.material.opacity = 1;
        object.material.transparent = true;
        gsap.to(object.material, {
            duration: 1,
            onComplete: function () {
                _this.hiddenLevel.push(object);
                object.material.needsUpdate = true;
            },
            opacity: 0.5
        });
    };
    Animation.prototype.addTransparentParentBuilding = function (object) {
        var _this = this;
        object.material.opacity = 1;
        object.material.transparent = true;
        gsap.to(object.material, {
            duration: 1,
            onComplete: function () {
                _this.hiddenLevel.push(object);
                object.visible = true;
                object.material.needsUpdate = true;
            },
            opacity: 0.0
        });
    };
    Animation.prototype.selectShape = function (object, duration) {
        var _this = this;
        var center = object.type === 'Group' ? object.userData.position : object.geometry.boundingSphere.center;
        gsap.to(this.camera.position, {
            duration: duration,
            onUpdate: function () {
                _this.camera.lookAt(new Vector3(center.x, center.y, center.z));
                _this.camera.updateProjectionMatrix();
                _this.control.target.copy(center);
                _this.control.update();
            },
            x: center.x,
            y: center.y + this.generalYDistance,
            z: center.z + this.generalZDistance,
        });
    };
    Animation.prototype.scale = function (object, duration, scale) {
        var scalingGSAP = gsap.timeline();
        scalingGSAP.to(object.scale, duration || 1, { x: scale[0], y: scale[1], z: scale[2] }, 0);
        if (object.children.length > 0) {
            object.children.forEach(function (c) {
                if (c.userData.label && c.userData.label.content === "image") {
                    scalingGSAP.to(c.scale, duration || 1, {
                        x: c.userData.label.type === 'billboard' ? c.userData.label.image_scale.x : c.userData.label.image_scale.x * 1.5,
                        y: c.userData.label.type === 'billboard' ? c.userData.label.image_scale.y * 10 / 15 : c.userData.label.image_scale.y * 1.5,
                        z: c.userData.label.type === 'billboard' ? c.userData.label.image_scale.z : c.userData.label.image_scale.z * 1.5
                    }, 0);
                }
            });
        }
    };
    Animation.prototype.unscale = function (object, duration, scale) {
        var scalingGSAP = gsap.timeline();
        scalingGSAP.to(object.scale, duration || 1, { x: scale[0], y: scale[1], z: scale[2] }, 0);
        if (object.children.length > 0) {
            object.children.forEach(function (c) {
                if (c.userData.label && c.userData.label.content === "image") {
                    scalingGSAP.to(c.scale, duration || 1, {
                        x: c.userData.label.type === 'billboard' ? c.userData.label.image_scale.x : c.userData.label.image_scale.x,
                        y: c.userData.label.type === 'billboard' ? c.userData.label.image_scale.y : c.userData.label.image_scale.y,
                        z: c.userData.label.type === 'billboard' ? c.userData.label.image_scale.z : c.userData.label.image_scale.z
                    }, 0);
                }
            });
        }
    };
    Animation.prototype.changeColor = function (object, duration, color) {
        var targetColor = newColor(color || '#2AA5A5');
        if (object.type === 'Group') {
            object.children.forEach(function (c) {
                var name = c.name.split('-');
                if (name[0] === 'colorable') {
                    gsap.to(c.material.color, duration || 1, { r: targetColor.r, g: targetColor.g, b: targetColor.b });
                }
            });
        }
        else {
            gsap.to(object.material.color, duration || 1, { r: targetColor.r, g: targetColor.g, b: targetColor.b });
        }
    };
    Animation.prototype.showPath = function (path) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                this.isAnimating = true;
                return [2 /*return*/, new Promise(function (resolve) {
                        var newVisiblePath = [];
                        var drawingPathGSAP = gsap.timeline({
                            paused: true,
                            onComplete: function () { _this.isAnimating = false; resolve(newVisiblePath); }
                        });
                        var changeLevelHandler = function (level) { return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        drawingPathGSAP.pause();
                                        return [4 /*yield*/, this.changeLevel(level.userData, false)];
                                    case 1:
                                        _a.sent();
                                        drawingPathGSAP.play();
                                        return [2 /*return*/];
                                }
                            });
                        }); };
                        var showTwoLevelsHandler = function (levels, calibration) { return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        drawingPathGSAP.pause();
                                        return [4 /*yield*/, this.showTwoLevels(levels)];
                                    case 1:
                                        _a.sent();
                                        return [4 /*yield*/, this.calibrateTwoLevels(calibration)];
                                    case 2:
                                        _a.sent();
                                        drawingPathGSAP.play();
                                        return [2 /*return*/];
                                }
                            });
                        }); };
                        path.steps.forEach(function (step, index) {
                            var dummyStart = __assign({}, _this.dummyStart);
                            var dummyFinish = __assign({}, _this.dummyFinish);
                            var sphereDuration = step.spheres.length / (_this.animatePerSphere * _this.pathSpeed);
                            var lookAt = new Vector3(step.lookAt.x, step.lookAt.y, step.lookAt.z);
                            // SINGLE: Change to starting level
                            if (step.type === "single") {
                                // CHANGE LEVEL
                                drawingPathGSAP.to(dummyStart, {
                                    duration: 0,
                                    onComplete: function () {
                                        if (step.levels.length > 0)
                                            changeLevelHandler(step.levels[0]);
                                    },
                                    x: 1,
                                    y: 1,
                                    z: 1
                                }, "single[".concat(index, "]"));
                                // GSAP CAMERA
                                drawingPathGSAP.to(_this.camera.position, {
                                    duration: 2,
                                    onStart: function () {
                                        _this.camera.lookAt(lookAt);
                                        _this.camera.updateProjectionMatrix();
                                    },
                                    x: step.lookAt.x,
                                    y: step.lookAt.y + _this.pathYDistance2,
                                    z: step.lookAt.z
                                }, "camera-control[".concat(index, "]"));
                                // GSAP CONTROL
                                drawingPathGSAP.to(_this.control.target, {
                                    duration: 2,
                                    onUpdate: function () {
                                        _this.control.update();
                                    },
                                    x: step.lookAt.x,
                                    y: step.lookAt.y,
                                    z: step.lookAt.z
                                }, "camera-control[".concat(index, "]"));
                                // MULTI: Draw Between Gateway
                            }
                            else {
                                // SHOW TWO LEVEL
                                drawingPathGSAP.to(dummyStart, {
                                    duration: 0,
                                    onComplete: function () {
                                        if (step.levels.length > 0)
                                            showTwoLevelsHandler(step.levels, step.calibration);
                                    },
                                    x: 1,
                                    y: 1,
                                    z: 1
                                }, "multi[".concat(index, "]"));
                            }
                            // SPHERE DRAW
                            drawingPathGSAP.to(dummyStart, __assign({ duration: sphereDuration, onStart: function () {
                                    if (step.spheres && step.spheres.length > 0) {
                                        step.spheres.forEach(function (sph, index) {
                                            setTimeout(function () {
                                                sph.visible = true;
                                                newVisiblePath.push(sph);
                                            }, index * (sphereDuration * 1000 / step.spheres.length));
                                        });
                                    }
                                } }, dummyFinish), "sphere[".concat(index, "]"));
                        });
                        drawingPathGSAP.play();
                    })];
            });
        });
    };
    return Animation;
}());
export default Animation;
//# sourceMappingURL=Animation.js.map