import { jsxs as _jsxs, jsx as _jsx } from "react/jsx-runtime";
import axios from 'axios';
import { useState, useEffect, useRef } from 'react';
import { useGadeInternal } from './Context';
import Core from './Core';
const Gade = ({ map, loadingText, children }) => {
    const [mapLoadProgress, setMapLoadProgress] = useState(0);
    const [mapLoadText, setMapLoadText] = useState(loadingText || "Loading ...");
    const gadeMapRef = useRef(null);
    const { changeData, gadeDispatch, reset } = useGadeInternal();
    useEffect(() => {
        const loadGade = async () => {
            if (!map)
                return;
            const res = await axios.get(`https://endpoint.antrio.id/map/detail?key=${map}`);
            if (res.status === 200) {
                let threeGM = new Core({
                    data: res.data.data,
                    ref: gadeMapRef,
                    dispatch: gadeDispatch
                });
                threeGM.init(setMapLoadProgress, setMapLoadText);
                changeData({
                    places: res.data.data.places,
                    screensavers: res.data.data.screensavers
                });
            }
            else {
                console.warn(res.data.message);
            }
        };
        loadGade();
        return () => { reset(); };
        // eslint-disable-next-line
    }, []);
    return (_jsxs("div", Object.assign({ id: "gade-container", style: { width: '100%', height: '100%', position: 'relative' } }, { children: [mapLoadProgress !== 100 &&
                _jsxs("div", Object.assign({ id: 'gade-loading', style: {
                        boxSizing: 'border-box',
                        backgroundColor: '#2AA5A5',
                        position: 'absolute',
                        width: '100%',
                        height: '100%',
                        zIndex: 2,
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        textAlign: 'center'
                    } }, { children: [_jsxs("div", Object.assign({ id: "gade-loading-percent" }, { children: ["Loading ", `${mapLoadProgress}%`, "..."] }), void 0), _jsx("div", Object.assign({ id: "gade-loading-text" }, { children: mapLoadText }), void 0)] }), void 0), _jsx("div", Object.assign({ id: 'gade-map', ref: gadeMapRef, style: { width: '100%', height: '100%' }, tabIndex: 0 }, { children: children }), void 0)] }), void 0));
};
export default Gade;
