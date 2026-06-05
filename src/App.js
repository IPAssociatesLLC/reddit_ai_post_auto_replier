import { jsx as _jsx } from "react/jsx-runtime";
import { BrowserRouter } from "react-router-dom";
import { AppRoutes } from "./router";
import { I18nextProvider } from "react-i18next";
import i18n from "./i18n";
function App() {
    return (_jsx(I18nextProvider, { i18n: i18n, children: _jsx(BrowserRouter, { basename: __BASE_PATH__, children: _jsx(AppRoutes, {}) }) }));
}
export default App;
