// import logo from './logo.svg';
import "./App.css";
import Alert from "./components/Alert";
// import About from './components/About';
import Navbar from "./components/Navbar";
import TextForm from "./components/TextForm";
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
      document.body.style.backgroundColor = "#042743";
      showAlert("Dark mode has been enabled", "success");
      document.title = "TextUtils - DarkMode";
      // setInterval(() => {
      //   document.title = "TextUtils - Downlaod Now";
      // }, 1500);
      // setInterval(() => {
      //   document.title = "TextUtils is great";
      // }, 2000);
    } else {
      setMode("light");
      document.body.style.backgroundColor = "white";
      showAlert("Light mode has been enabled", "success");
      document.title = "TextUtils - LightMode";
    }
  };

  return (
    <>
      {/* <Navbar title = "TextUtils"/> */}
      <Navbar title="TextUtils" mode={mode} toggleMode={toggleMode} />
      <Alert alert={alert} />
      <div className="container my-3">
        <TextForm
          heading="Enter the text to Analyze below:"
          mode={mode}
          showAlert={showAlert}
        />
        {/* <About/> */}
      </div>
    </>
  );
}

export default App;
