import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useMemo, useContext, useReducer } from "react";
const GadeContext = createContext(undefined);
let GadeThree = null;
export const setGadeThree = (three) => {
    GadeThree = three;
};
const initialGadeState = {
    level: { _id: "0", type: "Scene" },
    selected: [],
    isLoaded: false,
    hierarchy: [],
    places: []
};
function gadeReducer(state, action) {
    switch (action.type) {
        case "SELECT": {
            return Object.assign({}, state, Object.assign(Object.assign({}, state), { selected: action.payload }));
        }
        case "UNSELECT_ALL": {
            return Object.assign({}, state, Object.assign(Object.assign({}, state), { selected: [] }));
        }
        case "CHANGE_LEVEL": {
            return Object.assign({}, state, Object.assign(Object.assign({}, state), { level: action.payload }));
        }
        case "CHANGE_DATA": {
            return Object.assign({}, state, Object.assign(Object.assign({}, state), { places: action.payload }), { isLoaded: false });
        }
        case "LOADED": {
            return Object.assign({}, state, Object.assign(Object.assign({}, state), { isLoaded: true }));
        }
        case "RESET": {
            return initialGadeState;
        }
        case "UPDATE_HIERARCHY": {
            return Object.assign({}, state, Object.assign(Object.assign({}, state), { hierarchy: action.payload }));
        }
        default: {
            throw new Error(`Unhandled type`);
        }
    }
}
export function GadeProvider({ children }) {
    const [state, dispatch] = useReducer(gadeReducer, initialGadeState);
    const value = useMemo(() => ({ state, dispatch }), [state]);
    return _jsx(GadeContext.Provider, Object.assign({ value: value }, { children: children }), void 0);
}
export function useGade() {
    const context = useContext(GadeContext);
    if (!context) {
        throw new Error(`useGade must be used within a GadeProvider`);
    }
    const { state, dispatch } = context;
    const findAway = (to, from) => {
        if (GadeThree && GadeThree.isAnimating())
            return null;
        GadeThree && from ? GadeThree.findAway(to, from) : GadeThree === null || GadeThree === void 0 ? void 0 : GadeThree.findAway(to);
    };
    const changeLevel = (payload) => {
        if (GadeThree && GadeThree.isAnimating())
            return null;
        GadeThree && GadeThree.changeLevel(payload);
        dispatch({ type: "CHANGE_LEVEL", payload });
    };
    const select = (payload) => {
        if (GadeThree && GadeThree.isAnimating())
            return null;
        GadeThree && GadeThree.selectPlace(payload);
        dispatch({ type: "SELECT", payload: [payload] });
    };
    return {
        isLoaded: state.isLoaded,
        selected: state.selected,
        level: state.level,
        hierarchy: state.hierarchy,
        places: state.places,
        select,
        changeLevel,
        findAway,
    };
}
export function useGadeInternal() {
    const context = useContext(GadeContext);
    if (!context) {
        throw new Error(`useGade must be used within a GadeProvider`);
    }
    const { state, dispatch } = context;
    const reset = () => { dispatch({ type: "RESET" }); GadeThree && GadeThree.deleteAll(); };
    const changeData = (payload) => dispatch({ type: "CHANGE_DATA", payload });
    const gadeDispatch = (func, payload) => {
        if (func === 'loaded') {
            dispatch({ type: "LOADED", payload });
        }
        else if (func === 'select') {
            dispatch({ type: "SELECT", payload });
        }
        else if (func === 'unselect') {
            dispatch({ type: "UNSELECT_ALL" });
        }
        else if (func === 'changeLevel') {
            dispatch({ type: "CHANGE_LEVEL", payload });
        }
        else if (func === 'updateHierarchy') {
            dispatch({ type: "UPDATE_HIERARCHY", payload });
        }
    };
    return {
        isLoaded: state.isLoaded,
        selected: state.selected,
        level: state.level,
        hierarchy: state.hierarchy,
        places: state.places,
        gadeDispatch,
        reset,
        changeData
    };
}
