import { useEffect } from "react";
import { BrowserRouter, Route, Routes } from "react-router";
import "./App.css";
import MainPage from "./pages/MainPage";
import Layout from "./layouts/Layout";
import CardOrbitPage from "./pages/CardOrbitPage";
import CardResultPage from "./pages/CardResultPage";

function App() {
  useEffect(() => {
    const ua = navigator.userAgent.toLowerCase();
    const isAndroid = /android/.test(ua);
    const isIOS = /iphone|ipad|ipod/.test(ua);
    const isChrome =
      (/chrome|crios/.test(ua) &&
        !/edg|edge|opr|opera|samsungbrowser|whale/.test(ua)) ||
      /chromium/.test(ua);

    if (isChrome || (!isAndroid && !isIOS)) {
      return;
    }

    const currentUrl = window.location.href;

    if (isAndroid) {
      const urlWithoutProtocol = currentUrl.replace(/^https?:\/\//, "");
      const intentUrl = `intent://${urlWithoutProtocol}#Intent;scheme=https;package=com.android.chrome;S.browser_fallback_url=${encodeURIComponent(currentUrl)};end`;
      window.location.href = intentUrl;
      return;
    }

    if (isIOS) {
      const chromeSchemeUrl = currentUrl.replace(
        /^https?/,
        (protocol) => `${protocol === "https" ? "googlechromes" : "googlechrome"}`
      );
      window.location.href = chromeSchemeUrl;
    }
  }, []);

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
