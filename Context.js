var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useMemo, useContext, useReducer } from "react";
var GadeContext = createContext(undefined);
var GadeThree = null;
export var setGadeThree = function (three) {
    GadeThree = three;
};
var initialGadeState = {
    level: { _id: "0", type: "Scene" },
    selected: [],
    isLoaded: false,
    hierarchy: [],
    places: []
};
function gadeReducer(state, action) {
    switch (action.type) {
        case "SELECT": {
            return Object.assign({}, state, __assign(__assign({}, state), { selected: action.payload }));
        }
        case "UNSELECT_ALL": {
            return Object.assign({}, state, __assign(__assign({}, state), { selected: [] }));
        }
        case "CHANGE_LEVEL": {
            return Object.assign({}, state, __assign(__assign({}, state), { level: action.payload }));
        }
        case "CHANGE_DATA": {
            return Object.assign({}, state, __assign(__assign({}, state), { places: action.payload }), { isLoaded: false });
        }
        case "LOADED": {
            return Object.assign({}, state, __assign(__assign({}, state), { isLoaded: true }));
        }
        case "RESET": {
            return initialGadeState;
        }
        case "UPDATE_HIERARCHY": {
            return Object.assign({}, state, __assign(__assign({}, state), { hierarchy: action.payload }));
        }
        default: {
            throw new Error("Unhandled type");
        }
    }
}
export function GadeProvider(_a) {
    var children = _a.children;
    var _b = useReducer(gadeReducer, initialGadeState), state = _b[0], dispatch = _b[1];
    var value = useMemo(function () { return ({ state: state, dispatch: dispatch }); }, [state]);
    return _jsx(GadeContext.Provider, __assign({ value: value }, { children: children }), void 0);
}
export function useGade() {
    var context = useContext(GadeContext);
    if (!context) {
        throw new Error("useGade must be used within a GadeProvider");
    }
    var state = context.state, dispatch = context.dispatch;
    var findAway = function (to, from) {
        if (GadeThree && GadeThree.isAnimating())
            return null;
        GadeThree && from ? GadeThree.findAway(to, from) : GadeThree === null || GadeThree === void 0 ? void 0 : GadeThree.findAway(to);
    };
    var changeLevel = function (payload) {
        if (GadeThree && GadeThree.isAnimating())
            return null;
        GadeThree && GadeThree.changeLevel(payload);
        dispatch({ type: "CHANGE_LEVEL", payload: payload });
    };
    var select = function (payload) {
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
        select: select,
        changeLevel: changeLevel,
        findAway: findAway,
    };
}
export function useGadeInternal() {
    var context = useContext(GadeContext);
    if (!context) {
        throw new Error("useGade must be used within a GadeProvider");
    }
    var state = context.state, dispatch = context.dispatch;
    var reset = function () { dispatch({ type: "RESET" }); GadeThree && GadeThree.deleteAll(); };
    var changeData = function (payload) { return dispatch({ type: "CHANGE_DATA", payload: payload }); };
    var gadeDispatch = function (func, payload) {
        if (func === 'loaded') {
            dispatch({ type: "LOADED", payload: payload });
        }
        else if (func === 'select') {
            dispatch({ type: "SELECT", payload: payload });
        }
        else if (func === 'unselect') {
            dispatch({ type: "UNSELECT_ALL" });
        }
        else if (func === 'changeLevel') {
            dispatch({ type: "CHANGE_LEVEL", payload: payload });
        }
        else if (func === 'updateHierarchy') {
            dispatch({ type: "UPDATE_HIERARCHY", payload: payload });
        }
    };
    return {
        isLoaded: state.isLoaded,
        selected: state.selected,
        level: state.level,
        hierarchy: state.hierarchy,
        places: state.places,
        gadeDispatch: gadeDispatch,
        reset: reset,
        changeData: changeData
    };
}
//# sourceMappingURL=Context.js.map