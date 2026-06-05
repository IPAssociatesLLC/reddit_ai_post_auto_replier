import { jsx as _jsx } from "react/jsx-runtime";
import NotFound from "../pages/NotFound";
import Home from "../pages/home/page";
import Popup from "../pages/popup/page";
import Options from "../pages/options/page";
import Onboarding from "../pages/onboarding/page";
import Login from "../pages/login/page";
import Register from "../pages/register/page";
import CodeViewer from "../pages/code/page";
import Architecture from "../pages/architecture/page";
const routes = [
    { path: "/", element: _jsx(Home, {}) },
    { path: "/popup", element: _jsx(Popup, {}) },
    { path: "/options", element: _jsx(Options, {}) },
    { path: "/onboarding", element: _jsx(Onboarding, {}) },
    { path: "/login", element: _jsx(Login, {}) },
    { path: "/register", element: _jsx(Register, {}) },
    { path: "/code", element: _jsx(CodeViewer, {}) },
    { path: "/architecture", element: _jsx(Architecture, {}) },
    { path: "*", element: _jsx(NotFound, {}) },
];
export default routes;
