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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
import { TextureLoader, CanvasTexture, SpriteMaterial, Sprite, MeshBasicMaterial, PlaneBufferGeometry, Mesh, Vector3, DoubleSide } from 'three';
var PIXEL_RATIO = (function () {
    var ctx = document.createElement('canvas').getContext('2d');
    var dpr = window.devicePixelRatio || 1;
    var bsr = ctx.webkitBackingStorePixelRatio ||
        ctx.mozBackingStorePixelRatio ||
        ctx.msBackingStorePixelRatio ||
        ctx.oBackingStorePixelRatio ||
        ctx.backingStorePixelRatio || 1;
    return dpr / bsr;
})();
var Label = /** @class */ (function () {
    function Label(ref) {
        this.defaultFreeLabel = {
            id: 0,
            // map: '',
            is_show: true,
            rotation: 0,
            type: 'static',
            content: 'text',
            text: 'Label',
            image: null,
            image_scale: { x: 0, y: 0, z: 0 },
            billboard_spacing: 0,
            font_size: 32,
            padding_left: 5,
            padding_top: 5,
            letter_spacing: 3,
            font_weight: '400',
            font_family: 'Arial',
            font_color: '#000000',
            font_border_width: 8,
            font_border_color: null,
            background_color: null,
            border_width: 5,
            border_color: null,
            position: { x: 0, y: 0, z: 0 },
            shape: { id: 0, type: 'ground' }
        };
        this.ref = ref;
        this.objects = null;
        this.imgLoader = new TextureLoader();
    }
    Label.prototype.init = function (objects) {
        var _this = this;
        return new Promise(function (res) {
            try {
                _this.objects = objects;
                res('done');
            }
            catch (err) {
                console.warn('Label Init Error');
                console.log(err);
            }
        });
    };
    Label.prototype.loadImage = function (src) {
        return new Promise(function (resolve, reject) {
            var img = new Image();
            img.onload = function () { return resolve({ height: img.height, width: img.width }); };
            img.onerror = reject;
            img.src = src;
        });
    };
    Label.prototype.createLabel = function (mesh, place, height, center) {
        return __awaiter(this, void 0, void 0, function () {
            var scaling, oneCoor, extrudeCenter, rotation, billboard_spacing, yPos, image_scale, labelObject, image, texture, widthInCoordinate, heightInCoordinate, labelMaterial, labelMaterial, labelGeometry, multiLine, paddingLeft, paddingTop_1, fontSize_1, fontWeight, fontFamily, fontColor_1, fontBorderWidth_1, fontBorderColor_1, letterSpacing, backgroundColor, borderWidth_1, borderColor_1, tempCanvas, tempContext_1, textWidth, measureAll_1, canvasWidth_1, canvasHeight, lineLength, canvas, ctx_1, widthInCoordinate, heightInCoordinate, texture, labelMaterial, labelMaterial, labelGeometry;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        scaling = 4;
                        oneCoor = 150;
                        extrudeCenter = !center
                            ? { x: 0, y: height, z: 0 }
                            : {
                                x: mesh.geometry && mesh.geometry.boundingSphere ? mesh.geometry.boundingSphere.center.x : 0,
                                y: height,
                                z: mesh.geometry && mesh.geometry.boundingSphere ? mesh.geometry.boundingSphere.center.z : 0
                            };
                        rotation = place.rotation || 0;
                        billboard_spacing = place.billboard_spacing || 0;
                        yPos = !center ? 0 : mesh.position.y;
                        image_scale = {
                            x: place.image_scale.x || 1,
                            y: place.image_scale.y || 1,
                            z: place.image_scale.z || 1
                        };
                        labelObject = null;
                        if (!(place.content === 'image')) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.loadImage(place.image)];
                    case 1:
                        image = _a.sent();
                        texture = this.imgLoader.load(place.image);
                        texture.anisotropy = 20;
                        widthInCoordinate = image.width / oneCoor < 1 ? 1 : image.width / oneCoor;
                        heightInCoordinate = image.height / oneCoor < 1 ? 1 : image.height / oneCoor;
                        // IF BILLBOARD
                        if (place.type === 'billboard') {
                            labelMaterial = new SpriteMaterial({ map: texture });
                            labelObject = new Sprite(labelMaterial);
                            labelObject.position.set(extrudeCenter.x, yPos + height + billboard_spacing, extrudeCenter.z);
                            labelObject.geometry.computeBoundingSphere();
                            // labelObject.scale.set(image_scale.x*widthInCoordinate, image_scale.y*heightInCoordinate, image_scale.z);
                            labelObject.scale.set(image_scale.x, image_scale.y, image_scale.z);
                            labelObject.userData = place;
                            labelObject.layers = mesh.layers;
                            labelObject.castShadow = true;
                            labelObject.receiveShadow = true;
                            mesh.add(labelObject);
                        }
                        else {
                            labelMaterial = new MeshBasicMaterial({ transparent: true, map: texture, side: DoubleSide });
                            labelGeometry = new PlaneBufferGeometry(widthInCoordinate, heightInCoordinate);
                            labelObject = new Mesh(labelGeometry, labelMaterial);
                            labelObject.lookAt(new Vector3(0, 1000, 0));
                            labelObject.rotateZ(-rotation * (Math.PI / 180));
                            labelObject.position.set(extrudeCenter.x, extrudeCenter.y + 0.01, extrudeCenter.z);
                            labelObject.scale.set(image_scale.x, image_scale.y, image_scale.z);
                            labelObject.userData = place;
                            labelObject.layers = mesh.layers;
                            labelObject.receiveShadow = true;
                            mesh.add(labelObject);
                        }
                        return [3 /*break*/, 3];
                    case 2:
                        multiLine = place.text.split('\\n').length > 1 ? true : false;
                        paddingLeft = place.padding_left * scaling || 5;
                        paddingTop_1 = place.padding_top * scaling || 5;
                        fontSize_1 = place.font_size * scaling || 32;
                        fontWeight = place.font_weight || '400';
                        fontFamily = place.font_family || 'Arial';
                        fontColor_1 = place.font_color || '#000000';
                        fontBorderWidth_1 = place.font_border_width * scaling || 8;
                        fontBorderColor_1 = place.font_border_color || 'none';
                        letterSpacing = place.letter_spacing * scaling || 3;
                        backgroundColor = place.background_color || 'none';
                        borderWidth_1 = place.border_width * scaling || 5;
                        borderColor_1 = place.border_color || 'none';
                        tempCanvas = document.createElement('canvas');
                        this.ref.current.append(tempCanvas);
                        tempContext_1 = tempCanvas.getContext('2d', { antialias: false });
                        tempCanvas.style.letterSpacing = "".concat(letterSpacing, "px");
                        tempContext_1.font = "".concat(fontWeight, " ").concat(fontSize_1, "px ").concat(fontFamily);
                        textWidth = void 0;
                        if (multiLine) {
                            measureAll_1 = [];
                            place.text.split('\\n').forEach(function (n) {
                                measureAll_1.push(tempContext_1.measureText(n).width);
                            });
                            textWidth = measureAll_1.reduce(function (total, num) { return total > num ? total : num; });
                        }
                        else {
                            textWidth = tempContext_1.measureText(place.text).width;
                        }
                        tempCanvas.remove();
                        canvasWidth_1 = textWidth + (paddingLeft * 2) + (borderColor_1 !== 'none' ? borderWidth_1 * 2 : 0);
                        canvasHeight = void 0;
                        if (multiLine) {
                            lineLength = place.text.split('\\n').length;
                            canvasHeight = (lineLength * fontSize_1) + (paddingTop_1 * 2) + ((lineLength - 1) * paddingTop_1) + (borderColor_1 !== 'none' ? borderWidth_1 * 2 : 0);
                            // height font times how many lines, padding top and bottom, padding between line, border top and bottom
                        }
                        else {
                            canvasHeight = fontSize_1 + (paddingTop_1 * 2) + (borderColor_1 !== 'none' ? borderWidth_1 * 2 : 0);
                        }
                        canvas = this.createRetinaCanvas(canvasWidth_1, canvasHeight, letterSpacing);
                        ctx_1 = canvas.getContext('2d', { antialias: false });
                        ctx_1.font = "".concat(fontWeight, " ").concat(fontSize_1, "px ").concat(fontFamily);
                        ctx_1 = canvas.getContext('2d', { antialias: false });
                        ctx_1.textBaseline = "top";
                        ctx_1.beginPath();
                        // BACKGROUND
                        if (backgroundColor !== 'none') {
                            ctx_1.globalCompositeOperation = "source-over";
                            ctx_1.rect(0, 0, canvasWidth_1, canvasHeight);
                            ctx_1.fillStyle = backgroundColor;
                            ctx_1.fill();
                        }
                        // FONT STROKE
                        if (fontBorderColor_1 !== 'none') {
                            if (multiLine) {
                                place.text.split('\\n').forEach(function (n, ni) {
                                    ctx_1.globalCompositeOperation = "source-over";
                                    ctx_1.strokeStyle = fontBorderColor_1;
                                    ctx_1.lineWidth = fontBorderWidth_1;
                                    ctx_1.miterLimit = 2;
                                    ctx_1.strokeText(n, (canvasWidth_1 - ctx_1.measureText(n).width) / 2, ((ni + 1) * paddingTop_1) + (borderColor_1 !== 'none' ? borderWidth_1 : 0) + (ni * fontSize_1));
                                });
                            }
                            else {
                                ctx_1.globalCompositeOperation = "source-over";
                                ctx_1.strokeStyle = fontBorderColor_1;
                                ctx_1.lineWidth = fontBorderWidth_1;
                                ctx_1.miterLimit = 2;
                                ctx_1.strokeText(place.name, (canvasWidth_1 - ctx_1.measureText(place.name).width) / 2, paddingTop_1 + (borderColor_1 !== 'none' ? (borderWidth_1 / 2) + borderWidth_1 : 0));
                            }
                        }
                        // FONT
                        if (multiLine) {
                            place.text.split('\\n').forEach(function (n, ni) {
                                ctx_1.globalCompositeOperation = "source-over";
                                ctx_1.fillStyle = fontColor_1;
                                ctx_1.fillText(n, (canvasWidth_1 - ctx_1.measureText(n).width) / 2, ((ni + 1) * paddingTop_1) + (borderColor_1 !== 'none' ? +borderWidth_1 : 0) + (ni * fontSize_1));
                            });
                        }
                        else {
                            ctx_1.globalCompositeOperation = "source-over";
                            ctx_1.fillStyle = fontColor_1;
                            ctx_1.fillText(place.text, (canvasWidth_1 - ctx_1.measureText(place.text).width) / 2, paddingTop_1 + (borderColor_1 !== 'none' ? (borderWidth_1 / 2) + borderWidth_1 : 0));
                        }
                        // BORDER
                        if (borderColor_1 !== 'none') {
                            ctx_1.globalCompositeOperation = "source-over";
                            ctx_1.lineWidth = borderWidth_1;
                            ctx_1.strokeStyle = borderColor_1;
                            ctx_1.strokeRect(0, 0, canvasWidth_1, canvasHeight);
                        }
                        widthInCoordinate = canvasWidth_1 / oneCoor < 1 ? 1 : canvasWidth_1 / oneCoor;
                        heightInCoordinate = canvasHeight / oneCoor < 1 ? 1 : canvasHeight / oneCoor;
                        texture = new CanvasTexture(canvas);
                        texture.anisotropy = 20;
                        // IF BILLBOARD
                        if (place.type === 'billboard') {
                            labelMaterial = new SpriteMaterial({ map: texture });
                            labelObject = new Sprite(labelMaterial);
                            labelObject.position.set(extrudeCenter.x, mesh.position.y + height + billboard_spacing, extrudeCenter.z);
                            labelObject.scale.set(widthInCoordinate, heightInCoordinate, widthInCoordinate);
                            labelObject.userData = place;
                            labelObject.layers = mesh.layers;
                            labelObject.castShadow = true;
                            labelObject.receiveShadow = true;
                            mesh.add(labelObject);
                        }
                        else {
                            labelMaterial = new MeshBasicMaterial({ transparent: true, map: texture, side: DoubleSide });
                            labelGeometry = new PlaneBufferGeometry(widthInCoordinate, heightInCoordinate);
                            labelObject = new Mesh(labelGeometry, labelMaterial);
                            labelObject.lookAt(new Vector3(0, 1000, 0));
                            labelObject.rotateZ(-rotation * (Math.PI / 180));
                            labelObject.position.set(extrudeCenter.x, extrudeCenter.y + 0.01, extrudeCenter.z);
                            labelObject.userData = place;
                            labelObject.layers = mesh.layers;
                            labelObject.receiveShadow = true;
                            mesh.add(labelObject);
                        }
                        canvas.remove();
                        _a.label = 3;
                    case 3:
                        // SAVE
                        this.objects.rendered.labels = __spreadArray(__spreadArray([], this.objects.rendered.labels, true), [labelObject], false);
                        return [2 /*return*/];
                }
            });
        });
    };
    Label.prototype.createFreeLabel = function (label) {
        return __awaiter(this, void 0, void 0, function () {
            var scaling, oneCoor, rotation, billboard_spacing, image_scale, labelObject, mesh, image, texture, widthInCoordinate, heightInCoordinate, labelMaterial, labelMaterial, labelGeometry, multiLine, paddingLeft, paddingTop_2, fontSize_2, fontWeight, fontFamily, fontColor_2, fontBorderWidth_2, fontBorderColor_2, letterSpacing, backgroundColor, borderWidth_2, borderColor_2, tempCanvas, tempContext_2, textWidth, measureAll_2, canvasWidth_2, canvasHeight, lineLength, canvas, ctx_2, widthInCoordinate, heightInCoordinate, texture, labelMaterial, labelMaterial, labelGeometry;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        scaling = 4;
                        oneCoor = 150;
                        rotation = label.rotation || 0;
                        billboard_spacing = label.billboard_spacing || 1;
                        image_scale = {
                            x: label.image_scale.x || 1,
                            y: label.image_scale.y || 1,
                            z: label.image_scale.z || 1
                        };
                        labelObject = null;
                        mesh = this.objects.rendered.grounds.find(function (s) { return s.userData._id === label.ground; });
                        if (!(label.content === 'image')) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.loadImage(label.image)];
                    case 1:
                        image = _a.sent();
                        texture = this.imgLoader.load(label.image);
                        texture.anisotropy = 20;
                        widthInCoordinate = image.width / oneCoor < 1 ? 1 : image.width / oneCoor;
                        heightInCoordinate = image.height / oneCoor < 1 ? 1 : image.height / oneCoor;
                        // IF BILLBOARD
                        if (label.type === 'billboard') {
                            labelMaterial = new SpriteMaterial({ map: texture });
                            labelObject = new Sprite(labelMaterial);
                            labelObject.position.set(label.position.x, label.position.y + billboard_spacing, label.position.z);
                            labelObject.scale.set(image_scale.x * widthInCoordinate, image_scale.y * heightInCoordinate, image_scale.z);
                            labelObject.userData = label;
                            labelObject.layers = mesh.layers;
                            labelObject.castShadow = true;
                            labelObject.receiveShadow = true;
                            mesh.add(labelObject);
                        }
                        else {
                            labelMaterial = new MeshBasicMaterial({ transparent: true, map: texture, side: DoubleSide });
                            labelGeometry = new PlaneBufferGeometry(widthInCoordinate, heightInCoordinate);
                            labelObject = new Mesh(labelGeometry, labelMaterial);
                            labelObject.lookAt(new Vector3(0, 1000, 0));
                            labelObject.rotateZ(-rotation * (Math.PI / 180));
                            labelObject.position.set(label.position.x, label.position.y + 0.01, label.position.z);
                            labelObject.scale.set(image_scale.x, image_scale.y, image_scale.z);
                            labelObject.userData = label;
                            labelObject.layers = mesh.layers;
                            labelObject.receiveShadow = true;
                            mesh.add(labelObject);
                        }
                        return [3 /*break*/, 3];
                    case 2:
                        multiLine = label.text.split('\\n').length > 1 ? true : false;
                        paddingLeft = label.padding_left * scaling || 5;
                        paddingTop_2 = label.padding_top * scaling || 5;
                        fontSize_2 = label.font_size * scaling || 32;
                        fontWeight = label.font_weight || '400';
                        fontFamily = label.font_family || 'Arial';
                        fontColor_2 = label.font_color || '#000000';
                        fontBorderWidth_2 = label.font_border_width * scaling || 8;
                        fontBorderColor_2 = label.font_border_color || 'none';
                        letterSpacing = label.letter_spacing * scaling || 3;
                        backgroundColor = label.background_color || 'none';
                        borderWidth_2 = label.border_width * scaling || 5;
                        borderColor_2 = label.border_color || 'none';
                        tempCanvas = document.createElement('canvas');
                        this.ref.current.append(tempCanvas);
                        tempContext_2 = tempCanvas.getContext('2d', { antialias: false });
                        tempCanvas.style.letterSpacing = "".concat(letterSpacing, "px");
                        tempContext_2.font = "".concat(fontWeight, " ").concat(fontSize_2, "px ").concat(fontFamily);
                        textWidth = void 0;
                        if (multiLine) {
                            measureAll_2 = [];
                            label.text.split('\\n').forEach(function (n) {
                                measureAll_2.push(tempContext_2.measureText(n).width);
                            });
                            textWidth = measureAll_2.reduce(function (total, num) { return total > num ? total : num; });
                        }
                        else {
                            textWidth = tempContext_2.measureText(label.text).width;
                        }
                        tempCanvas.remove();
                        canvasWidth_2 = textWidth + (paddingLeft * 2) + (borderColor_2 !== 'none' ? borderWidth_2 * 2 : 0);
                        canvasHeight = void 0;
                        if (multiLine) {
                            lineLength = label.text.split('\\n').length;
                            canvasHeight = (lineLength * fontSize_2) + (paddingTop_2 * 2) + ((lineLength - 1) * paddingTop_2) + (borderColor_2 !== 'none' ? borderWidth_2 * 2 : 0);
                            // height font times how many lines, padding top and bottom, padding between line, border top and bottom
                        }
                        else {
                            canvasHeight = fontSize_2 + (paddingTop_2 * 2) + (borderColor_2 !== 'none' ? borderWidth_2 * 2 : 0);
                        }
                        canvas = this.createRetinaCanvas(canvasWidth_2, canvasHeight, letterSpacing);
                        ctx_2 = canvas.getContext('2d', { antialias: false });
                        ctx_2.font = "".concat(fontWeight, " ").concat(fontSize_2, "px ").concat(fontFamily);
                        ctx_2 = canvas.getContext('2d', { antialias: false });
                        ctx_2.textBaseline = "top";
                        ctx_2.beginPath();
                        // BACKGROUND
                        if (backgroundColor !== 'none') {
                            ctx_2.globalCompositeOperation = "source-over";
                            ctx_2.rect(0, 0, canvasWidth_2, canvasHeight);
                            ctx_2.fillStyle = backgroundColor;
                            ctx_2.fill();
                        }
                        // FONT STROKE
                        if (fontBorderColor_2 !== 'none') {
                            if (multiLine) {
                                label.text.split('\\n').forEach(function (n, ni) {
                                    ctx_2.globalCompositeOperation = "source-over";
                                    ctx_2.strokeStyle = fontBorderColor_2;
                                    ctx_2.lineWidth = fontBorderWidth_2;
                                    ctx_2.miterLimit = 2;
                                    ctx_2.strokeText(n, (canvasWidth_2 - ctx_2.measureText(n).width) / 2, ((ni + 1) * paddingTop_2) + (borderColor_2 !== 'none' ? borderWidth_2 : 0) + (ni * fontSize_2));
                                });
                            }
                            else {
                                ctx_2.globalCompositeOperation = "source-over";
                                ctx_2.strokeStyle = fontBorderColor_2;
                                ctx_2.lineWidth = fontBorderWidth_2;
                                ctx_2.miterLimit = 2;
                                ctx_2.strokeText(label.text, (canvasWidth_2 - ctx_2.measureText(label.text).width) / 2, paddingTop_2 + (borderColor_2 !== 'none' ? (borderWidth_2 / 2) + borderWidth_2 : 0));
                            }
                        }
                        // FONT
                        if (multiLine) {
                            label.text.split('\\n').forEach(function (n, ni) {
                                ctx_2.globalCompositeOperation = "source-over";
                                ctx_2.fillStyle = fontColor_2;
                                ctx_2.fillText(n, (canvasWidth_2 - ctx_2.measureText(n).width) / 2, ((ni + 1) * paddingTop_2) + (borderColor_2 !== 'none' ? +borderWidth_2 : 0) + (ni * fontSize_2));
                            });
                        }
                        else {
                            ctx_2.globalCompositeOperation = "source-over";
                            ctx_2.fillStyle = fontColor_2;
                            ctx_2.fillText(label.text, (canvasWidth_2 - ctx_2.measureText(label.text).width) / 2, paddingTop_2 + (borderColor_2 !== 'none' ? (borderWidth_2 / 2) + borderWidth_2 : 0));
                        }
                        // BORDER
                        if (borderColor_2 !== 'none') {
                            ctx_2.globalCompositeOperation = "source-over";
                            ctx_2.lineWidth = borderWidth_2;
                            ctx_2.strokeStyle = borderColor_2;
                            ctx_2.strokeRect(0, 0, canvasWidth_2, canvasHeight);
                        }
                        widthInCoordinate = canvasWidth_2 / oneCoor < 1 ? 1 : canvasWidth_2 / oneCoor;
                        heightInCoordinate = canvasHeight / oneCoor < 1 ? 1 : canvasHeight / oneCoor;
                        texture = new CanvasTexture(canvas);
                        texture.anisotropy = 20;
                        // IF BILLBOARD
                        if (label.type === 'billboard') {
                            labelMaterial = new SpriteMaterial({ map: texture });
                            labelObject = new Sprite(labelMaterial);
                            labelObject.position.set(label.position.x, label.position.y + billboard_spacing, label.position.z);
                            labelObject.scale.set(widthInCoordinate, heightInCoordinate, widthInCoordinate);
                            labelObject.userData = label;
                            labelObject.layers = mesh.layers;
                            labelObject.castShadow = true;
                            labelObject.receiveShadow = true;
                            mesh.add(labelObject);
                        }
                        else {
                            labelMaterial = new MeshBasicMaterial({ transparent: true, map: texture });
                            labelGeometry = new PlaneBufferGeometry(widthInCoordinate, heightInCoordinate);
                            labelObject = new Mesh(labelGeometry, labelMaterial);
                            labelObject.lookAt(new Vector3(0, 1000, 0));
                            labelObject.position.set(label.position.x, label.position.y + 0.01, label.position.z);
                            labelObject.rotateZ(-rotation * (Math.PI / 180));
                            labelObject.userData = label;
                            labelObject.layers = mesh.layers;
                            labelObject.receiveShadow = true;
                            mesh.add(labelObject);
                        }
                        canvas.remove();
                        _a.label = 3;
                    case 3:
                        // SAVE
                        this.objects.rendered.labels = __spreadArray(__spreadArray([], this.objects.rendered.labels, true), [labelObject], false);
                        this.objects.data.labels = __spreadArray(__spreadArray([], this.objects.data.labels, true), [label], false);
                        return [2 /*return*/];
                }
            });
        });
    };
    Label.prototype.createRetinaCanvas = function (w, h, letterSpacing, ratio) {
        if (!ratio) {
            ratio = PIXEL_RATIO;
        }
        var can = document.createElement('canvas');
        this.ref.current.append(can);
        can.className = 'gm-label-canvas';
        can.width = w * ratio;
        can.height = h * ratio;
        can.style.overflow = 'hidden';
        can.style.position = 'absolute';
        can.style.width = w + 'px';
        can.style.height = h + 'px';
        can.style.top = '0';
        can.style.zIndex = '-1';
        can.style.letterSpacing = "".concat(letterSpacing, "px");
        can.style.textAlign = "center";
        can.getContext('2d').setTransform(ratio, 0, 0, ratio, 0, 0);
        return can;
    };
    return Label;
}());
export default Label;
