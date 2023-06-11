import React from "react";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Header from "components/Header";
import LoginPage from "page/LoginPage";
import MainPage from "page/MainPage";
import Router from "routes/Router";

function App() {
  return (
    <div>
      <BrowserRouter>
      <Header />
        <Router />
        {/* <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/main" element={<MainPage />} />
          <Route path="*" element="404 Not Found" />
        </Routes> */}
      </BrowserRouter>
    </div>
  );
}

export default App;
