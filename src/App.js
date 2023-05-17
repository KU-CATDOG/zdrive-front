import React from "react";
import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import LoginPage from "LoginPage";

function App() {
  return (
    <div>
      <BrowserRouter>
        <p>This is header for all page</p>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="*" element="404 Not Found" />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
