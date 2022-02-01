import { BuildingType, gadeData, gadeDispatchType, GadeObjectType, GroundType, LabelType, LevelType, PathEdgeType, PathVerticeType, PlaceType, RenderedBuildingType, RenderedGroundType, RenderedLabelType, RenderedPinType, RenderedShapeType, SceneType, ShapeType } from './Types';
import { GadeSceneType } from './Scene';
import { GadeLabelType } from './Label';
import { AnimationType } from './Animation';
export interface ObjectData {
    scene: SceneType;
    shapes: Array<ShapeType>;
    places: Array<PlaceType>;
    grounds: Array<GroundType>;
    buildings: Array<BuildingType>;
    pathVertices: Array<PathVerticeType>;
    pathEdges: Array<PathEdgeType>;
    labels: Array<LabelType>;
}
export interface ObjectRendered {
    shapes: Array<RenderedShapeType>;
    labels: Array<RenderedLabelType>;
    grounds: Array<RenderedGroundType>;
    buildings: Array<RenderedBuildingType>;
    user: RenderedPinType | null;
}
export interface LayerRendered {
    number: number;
    building: RenderedBuildingType;
}
export interface HierarchyType extends GadeObjectType {
    hierarchies?: Array<HierarchyType>;
    children?: any;
}
export declare type LevelWithoutScene = RenderedBuildingType | RenderedGroundType;
export default class GadeObject {
    private scene;
    level: LevelType | null;
    private label;
    private animation;
    private dispatch;
    layers: Array<LayerRendered>;
    private user;
    private modelLoader;
    private imageLoader;
    private roughness;
    private roughnessURL;
    private userURL;
    data: ObjectData;
    rendered: ObjectRendered;
    hierarchy: Array<HierarchyType>;
    constructor(data: gadeData, scene: GadeSceneType, level: LevelType | null, label: GadeLabelType, animation: AnimationType, dispatch: gadeDispatchType);
    init(): Promise<string>;
    private add3DObj;
    private generateHierarchy;
    private addUserObject;
    private updateHierarchy;
    showAllLevels: () => Promise<any>;
    hideLevels: (level: GroundType | BuildingType) => Promise<any>;
    private loadModel;
}
