import { AnimationType } from './Animation';
import GadeObject from './Object';
import { CalibrationType, LevelType } from './Types';
export default class GadeCalibration {
    private default;
    private data;
    private animation;
    private objects;
    constructor(defaultCalibration: CalibrationType, calibrations: Array<CalibrationType>, animation: AnimationType, objects: GadeObject);
    goDefault(): Promise<unknown>;
    calibrate(level: LevelType): Promise<unknown>;
}
