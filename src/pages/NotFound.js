import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useLocation } from "react-router-dom";
export default function NotFound() {
    const location = useLocation();
    return (_jsxs("div", { className: "relative flex flex-col items-center justify-center h-screen text-center px-4", children: [_jsx("h1", { className: "absolute bottom-0 text-9xl font-black text-gray-50 select-none pointer-events-none z-0", children: "404" }), _jsxs("div", { className: "relative z-10", children: [_jsx("h1", { className: "text-xl font-semibold mt-6", children: "This page has not been generated" }), _jsx("p", { className: "mt-2 text-base text-gray-400 font-mono", children: location.pathname })] })] }));
}
