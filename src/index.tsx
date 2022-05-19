/* @refresh reload */
import { Router } from "solid-app-router";
import { render } from "solid-js/web";
import ContextInjector from "src/lib/context-injector";
import AppRoutes from "src/routes";
import "src/styles/global.css";

render(() => <ContextInjector>
  <Router>
    <AppRoutes />
  </Router>
</ContextInjector>, document.getElementById("root") as HTMLElement);
