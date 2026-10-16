import { createRoot } from 'react-dom/client';
import { BrowserRouter, HashRouter } from "react-router";

import App from './App.tsx';

import "./styles/variables.css";
import "./styles/global.css";

// GitHub Pages no ofrece redirecciones para las rutas internas de React.
const Router = import.meta.env.VITE_GITHUB_PAGES === "true" ? HashRouter : BrowserRouter;

createRoot(document.getElementById('root')!).render(
  <Router>
    <App />
  </Router>
)
