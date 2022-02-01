import { Shape, Color } from 'three';
import { LevelWithoutScene } from './Object';
import { BuildingType, CurveType, GroundType, Pos2, Pos3, RenderedLevelType } from './Types';
declare const progressAndText: (progress: React.Dispatch<React.SetStateAction<number>> | null, text: React.Dispatch<React.SetStateAction<string>> | null, progressValue: number, textValue: string) => void;
declare const addToRaycaster: (objects: LevelWithoutScene) => any[];
declare const generateDefaultCalibration: (grounds: Array<GroundType>) => {
    view: string;
    position: {
        x: number;
        y: number;
        z: number;
    };
    target: {
        x: number;
        y: number;
        z: number;
    };
};
declare const generateLevelCalibration: (level: RenderedLevelType) => {
    position: {
        x: number;
        y: number;
        z: number;
    };
    target: {
        x: number;
        y: number;
        z: number;
    };
};
declare const findGroundLocation: (grounds: Array<GroundType | BuildingType>) => {
    highest: number;
    mostLeft: number;
    mostRight: number;
    mostBack: number;
    mostFront: number;
};
declare const generateZShape: (shape_points: Array<Pos2>) => {
    lessZ: number;
    mostZ: number;
};
declare const generateCurves: (curves: Array<CurveType>) => Shape;
declare const newColor: (arg: string) => Color;
export declare type pluralType = "grounds" | "buildings" | "shapes" | "places" | "pathVertices" | "pathEdges" | "labels";
export declare type singularType = "ground" | "building" | "shape" | "place" | "pathVertice" | "pathEdge" | "label";
declare const pluralIt: (text: singularType | pluralType) => pluralType;
declare const singularIt: (text: singularType | pluralType) => singularType;
declare const calculateLength: (pos1: Pos3, pos2: Pos3) => number;
declare const getMaxDistace: (pos1: Pos3, pos2: Pos3) => number;
declare const getYDistanceDiff: (firstY: number, secondY: number) => number;
export { progressAndText, addToRaycaster, generateDefaultCalibration, generateLevelCalibration, findGroundLocation, generateZShape, generateCurves, newColor, pluralIt, singularIt, calculateLength, getMaxDistace, getYDistanceDiff };
