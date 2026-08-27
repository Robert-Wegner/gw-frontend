import React from "react";
import { createRoot } from "react-dom/client";
import GalacticWar from "./components/GalacticWar.js";
import { createDemoCallbacks, createDemoModel } from "./demo/demoModel.js";
import "./index.css";
import "./style/gw-style-aeon.css";

const model = createDemoModel();
const callbacks = createDemoCallbacks(model);

createRoot(document.getElementById("root")).render(
  <GalacticWar
    model={model}
    buttonCallback={callbacks.buttonCallback}
    shopCallback={callbacks.shopCallback}
  />,
);
