import { Route, Routes } from "react-router-dom";
import MainPage from "./pages/Filmes/MainPage";

function App() {
  return (
    <Routes>
      <Route element={<MainPage />} path="/filmes" />
    </Routes>
  );
}

export default App;
