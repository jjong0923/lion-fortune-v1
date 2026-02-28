import { BrowserRouter, Route, Routes } from "react-router";
import "./App.css";
import MainPage from "./pages/MainPage";
import Layout from "./layouts/Layout";
import CardOrbitPage from "./pages/CardOrbitPage";
import CardResultPage from "./pages/CardResultPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<MainPage />} />
          <Route path="/card" element={<CardOrbitPage />} />
          <Route path="/result/:cardId" element={<CardResultPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
