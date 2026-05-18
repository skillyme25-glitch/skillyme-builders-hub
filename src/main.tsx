import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { applyOverrides } from "./admin/overrides";

applyOverrides();

createRoot(document.getElementById("root")!).render(<App />);
