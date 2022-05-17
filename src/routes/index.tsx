import { RouteDefinition, useRoutes } from "solid-app-router";
import { lazy } from "solid-js";

const routes: RouteDefinition[] = [
  {
    path: "/",
    component: lazy(() => import("src/components/pages/index.page"))
  },
  {
    path: "/:noteId",
    component: lazy(() => import("src/components/pages/note.page"))
  },
  {
    path: "/view/:hashed",
    component: lazy(() => import("src/components/pages/view/note-view.page"))
  }
];

const AppRoutes = () => {
  const Routes = useRoutes(routes);
  return <Routes />;
};
export default AppRoutes;