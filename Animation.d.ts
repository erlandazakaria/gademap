import { CameraType } from './Camera';
import { ControlType } from './Control';
import { CalibrationType, LevelType } from './Types';
import { LevelWithoutScene } from './Object';
export interface AnimationType {
    isAnimating: boolean;
    calibrateCamera: (calibration: CalibrationType) => void;
    showAllLevels: () => void;
    showHideObject3D: (object: any, show: boolean) => void;
    addTransparentBuilding: (object: any) => void;
    addTransparentParentBuilding: (object: any) => void;
    selectShape: (object: any, duration: number) => void;
    scale: (object: any, duration: number, scale: Array<number>) => void;
    unscale: (object: any, duration: number, scale: Array<number>) => void;
    changeColor: (object: any, duration: number, color?: string) => void;
    showPath: (path: any) => Promise<Array<any>>;
    hideLevels: (level: Array<LevelWithoutScene>) => void;
}
export default class Animation {
    private camera;
    private control;
    private changeLevel;
    private hiddenLevel;
    isAnimating: boolean;
    private pathSpeed;
    private animatePerSphere;
    private generalYDistance;
    private generalZDistance;
    private pathYDistance2;
    private dummyStart;
    private dummyFinish;
    constructor(camera: CameraType, control: ControlType, changeLevel: (level: LevelType, val?: boolean) => void);
    calibrateCamera(calibration: CalibrationType): Promise<unknown>;
    showAllLevels(): void;
    hideLevels(levels: Array<LevelWithoutScene>): void;
    private showTwoLevels;
    private calibrateTwoLevels;
    showHideObject3D(object: any, show: boolean): void;
    addTransparentBuilding(object: any): void;
    addTransparentParentBuilding(object: any): void;
    selectShape(object: any, duration: number): void;
    scale(object: any, duration: number, scale: Array<number>): void;
    unscale(object: any, duration: number, scale: Array<number>): void;
    changeColor(object: any, duration: number, color?: string): void;
    showPath(path: any): Promise<Array<any>>;
}
