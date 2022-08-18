import ReactDOM from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { App } from "./App";
import { Environment } from "./utils/utils";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App environment={Environment.Basic} />} />
      <Route
        path="/sandbox"
        element={<App environment={Environment.Sandbox} />}
      />
      <Route
        path="/play/:id"
        element={<App environment={Environment.Play} />}
      />
    </Routes>
  </BrowserRouter>
);
