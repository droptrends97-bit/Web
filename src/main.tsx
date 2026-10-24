import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, MemoryRouter, Route, Routes } from "react-router-dom";
import "./index.css";
import { StoreProvider } from "./lib/store";
import Layout from "./components/Layout";
import Session from "./pages/Session";
import Weather from "./pages/Weather";
import Rigging from "./pages/Rigging";
import Checklist from "./pages/Checklist";
import Boats from "./pages/Boats";
import BoatForm from "./pages/BoatForm";

// The demo build runs inside a sandboxed frame that can't use URL routes.
const Router = import.meta.env.VITE_DEMO === "1" ? MemoryRouter : BrowserRouter;

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <StoreProvider>
      <Router>
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<Session />} />
            <Route path="weather" element={<Weather />} />
            <Route path="rigging" element={<Rigging />} />
            <Route path="checklist" element={<Checklist />} />
            <Route path="boats" element={<Boats />} />
            <Route path="boats/new" element={<BoatForm />} />
            <Route path="boats/:id" element={<BoatForm />} />
            <Route path="*" element={<Session />} />
          </Route>
        </Routes>
      </Router>
    </StoreProvider>
  </StrictMode>,
);
