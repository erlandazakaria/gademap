import { generateLevelCalibration, pluralIt } from './Helper';
export default class GadeCalibration {
    constructor(defaultCalibration, calibrations, animation, objects) {
        this.default = defaultCalibration;
        this.data = calibrations || [];
        this.animation = animation;
        this.objects = objects;
    }
    async goDefault() {
        return new Promise(async (res) => {
            // show hide level
            if (this.default.view === 'multi') {
                // show all grounds and buildings
                await Promise.all([this.animation.calibrateCamera(this.default), this.animation.showAllLevels()]);
            }
            else {
                await Promise.all([this.animation.calibrateCamera(this.default), this.objects.hideLevels(this.default.level)]);
            }
            res("");
        });
    }
    async calibrate(level) {
        return new Promise(async (res) => {
            let calibration = Object.assign({}, this.default);
            if (level.type === "Scene") {
                calibration = this.default;
            }
            else {
                const level_type = pluralIt(level.type);
                let findCalibration = this.data.find(c => c.level._id === level._id && c.level_type === level_type);
                if (findCalibration) {
                    calibration = findCalibration;
                }
                else {
                    let renderedLevel = level_type === "grounds" ? this.objects.rendered.grounds.find(g => g.userData._id === level._id)
                        : this.objects.rendered.buildings.find(g => g.userData._id === level._id);
                    if (!renderedLevel)
                        return;
                    const getCalibration = generateLevelCalibration(renderedLevel);
                    calibration = {
                        _id: "",
                        map: "",
                        view: "single",
                        level: level,
                        level_type: level.type === "building" ? "buildings" : "grounds",
                        position: getCalibration.position,
                        target: getCalibration.target
                    };
                }
            }
            // show hide level
            if (calibration.view === 'multi') {
                // show all grounds and buildings
                await Promise.all([this.animation.calibrateCamera(calibration), this.animation.showAllLevels()]);
            }
            else {
                await Promise.all([this.animation.calibrateCamera(calibration), this.objects.hideLevels(level)]);
            }
            res("");
        });
    }
}
