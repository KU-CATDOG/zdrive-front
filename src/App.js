import React from "react";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import LoginPage from "page/LoginPage";
import Header from "components/Header";
import MainPage from "page/MainPage";

function App() {
  return (
    <div>
      <BrowserRouter basename="/zdrive">
        <Header />
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/main" element={<MainPage />} />
          <Route path="*" element="404 Not Found" />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
