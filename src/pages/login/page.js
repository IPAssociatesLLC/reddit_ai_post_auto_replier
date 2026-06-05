import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
export default function Login() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            navigate("/popup");
        }, 1500);
    };
    return (_jsx("div", { className: "min-h-screen bg-[#f8f9fa] flex items-center justify-center p-4", children: _jsxs("div", { className: "w-full max-w-[400px] bg-white rounded-2xl border border-gray-200 shadow-lg p-8", children: [_jsxs("div", { className: "mb-8", children: [_jsx("h1", { className: "text-2xl font-bold text-gray-900", children: "Sign In" }), _jsx("p", { className: "text-sm text-gray-600 mt-2", children: "Access your ClickSendAI Forum Agent" })] }), _jsxs("form", { onSubmit: handleLogin, className: "space-y-4", children: [error && (_jsx("div", { className: "bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700", children: error })), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-900 mb-2", children: "Email" }), _jsx("input", { type: "email", value: email, onChange: (e) => setEmail(e.target.value), placeholder: "you@example.com", required: true, className: "w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-900 mb-2", children: "Password" }), _jsx("input", { type: "password", value: password, onChange: (e) => setPassword(e.target.value), placeholder: "\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022", required: true, className: "w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent" })] }), _jsx("button", { type: "submit", disabled: loading, className: "w-full px-4 py-2 bg-orange-600 hover:bg-orange-700 disabled:bg-gray-400 text-white rounded-lg font-medium transition", children: loading ? "Signing in..." : "Sign In" })] }), _jsx("div", { className: "mt-6 text-center", children: _jsxs("p", { className: "text-sm text-gray-600", children: ["Don't have an account?", " ", _jsx("button", { onClick: () => navigate("/register"), className: "text-orange-600 hover:text-orange-700 font-medium", children: "Sign up" })] }) })] }) }));
}
