import { Routes, Route } from 'react-router-dom';
import routes from './config';

export function AppRoutes() {
  return (
    <Routes>
      {routes.map((route, idx) => (
        <Route key={idx} path={route.path} element={route.element} />
      ))}
    </Routes>
  );
}
