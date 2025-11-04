// import logo from './logo.svg';
import "./App.css";
import Alert from "./components/Alert";
// import About from './components/About';
import Navbar from "./components/Navbar";
import TextForm from "./components/TextForm";
import CompareText from "./components/CompareText";
import CompareRoute from "./routes/CompareRoute.tsx";
import Footer from "./components/Footer";
import React, { useState } from "react";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  const [mode, setMode] = useState("light");
  const [alert, setAlert] = useState(null);

  const showAlert = (message, type) => {
    setAlert({
      msg: message,
      type: type,
    });
    setTimeout(() => {
      setAlert(null)
    }, 1500);
  };

  const toggleMode = () => {
    if (mode === "light") {
      setMode("dark");
      document.body.style.backgroundColor = "var(--background-dark)";
      document.body.style.color = "var(--text-primary-dark)";
      showAlert("Dark mode has been enabled", "success");
      document.title = "TextUtils - DarkMode";
    } else {
      setMode("light");
      document.body.style.backgroundColor = "var(--background-light)";
      document.body.style.color = "var(--text-primary-light)";
      showAlert("Light mode has been enabled", "success");
      document.title = "TextUtils - LightMode";
    }
  };

  return (
    <Router>
      <div style={{ 
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column'
      }}>
        <Navbar title="TextUtils" mode={mode} toggleMode={toggleMode} />
        <Alert alert={alert} />
        <div className="container my-3" style={{ flex: 1 }}>
          <Routes>
            <Route path="/" element={<TextForm heading="Enter the text to Analyze below:" mode={mode} showAlert={showAlert} />} />
            <Route path="/compare" element={<CompareRoute />} />
          </Routes>
        </div>
        <Footer mode={mode} />
      </div>
    </Router>
  );
}

export default App;
