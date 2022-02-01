import { Ref } from "react";
import { Event } from 'three';
import { gadeData, gadeDispatchType, LevelType, PlaceType, RenderedShapeType } from './Types';
import { LevelWithoutScene } from './Object';
interface optionsType {
    data: gadeData;
    ref: Ref<HTMLDivElement>;
    dispatch: gadeDispatchType;
}
export default class Gademap {
    private data;
    private ref;
    private dispatch;
    private selected;
    private raycaster;
    private mouse;
    private level;
    private scene;
    private camera;
    private renderer;
    private composer;
    private control;
    private light;
    private animation;
    private label;
    private objects;
    private calibration;
    private path;
    private defaultLevel;
    private frameId;
    constructor(options: optionsType);
    init(progress?: React.Dispatch<React.SetStateAction<number>> | null, text?: React.Dispatch<React.SetStateAction<string>> | null): Promise<void>;
    changeLevel: (level: LevelType, deletePath?: boolean) => Promise<unknown>;
    _changeLevelData: (level: LevelType) => void;
    checkHierarchy: (checkLevel: LevelType) => boolean;
    onMouseClick: (event: Event) => any;
    _previewClick: (intersects: Array<any>) => void;
    changeLevelParent: (object: LevelWithoutScene) => void;
    selectPlace: (place: PlaceType, shape?: RenderedShapeType) => void;
    unselectAll: (deletePath?: boolean) => void;
    findAway: (to: PlaceType, from?: PlaceType) => Promise<void>;
    _selectAfterPath: (obj: RenderedShapeType) => void;
    checkPathByPlace: (to: PlaceType, from?: PlaceType) => any;
    getHierarchy: () => {
        _id: string;
        type: string;
        name: string;
        parent: string;
        parent_type: string;
    }[];
    onWindowResize: () => any;
    isAnimating: () => boolean;
    start(): void;
    animate: () => void;
    renderScene: () => void;
    deleteAll: () => void;
}
export {};
