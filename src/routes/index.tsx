import { Route, Routes } from "solid-app-router";
import { lazy } from "solid-js";

const NotePage = lazy(() => import("src/components/pages/note.page"));
const NoteViewPage = lazy(() => import("src/components/pages/view/note-view.page"));

const AppRoutes = () => {
  return <Routes>
    <Route path="/:noteId" element={<NotePage />} />
    <Route path="/view">
      <Route path="/:noteId" element={<NoteViewPage />} />
    </Route>
  </Routes>;
};
export default AppRoutes;