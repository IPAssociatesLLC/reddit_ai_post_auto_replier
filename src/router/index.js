import { jsx as _jsx } from "react/jsx-runtime";
import { Routes, Route } from 'react-router-dom';
import routes from './config';
export function AppRoutes() {
    return (_jsx(Routes, { children: routes.map((route, idx) => (_jsx(Route, { path: route.path, element: route.element }, idx))) }));
}
