import { Vector3 } from 'three';
import { gsap } from 'gsap';
import { newColor } from './Helper';
export default class Animation {
    constructor(camera, control, changeLevel) {
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
    async calibrateCamera(calibration) {
        return new Promise(res => {
            let calibrateCameraGSAP = gsap.timeline({
                paused: true,
                onComplete: () => { res(true); }
            });
            // GSAP CAMERA
            calibrateCameraGSAP.to(this.camera.position, {
                duration: 2,
                onStart: () => {
                    this.camera.lookAt(new Vector3(calibration.target.x, calibration.target.y, calibration.target.z));
                    this.camera.updateProjectionMatrix();
                },
                x: calibration.position.x,
                y: calibration.position.y,
                z: calibration.position.z
            }, `calibrate-camera-control`);
            // GSAP CONTROL
            calibrateCameraGSAP.to(this.control.target, {
                duration: 2,
                onUpdate: () => {
                    this.control.update();
                },
                x: calibration.target.x,
                y: calibration.target.y,
                z: calibration.target.z
            }, `calibrate-camera-control`);
            calibrateCameraGSAP.play();
        });
    }
    showAllLevels() {
        this.hiddenLevel.forEach(level => {
            this.showHideObject3D(level, true);
        });
    }
    hideLevels(levels) {
        const hiddenList = this.hiddenLevel.map(lvl => lvl.userData._id);
        levels.forEach((level) => {
            if (!hiddenList.includes(level.userData._id))
                gsap.to(level.material, {
                    duration: 0.5,
                    onStart: () => {
                        level.visible = true;
                        level.material.transparent = true;
                    },
                    onComplete: () => {
                        this.hiddenLevel.push(level);
                        level.visible = false;
                    },
                    opacity: 0
                });
        });
    }
    showTwoLevels(levels) {
        return new Promise(res => {
            let showTwoLevelsGSAP = gsap.timeline({
                paused: true,
                onComplete: () => { res(true); }
            });
            const hiddenList = this.hiddenLevel.map(lvl => lvl.userData._id);
            levels.forEach((level) => {
                if (hiddenList.includes(level.userData._id))
                    showTwoLevelsGSAP.to(level.material, {
                        duration: 0.5,
                        onStart: () => {
                            level.visible = true;
                        },
                        onComplete: () => {
                            level.material.transparent = false;
                            level.material.needsUpdate = true;
                        },
                        opacity: 1
                    });
            });
            showTwoLevelsGSAP.play();
        });
    }
    calibrateTwoLevels(calibration) {
        return new Promise(res => {
            let calibrateTwoLevelsGSAP = gsap.timeline({
                paused: true,
                onComplete: () => { res(true); }
            });
            calibrateTwoLevelsGSAP.to(this.camera.position, {
                duration: 2,
                onStart: () => {
                    this.camera.lookAt(new Vector3(calibration.target.x, calibration.target.y, calibration.target.z));
                },
                onUpdate: () => { this.camera.updateProjectionMatrix(); this.control.update(); },
                x: calibration.position.x,
                y: calibration.position.y,
                z: calibration.position.z,
            });
            calibrateTwoLevelsGSAP.play();
        });
    }
    showHideObject3D(object, show) {
        if (show) {
            this.hiddenLevel = this.hiddenLevel.filter(lvl => lvl.userData._id !== object.userData._id);
            gsap.to(object.material, {
                duration: 0.5,
                onStart: () => {
                    object.visible = true;
                    // object.material.opacity = 0;
                },
                onComplete: () => {
                    object.material.transparent = false;
                    object.material.needsUpdate = true;
                },
                opacity: 1
            });
        }
        else {
            gsap.to(object.material, {
                duration: 0.5,
                onStart: () => {
                    object.visible = true;
                    object.material.transparent = true;
                },
                onComplete: () => {
                    this.hiddenLevel.push(object);
                    object.visible = false;
                },
                opacity: 0
            });
        }
    }
    addTransparentBuilding(object) {
        object.visible = true;
        object.material.opacity = 1;
        object.material.transparent = true;
        gsap.to(object.material, {
            duration: 1,
            onComplete: () => {
                this.hiddenLevel.push(object);
                object.material.needsUpdate = true;
            },
            opacity: 0.5
        });
    }
    addTransparentParentBuilding(object) {
        object.material.opacity = 1;
        object.material.transparent = true;
        gsap.to(object.material, {
            duration: 1,
            onComplete: () => {
                this.hiddenLevel.push(object);
                object.visible = true;
                object.material.needsUpdate = true;
            },
            opacity: 0.0
        });
    }
    selectShape(object, duration) {
        let center = object.type === 'Group' ? object.userData.position : object.geometry.boundingSphere.center;
        gsap.to(this.camera.position, {
            duration,
            onUpdate: () => {
                this.camera.lookAt(new Vector3(center.x, center.y, center.z));
                this.camera.updateProjectionMatrix();
                this.control.target.copy(center);
                this.control.update();
            },
            x: center.x,
            y: center.y + this.generalYDistance,
            z: center.z + this.generalZDistance,
        });
    }
    scale(object, duration, scale) {
        let scalingGSAP = gsap.timeline();
        scalingGSAP.to(object.scale, duration || 1, { x: scale[0], y: scale[1], z: scale[2] }, 0);
        if (object.children.length > 0) {
            object.children.forEach((c) => {
                if (c.userData.label && c.userData.label.content === "image") {
                    scalingGSAP.to(c.scale, duration || 1, {
                        x: c.userData.label.type === 'billboard' ? c.userData.label.image_scale.x : c.userData.label.image_scale.x * 1.5,
                        y: c.userData.label.type === 'billboard' ? c.userData.label.image_scale.y * 10 / 15 : c.userData.label.image_scale.y * 1.5,
                        z: c.userData.label.type === 'billboard' ? c.userData.label.image_scale.z : c.userData.label.image_scale.z * 1.5
                    }, 0);
                }
            });
        }
    }
    unscale(object, duration, scale) {
        let scalingGSAP = gsap.timeline();
        scalingGSAP.to(object.scale, duration || 1, { x: scale[0], y: scale[1], z: scale[2] }, 0);
        if (object.children.length > 0) {
            object.children.forEach((c) => {
                if (c.userData.label && c.userData.label.content === "image") {
                    scalingGSAP.to(c.scale, duration || 1, {
                        x: c.userData.label.type === 'billboard' ? c.userData.label.image_scale.x : c.userData.label.image_scale.x,
                        y: c.userData.label.type === 'billboard' ? c.userData.label.image_scale.y : c.userData.label.image_scale.y,
                        z: c.userData.label.type === 'billboard' ? c.userData.label.image_scale.z : c.userData.label.image_scale.z
                    }, 0);
                }
            });
        }
    }
    changeColor(object, duration, color) {
        let targetColor = newColor(color || '#2AA5A5');
        if (object.type === 'Group') {
            object.children.forEach((c) => {
                let name = c.name.split('-');
                if (name[0] === 'colorable') {
                    gsap.to(c.material.color, duration || 1, { r: targetColor.r, g: targetColor.g, b: targetColor.b });
                }
            });
        }
        else {
            gsap.to(object.material.color, duration || 1, { r: targetColor.r, g: targetColor.g, b: targetColor.b });
        }
    }
    async showPath(path) {
        this.isAnimating = true;
        return new Promise(resolve => {
            let newVisiblePath = [];
            let drawingPathGSAP = gsap.timeline({
                paused: true,
                onComplete: () => { this.isAnimating = false; resolve(newVisiblePath); }
            });
            const changeLevelHandler = async (level) => {
                drawingPathGSAP.pause();
                await this.changeLevel(level.userData, false);
                drawingPathGSAP.play();
            };
            const showTwoLevelsHandler = async (levels, calibration) => {
                drawingPathGSAP.pause();
                await this.showTwoLevels(levels);
                await this.calibrateTwoLevels(calibration);
                drawingPathGSAP.play();
            };
            path.steps.forEach((step, index) => {
                const dummyStart = Object.assign({}, this.dummyStart);
                const dummyFinish = Object.assign({}, this.dummyFinish);
                const sphereDuration = step.spheres.length / (this.animatePerSphere * this.pathSpeed);
                const lookAt = new Vector3(step.lookAt.x, step.lookAt.y, step.lookAt.z);
                // SINGLE: Change to starting level
                if (step.type === "single") {
                    // CHANGE LEVEL
                    drawingPathGSAP.to(dummyStart, {
                        duration: 0,
                        onComplete: () => {
                            if (step.levels.length > 0)
                                changeLevelHandler(step.levels[0]);
                        },
                        x: 1,
                        y: 1,
                        z: 1
                    }, `single[${index}]`);
                    // GSAP CAMERA
                    drawingPathGSAP.to(this.camera.position, {
                        duration: 2,
                        onStart: () => {
                            this.camera.lookAt(lookAt);
                            this.camera.updateProjectionMatrix();
                        },
                        x: step.lookAt.x,
                        y: step.lookAt.y + this.pathYDistance2,
                        z: step.lookAt.z
                    }, `camera-control[${index}]`);
                    // GSAP CONTROL
                    drawingPathGSAP.to(this.control.target, {
                        duration: 2,
                        onUpdate: () => {
                            this.control.update();
                        },
                        x: step.lookAt.x,
                        y: step.lookAt.y,
                        z: step.lookAt.z
                    }, `camera-control[${index}]`);
                    // MULTI: Draw Between Gateway
                }
                else {
                    // SHOW TWO LEVEL
                    drawingPathGSAP.to(dummyStart, {
                        duration: 0,
                        onComplete: () => {
                            if (step.levels.length > 0)
                                showTwoLevelsHandler(step.levels, step.calibration);
                        },
                        x: 1,
                        y: 1,
                        z: 1
                    }, `multi[${index}]`);
                }
                // SPHERE DRAW
                drawingPathGSAP.to(dummyStart, Object.assign({ duration: sphereDuration, onStart: () => {
                        if (step.spheres && step.spheres.length > 0) {
                            step.spheres.forEach((sph, index) => {
                                setTimeout(() => {
                                    sph.visible = true;
                                    newVisiblePath.push(sph);
                                }, index * (sphereDuration * 1000 / step.spheres.length));
                            });
                        }
                    } }, dummyFinish), `sphere[${index}]`);
            });
            drawingPathGSAP.play();
        });
    }
}
