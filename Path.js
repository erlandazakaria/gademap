import { SphereBufferGeometry, MeshBasicMaterial, Mesh } from 'three';
import _ from 'lodash';
import { newColor, generateZShape, getYDistanceDiff } from './Helper';
export default class GadePath {
    constructor(data, scene, objects, animation) {
        this.drawingEdgeSpheres = () => {
            this.pathEdges = this.objects.data.pathEdges.map(edge => {
                let from = edge.from
                    ? this.objects.data.pathVertices.find(vertice => vertice._id === edge.from)
                    : {
                        gateway: null,
                        gateway_type: null,
                        place: null,
                        position: this.pinPosition,
                        shape: null,
                        type: "userpoint",
                        _id: edge._id
                    };
                let to = this.objects.data.pathVertices.find(vertice => vertice._id === edge.to);
                if (!from || !to) {
                    return null;
                }
                // CALCULATE SPHERES
                let spheres = [];
                let affect = null;
                let isPositive = false;
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
                    for (let i = from.position.x; isPositive ? i <= to.position.x : i >= to.position.x; isPositive ? i = i + this.gap : i = i - this.gap) {
                        spheres.push(Object.assign(Object.assign({}, from.position), { x: i }));
                    }
                }
                else if (from.position && to.position && affect === "y") {
                    for (let i = from.position.y; isPositive ? i <= to.position.y : i >= to.position.y; isPositive ? i = i + this.gap : i = i - this.gap) {
                        spheres.push(Object.assign(Object.assign({}, from.position), { y: i }));
                    }
                }
                else if (from.position && to.position && affect === "z") {
                    for (let i = from.position.z; isPositive ? i <= to.position.z : i >= to.position.z; isPositive ? i = i + this.gap : i = i - this.gap) {
                        spheres.push(Object.assign(Object.assign({}, from.position), { z: i }));
                    }
                }
                if (!edge.from) {
                    this.pinEdge = { _id: edge._id, from: from !== null && from !== void 0 ? from : null, to: to !== null && to !== void 0 ? to : null, length: edge.length, spheres: this.drawSpheres(spheres) };
                    this.pinVertice = { gateway: null, gateway_type: null, place: null, position: this.pinPosition, shape: null, type: "userpoint", _id: edge._id };
                }
                return !edge.from ? this.pinEdge : {
                    _id: edge._id,
                    from,
                    to,
                    length: edge.length,
                    spheres: this.drawSpheres(spheres)
                };
            });
        };
        this.drawSpheres = (spheres) => {
            return spheres.map(sphere => {
                let sphereGeometry = new SphereBufferGeometry(0.25, 32, 32);
                let sphereMaterial = new MeshBasicMaterial({ color: newColor(this.pathColor) });
                let sphereMesh = new Mesh(sphereGeometry, sphereMaterial);
                sphereMesh.position.set(sphere.x, sphere.y, sphere.z);
                sphereMesh.name = 'drawedPath';
                sphereMesh.visible = false;
                sphereMesh.layers.enableAll();
                this.scene.add(sphereMesh);
                return sphereMesh;
            });
        };
        this.findPath = (to, from) => {
            if (!to)
                return;
            let pathFound = [];
            // IF CUSTOM DEPARTURE NOT YET
            const fromVertice = from
                ? this.objects.data.pathVertices.find(vertice => vertice.place === from)
                : this.pinVertice;
            const destVertice = this.objects.data.pathVertices.find(vertice => vertice.place && vertice.place === to);
            const destEdge = this.pathEdges.filter(edge => destVertice && edge.to._id === destVertice._id);
            if (!fromVertice)
                return;
            destEdge.forEach((de) => {
                const findNextEdge = (path, edges) => {
                    let unVisitedEdges = edges.filter(edge => edge._id !== path[path.length - 1]._id);
                    const last = path[path.length - 1].from;
                    if (fromVertice && last !== null && last !== undefined && typeof last !== "string" && last._id === fromVertice._id) {
                        pathFound.push(path);
                        return;
                    }
                    const nextEdge = unVisitedEdges.filter(edge => edge.to === path[path.length - 1].from
                        || edge.from === path[path.length - 1].from);
                    if (nextEdge.length > 0) {
                        nextEdge.forEach(edge => {
                            if (path[path.length - 1].from === edge.from || path[path.length - 1].to === edge.to) {
                                let tempSphere = edge.spheres ? [...edge.spheres] : [];
                                findNextEdge([...path, Object.assign(Object.assign({}, edge), { to: edge.from, from: edge.to, spheres: _.reverse(tempSphere) })], unVisitedEdges);
                            }
                            else {
                                findNextEdge([...path, edge], unVisitedEdges);
                            }
                        });
                    }
                };
                findNextEdge([de], this.pathEdges);
            });
            // FIND BEST ROUTE
            const bestRoute = _.reverse(pathFound.reduce((accumulator, current) => {
                if (!accumulator)
                    return current;
                let accLength = accumulator.reduce((acc, curr) => curr.length + acc, 0);
                let currLength = current.reduce((acc, curr) => curr.length + acc, 0);
                return accLength > currLength ? current : accumulator;
            }, null));
            // GENERATE STEPS
            return this.generateSteps(bestRoute);
        };
        this.generateSteps = (paths) => {
            let calculatedSteps = [];
            if (!paths)
                return null;
            paths.forEach((path, index) => {
                // STEP EVEN: CHANGE FLOOR DAN DRAW
                if (index === 0) {
                    if (path.from !== null && path.from !== undefined && typeof path.from !== "string" && path.from.type === "userpoint") {
                        const calibration = this.data.calibrations.find(clb => this.pinLevel && typeof clb.level !== "string" && clb.level._id === this.pinLevel.userData._id);
                        calculatedSteps.push({
                            type: "single",
                            levels: this.pinLevel ? [this.pinLevel] : [],
                            calibration,
                            // position: usercalibration ? usercalibration.position : {...path.from.position, y: path.from.position + 10},
                        });
                    }
                    else {
                        const shape = this.data.shapes.find(shape => path.from && path.from !== null && path.from !== undefined && typeof path.from !== "string"
                            && shape._id === path.from.shape);
                        let level = this.objects.rendered.grounds.find(o => shape && o.userData._id === shape.parent);
                        const calibration = this.data.calibrations.find(clb => level && clb && typeof clb.level !== "string" && clb.level._id === level.userData._id);
                        calculatedSteps.push({
                            type: "single",
                            levels: [level],
                            calibration,
                            // position: {...path.from.position, y: path.from.position + 10}
                        });
                    }
                }
                if (path.from && typeof path.from !== "string" && path.from.type === "gateway") {
                    if (path.to && typeof path.to !== "string" && path.to.type === "gateway") {
                        calculatedSteps[calculatedSteps.length - 1].lookAt = path.from.position;
                        let fromLevel = this.objects.rendered.grounds.find(lvl => path.from && typeof path.from !== "string" && lvl.userData._id === path.from.gateway);
                        let toLevel = this.objects.rendered.grounds.find(lvl => path.to && typeof path.to !== "string" && lvl.userData._id === path.to.gateway);
                        const multiCalibration = {
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
                        let level = this.objects.rendered.grounds.find(lvl => path.from && typeof path.from !== "string" && lvl.userData._id === path.from.gateway);
                        const calibration = this.data.calibrations.find(clb => level && typeof clb.level !== "string" && clb.level._id === level.userData._id);
                        calculatedSteps.push({
                            type: "single",
                            levels: [level],
                            calibration,
                        });
                    }
                }
                // LAST STEP: LOOK AT DESTINATION
                if (path && path.to && typeof path.to !== "string" && path.to.type === "destination") {
                    calculatedSteps[calculatedSteps.length - 1].lookAt = path.to.position;
                }
                // ADD SPHERES
                let spheres = [];
                if (path && path.spheres) {
                    spheres = calculatedSteps[calculatedSteps.length - 1].spheres
                        ? [...calculatedSteps[calculatedSteps.length - 1].spheres, ...path.spheres]
                        : [...path.spheres];
                }
                calculatedSteps[calculatedSteps.length - 1].spheres = spheres;
            });
            let newPaths = [...paths];
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
    init() {
        return new Promise((res) => {
            try {
                // SET PIN
                if (this.data && this.data.pin && this.data.pin.level) {
                    this.pinLevel = this.objects.rendered.grounds.find(o => o.userData._id === this.data.pin.level);
                }
                this.pinPosition = this.data.pin
                    ? Object.assign(Object.assign({}, this.data.pin.position), { y: this.pinLevel
                            ? this.pinLevel.userData.position.y + this.pinLevel.userData.height
                            : this.data.pin.position.y }) : { x: 0, y: 0, z: 0 };
                // USER
                this.drawingEdgeSpheres();
                // CALCULATE ALL DESTINATION PLACE
                this.calculatedPath = this.objects.data.pathVertices
                    .filter(vertice => vertice.type === 'destination')
                    .map(vertice => vertice.place && this.findPath(vertice.place))
                    .filter(path => path);
                res('done');
            }
            catch (err) {
                console.error('Path Init Error');
                console.log(err);
            }
        });
    }
}
