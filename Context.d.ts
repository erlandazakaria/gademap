import { ReactNode } from "react";
import Core from "./Core";
import { PlaceType, LevelType, GroundType, BuildingType } from "./Types";
declare type gadecoreType = Core | null;
interface useGadeInterface {
    isLoaded: boolean;
    selected: Array<PlaceType>;
    level: LevelType;
    hierarchy: Array<GroundType | BuildingType>;
    places: Array<PlaceType>;
    screensavers: Array<any>;
    unselect: () => void;
    select: (place: PlaceType) => void;
    changeLevel: (level: LevelType) => void;
    findAway: (to: PlaceType, from?: PlaceType) => void;
    resetPosition: () => void;
}
export declare const setGadeThree: (three: gadecoreType) => void;
export declare function GadeProvider({ children }: {
    children: ReactNode;
}): JSX.Element;
export declare function useGade(): useGadeInterface;
export declare function useGadeInternal(): {
    isLoaded: boolean;
    selected: PlaceType[];
    level: LevelType;
    hierarchy: (BuildingType | GroundType)[];
    places: PlaceType[];
    gadeDispatch: (func: string, payload?: any) => void;
    reset: () => void;
    changeData: (payload: {
        places: Array<PlaceType>;
        screensavers: Array<any>;
    }) => void;
};
export {};
