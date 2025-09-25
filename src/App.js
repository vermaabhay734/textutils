// import logo from './logo.svg';
import "./App.css";
import Alert from "./components/Alert";
// import About from './components/About';
import Navbar from "./components/Navbar";
import TextForm from "./components/TextForm";
import Footer from "./components/Footer";
import React, { useState } from "react";

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
    <div style={{ 
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column'
    }}>
      <Navbar title="TextUtils" mode={mode} toggleMode={toggleMode} />
      <Alert alert={alert} />
      <div className="container my-3" style={{ flex: 1 }}>
        <TextForm
          heading="Enter the text to Analyze below:"
          mode={mode}
          showAlert={showAlert}
        />
      </div>
      <Footer mode={mode} />
    </div>
  );
}

export default App;
