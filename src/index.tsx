/* @refresh reload */
import { Router } from "solid-app-router";
import { render } from "solid-js/web";
import AppRoutes from "src/routes";
import "src/styles/global.css";

render(() => <Router>
  <AppRoutes />
</Router>, document.getElementById("root") as HTMLElement);
