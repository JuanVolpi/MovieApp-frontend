import { Route, Routes } from "react-router-dom";
import MainPage from "./pages/Filmes/MainPage";
import CommunityPage from "./pages/community/CommunityPage";

function App() {
  return (
    <Routes>
      <Route element={<MainPage />} path="/filmes" />
      <Route element={<CommunityPage/>} path="/comunidade" />
    </Routes>
  );
}

export default App;
