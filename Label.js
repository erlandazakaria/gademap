import { TextureLoader, CanvasTexture, SpriteMaterial, Sprite, MeshBasicMaterial, PlaneBufferGeometry, Mesh, Vector3, DoubleSide } from 'three';
const PIXEL_RATIO = (function () {
    const ctx = document.createElement('canvas').getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    const bsr = ctx.webkitBackingStorePixelRatio ||
        ctx.mozBackingStorePixelRatio ||
        ctx.msBackingStorePixelRatio ||
        ctx.oBackingStorePixelRatio ||
        ctx.backingStorePixelRatio || 1;
    return dpr / bsr;
})();
export default class Label {
    constructor(ref) {
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
    init(objects) {
        return new Promise((res) => {
            try {
                this.objects = objects;
                res('done');
            }
            catch (err) {
                console.warn('Label Init Error');
                console.log(err);
            }
        });
    }
    loadImage(src) {
        return new Promise((resolve, reject) => {
            let img = new Image();
            img.onload = () => resolve({ height: img.height, width: img.width });
            img.onerror = reject;
            img.src = src;
        });
    }
    async createLabel(mesh, place, height, center) {
        // SCALE
        let scaling = 4;
        let oneCoor = 150;
        let extrudeCenter = !center
            ? { x: 0, y: height, z: 0 }
            : {
                x: mesh.geometry && mesh.geometry.boundingSphere ? mesh.geometry.boundingSphere.center.x : 0,
                y: height,
                z: mesh.geometry && mesh.geometry.boundingSphere ? mesh.geometry.boundingSphere.center.z : 0
            };
        let rotation = place.rotation || 0;
        let billboard_spacing = place.billboard_spacing || 0;
        let yPos = !center ? 0 : mesh.position.y;
        let image_scale = {
            x: place.image_scale.x || 1,
            y: place.image_scale.y || 1,
            z: place.image_scale.z || 1
        };
        // CREATE LABEL
        let labelObject = null;
        if (place.content === 'image') {
            let image = await this.loadImage(place.image);
            let texture = this.imgLoader.load(place.image);
            texture.anisotropy = 20;
            let widthInCoordinate = image.width / oneCoor < 1 ? 1 : image.width / oneCoor;
            let heightInCoordinate = image.height / oneCoor < 1 ? 1 : image.height / oneCoor;
            // IF BILLBOARD
            if (place.type === 'billboard') {
                let labelMaterial = new SpriteMaterial({ map: texture });
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
                // Static
                let labelMaterial = new MeshBasicMaterial({ transparent: true, map: texture, side: DoubleSide });
                let labelGeometry = new PlaneBufferGeometry(widthInCoordinate, heightInCoordinate);
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
        }
        else {
            let multiLine = place.text.split('\\n').length > 1 ? true : false;
            let paddingLeft = place.padding_left * scaling || 5;
            let paddingTop = place.padding_top * scaling || 5;
            let fontSize = place.font_size * scaling || 32;
            let fontWeight = place.font_weight || '400';
            let fontFamily = place.font_family || 'Arial';
            let fontColor = place.font_color || '#000000';
            let fontBorderWidth = place.font_border_width * scaling || 8;
            let fontBorderColor = place.font_border_color || 'none';
            let letterSpacing = place.letter_spacing * scaling || 3;
            let backgroundColor = place.background_color || 'none';
            let borderWidth = place.border_width * scaling || 5;
            let borderColor = place.border_color || 'none';
            // FINDING CANVAS WIDTH AND HEIGHT
            let tempCanvas = document.createElement('canvas');
            this.ref.current.append(tempCanvas);
            let tempContext = tempCanvas.getContext('2d', { antialias: false });
            tempCanvas.style.letterSpacing = `${letterSpacing}px`;
            tempContext.font = `${fontWeight} ${fontSize}px ${fontFamily}`;
            let textWidth;
            if (multiLine) {
                let measureAll = [];
                place.text.split('\\n').forEach(n => {
                    measureAll.push(tempContext.measureText(n).width);
                });
                textWidth = measureAll.reduce((total, num) => total > num ? total : num);
            }
            else {
                textWidth = tempContext.measureText(place.text).width;
            }
            tempCanvas.remove();
            let canvasWidth = textWidth + (paddingLeft * 2) + (borderColor !== 'none' ? borderWidth * 2 : 0);
            let canvasHeight;
            if (multiLine) {
                let lineLength = place.text.split('\\n').length;
                canvasHeight = (lineLength * fontSize) + (paddingTop * 2) + ((lineLength - 1) * paddingTop) + (borderColor !== 'none' ? borderWidth * 2 : 0);
                // height font times how many lines, padding top and bottom, padding between line, border top and bottom
            }
            else {
                canvasHeight = fontSize + (paddingTop * 2) + (borderColor !== 'none' ? borderWidth * 2 : 0);
            }
            // Drawing Canvas
            let canvas = this.createRetinaCanvas(canvasWidth, canvasHeight, letterSpacing);
            let ctx = canvas.getContext('2d', { antialias: false });
            ctx.font = `${fontWeight} ${fontSize}px ${fontFamily}`;
            ctx = canvas.getContext('2d', { antialias: false });
            ctx.textBaseline = "top";
            ctx.beginPath();
            // BACKGROUND
            if (backgroundColor !== 'none') {
                ctx.globalCompositeOperation = "source-over";
                ctx.rect(0, 0, canvasWidth, canvasHeight);
                ctx.fillStyle = backgroundColor;
                ctx.fill();
            }
            // FONT STROKE
            if (fontBorderColor !== 'none') {
                if (multiLine) {
                    place.text.split('\\n').forEach((n, ni) => {
                        ctx.globalCompositeOperation = "source-over";
                        ctx.strokeStyle = fontBorderColor;
                        ctx.lineWidth = fontBorderWidth;
                        ctx.miterLimit = 2;
                        ctx.strokeText(n, (canvasWidth - ctx.measureText(n).width) / 2, ((ni + 1) * paddingTop) + (borderColor !== 'none' ? borderWidth : 0) + (ni * fontSize));
                    });
                }
                else {
                    ctx.globalCompositeOperation = "source-over";
                    ctx.strokeStyle = fontBorderColor;
                    ctx.lineWidth = fontBorderWidth;
                    ctx.miterLimit = 2;
                    ctx.strokeText(place.name, (canvasWidth - ctx.measureText(place.name).width) / 2, paddingTop + (borderColor !== 'none' ? (borderWidth / 2) + borderWidth : 0));
                }
            }
            // FONT
            if (multiLine) {
                place.text.split('\\n').forEach((n, ni) => {
                    ctx.globalCompositeOperation = "source-over";
                    ctx.fillStyle = fontColor;
                    ctx.fillText(n, (canvasWidth - ctx.measureText(n).width) / 2, ((ni + 1) * paddingTop) + (borderColor !== 'none' ? +borderWidth : 0) + (ni * fontSize));
                });
            }
            else {
                ctx.globalCompositeOperation = "source-over";
                ctx.fillStyle = fontColor;
                ctx.fillText(place.text, (canvasWidth - ctx.measureText(place.text).width) / 2, paddingTop + (borderColor !== 'none' ? (borderWidth / 2) + borderWidth : 0));
            }
            // BORDER
            if (borderColor !== 'none') {
                ctx.globalCompositeOperation = "source-over";
                ctx.lineWidth = borderWidth;
                ctx.strokeStyle = borderColor;
                ctx.strokeRect(0, 0, canvasWidth, canvasHeight);
            }
            // SET COORDINATE
            let widthInCoordinate = canvasWidth / oneCoor < 1 ? 1 : canvasWidth / oneCoor;
            let heightInCoordinate = canvasHeight / oneCoor < 1 ? 1 : canvasHeight / oneCoor;
            // TEXTURE
            let texture = new CanvasTexture(canvas);
            texture.anisotropy = 20;
            // IF BILLBOARD
            if (place.type === 'billboard') {
                let labelMaterial = new SpriteMaterial({ map: texture });
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
                // Static
                let labelMaterial = new MeshBasicMaterial({ transparent: true, map: texture, side: DoubleSide });
                let labelGeometry = new PlaneBufferGeometry(widthInCoordinate, heightInCoordinate);
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
        }
        // SAVE
        this.objects.rendered.labels = [...this.objects.rendered.labels, labelObject];
    }
    async createFreeLabel(label) {
        // SCALE
        let scaling = 4;
        let oneCoor = 150;
        let rotation = label.rotation || 0;
        let billboard_spacing = label.billboard_spacing || 1;
        let image_scale = {
            x: label.image_scale.x || 1,
            y: label.image_scale.y || 1,
            z: label.image_scale.z || 1
        };
        // CREATE LABEL
        let labelObject = null;
        let mesh = this.objects.rendered.grounds.find((s) => s.userData._id === label.ground);
        if (label.content === 'image') {
            let image = await this.loadImage(label.image);
            let texture = this.imgLoader.load(label.image);
            texture.anisotropy = 20;
            let widthInCoordinate = image.width / oneCoor < 1 ? 1 : image.width / oneCoor;
            let heightInCoordinate = image.height / oneCoor < 1 ? 1 : image.height / oneCoor;
            // IF BILLBOARD
            if (label.type === 'billboard') {
                let labelMaterial = new SpriteMaterial({ map: texture });
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
                // Static
                let labelMaterial = new MeshBasicMaterial({ transparent: true, map: texture, side: DoubleSide });
                let labelGeometry = new PlaneBufferGeometry(widthInCoordinate, heightInCoordinate);
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
        }
        else {
            let multiLine = label.text.split('\\n').length > 1 ? true : false;
            let paddingLeft = label.padding_left * scaling || 5;
            let paddingTop = label.padding_top * scaling || 5;
            let fontSize = label.font_size * scaling || 32;
            let fontWeight = label.font_weight || '400';
            let fontFamily = label.font_family || 'Arial';
            let fontColor = label.font_color || '#000000';
            let fontBorderWidth = label.font_border_width * scaling || 8;
            let fontBorderColor = label.font_border_color || 'none';
            let letterSpacing = label.letter_spacing * scaling || 3;
            let backgroundColor = label.background_color || 'none';
            let borderWidth = label.border_width * scaling || 5;
            let borderColor = label.border_color || 'none';
            // FINDING CANVAS WIDTH AND HEIGHT
            let tempCanvas = document.createElement('canvas');
            this.ref.current.append(tempCanvas);
            let tempContext = tempCanvas.getContext('2d', { antialias: false });
            tempCanvas.style.letterSpacing = `${letterSpacing}px`;
            tempContext.font = `${fontWeight} ${fontSize}px ${fontFamily}`;
            let textWidth;
            if (multiLine) {
                let measureAll = [];
                label.text.split('\\n').forEach(n => {
                    measureAll.push(tempContext.measureText(n).width);
                });
                textWidth = measureAll.reduce((total, num) => total > num ? total : num);
            }
            else {
                textWidth = tempContext.measureText(label.text).width;
            }
            tempCanvas.remove();
            let canvasWidth = textWidth + (paddingLeft * 2) + (borderColor !== 'none' ? borderWidth * 2 : 0);
            let canvasHeight;
            if (multiLine) {
                let lineLength = label.text.split('\\n').length;
                canvasHeight = (lineLength * fontSize) + (paddingTop * 2) + ((lineLength - 1) * paddingTop) + (borderColor !== 'none' ? borderWidth * 2 : 0);
                // height font times how many lines, padding top and bottom, padding between line, border top and bottom
            }
            else {
                canvasHeight = fontSize + (paddingTop * 2) + (borderColor !== 'none' ? borderWidth * 2 : 0);
            }
            // Drawing Canvas
            let canvas = this.createRetinaCanvas(canvasWidth, canvasHeight, letterSpacing);
            let ctx = canvas.getContext('2d', { antialias: false });
            ctx.font = `${fontWeight} ${fontSize}px ${fontFamily}`;
            ctx = canvas.getContext('2d', { antialias: false });
            ctx.textBaseline = "top";
            ctx.beginPath();
            // BACKGROUND
            if (backgroundColor !== 'none') {
                ctx.globalCompositeOperation = "source-over";
                ctx.rect(0, 0, canvasWidth, canvasHeight);
                ctx.fillStyle = backgroundColor;
                ctx.fill();
            }
            // FONT STROKE
            if (fontBorderColor !== 'none') {
                if (multiLine) {
                    label.text.split('\\n').forEach((n, ni) => {
                        ctx.globalCompositeOperation = "source-over";
                        ctx.strokeStyle = fontBorderColor;
                        ctx.lineWidth = fontBorderWidth;
                        ctx.miterLimit = 2;
                        ctx.strokeText(n, (canvasWidth - ctx.measureText(n).width) / 2, ((ni + 1) * paddingTop) + (borderColor !== 'none' ? borderWidth : 0) + (ni * fontSize));
                    });
                }
                else {
                    ctx.globalCompositeOperation = "source-over";
                    ctx.strokeStyle = fontBorderColor;
                    ctx.lineWidth = fontBorderWidth;
                    ctx.miterLimit = 2;
                    ctx.strokeText(label.text, (canvasWidth - ctx.measureText(label.text).width) / 2, paddingTop + (borderColor !== 'none' ? (borderWidth / 2) + borderWidth : 0));
                }
            }
            // FONT
            if (multiLine) {
                label.text.split('\\n').forEach((n, ni) => {
                    ctx.globalCompositeOperation = "source-over";
                    ctx.fillStyle = fontColor;
                    ctx.fillText(n, (canvasWidth - ctx.measureText(n).width) / 2, ((ni + 1) * paddingTop) + (borderColor !== 'none' ? +borderWidth : 0) + (ni * fontSize));
                });
            }
            else {
                ctx.globalCompositeOperation = "source-over";
                ctx.fillStyle = fontColor;
                ctx.fillText(label.text, (canvasWidth - ctx.measureText(label.text).width) / 2, paddingTop + (borderColor !== 'none' ? (borderWidth / 2) + borderWidth : 0));
            }
            // BORDER
            if (borderColor !== 'none') {
                ctx.globalCompositeOperation = "source-over";
                ctx.lineWidth = borderWidth;
                ctx.strokeStyle = borderColor;
                ctx.strokeRect(0, 0, canvasWidth, canvasHeight);
            }
            // SET COORDINATE
            let widthInCoordinate = canvasWidth / oneCoor < 1 ? 1 : canvasWidth / oneCoor;
            let heightInCoordinate = canvasHeight / oneCoor < 1 ? 1 : canvasHeight / oneCoor;
            // TEXTURE
            let texture = new CanvasTexture(canvas);
            texture.anisotropy = 20;
            // IF BILLBOARD
            if (label.type === 'billboard') {
                let labelMaterial = new SpriteMaterial({ map: texture });
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
                // Static
                let labelMaterial = new MeshBasicMaterial({ transparent: true, map: texture });
                let labelGeometry = new PlaneBufferGeometry(widthInCoordinate, heightInCoordinate);
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
        }
        // SAVE
        this.objects.rendered.labels = [...this.objects.rendered.labels, labelObject];
        this.objects.data.labels = [...this.objects.data.labels, label];
    }
    createRetinaCanvas(w, h, letterSpacing, ratio) {
        if (!ratio) {
            ratio = PIXEL_RATIO;
        }
        let can = document.createElement('canvas');
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
        can.style.letterSpacing = `${letterSpacing}px`;
        can.style.textAlign = `center`;
        can.getContext('2d').setTransform(ratio, 0, 0, ratio, 0, 0);
        return can;
    }
}
