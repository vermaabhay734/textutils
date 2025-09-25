import React, { useState } from "react";

export default function TextForm(props) {
  const handleUpClick = () => {
    let newText = text.toUpperCase();
    setText(newText);
    props.showAlert("Converted to UPPERCASE!", "success");
  };

  const handleLoClick = () => {
    let newText = text.toLowerCase();
    setText(newText);
    props.showAlert("Converted to lowercase!", "success");
  };

  const handleClearText = () => {
    let newText = "";
    setText(newText);
    props.showAlert("Text Cleared!", "success");
  };

  const handleOnChange = (event) => {
    setText(event.target.value);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    props.showAlert("Copied to Clipboard!", "success");
  };

  const handleExtraSpace = () => {
    let newText = text.split(/[ ]+/);
    setText(newText.join(" "));
    props.showAlert("Extra Spaces removed!", "success");
  };

  const findEmails = () => {
    const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g;
    const matches = text.match(emailRegex);

    if (matches) {
      setEmails(matches);
      props.showAlert(`Found Email Addresses!`, 'info');
    } else {
      setEmails([]);
      props.showAlert('No email addresses found in the text.', 'info');
    }
  };

  const [text, setText] = useState("");
  const [emails, setEmails] = useState([]);

  return (
    <>
      <div
        className="container"
        style={{ 
          marginTop: "2rem",
          border: `1px solid ${props.mode === "dark" ? "var(--border-dark)" : "var(--border-light)"}`,
        }}
      >
        <h1 style={{ 
          fontSize: "2.5rem", 
          fontWeight: "700",
          marginBottom: "1.5rem",
          background: props.mode === "dark" ? "linear-gradient(135deg, #ecf0f1, #bdc3c7)" : "linear-gradient(135deg, #2c3e50, #3498db)",
          WebkitBackgroundClip: "text",
          backgroundClip: "text",
          WebkitTextFillColor: "transparent"
        }}>{props.heading}</h1>
        <div className="mb-4">
          <textarea
            className="form-control"
            onChange={handleOnChange}
            style={{
              height: "250px",
              resize: "vertical",
              fontFamily: "'Poppins', sans-serif",
              fontSize: "1.1rem"
            }}
            value={text}
            id="myBox"
            rows="8"
          ></textarea>
        </div>
        <div className="button-group" style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "1rem",
          justifyContent: "center",
          marginTop: "1.5rem"
        }}>
          <button className="btn btn-primary" onClick={handleUpClick}>
            <span style={{ marginRight: "8px" }}>⬆️</span>Uppercase
          </button>
          <button className="btn btn-primary" onClick={handleLoClick}>
            <span style={{ marginRight: "8px" }}>⬇️</span>Lowercase
          </button>
          <button className="btn btn-secondary" onClick={handleClearText}>
            <span style={{ marginRight: "8px" }}>🗑️</span>Clear
          </button>
          <button className="btn btn-secondary" onClick={handleCopy}>
            <span style={{ marginRight: "8px" }}>📋</span>Copy
          </button>
          <button className="btn btn-primary" onClick={handleExtraSpace}>
            <span style={{ marginRight: "8px" }}>✨</span>Remove Spaces
          </button>
          <button className="btn btn-secondary" onClick={findEmails}>
            <span style={{ marginRight: "8px" }}>📧</span>Find Emails
          </button>
        </div>
      </div>
      <div
        className="container my-4 text-summary"
        style={{ 
          color: props.mode === "dark" ? "white" : "#042743",
          backgroundColor: props.mode === "dark" ? "rgba(26, 26, 26, 0.8)" : "rgba(255, 255, 255, 0.8)",
          borderRadius: "20px",
          padding: "2rem",
          boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)"
        }}
      >
        <h2 style={{ 
          fontSize: "2rem", 
          fontWeight: "600",
          marginBottom: "1rem"
        }}>Text Summary</h2>
        <div className="summary-stats" style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "1.5rem",
          marginBottom: "2rem"
        }}>
          <div className="stat-card" style={{
            padding: "1.5rem",
            borderRadius: "15px",
            background: props.mode === "dark" ? "rgba(52, 152, 219, 0.2)" : "rgba(44, 62, 80, 0.1)"
          }}>
            <h3 style={{ fontSize: "1.2rem", marginBottom: "0.5rem" }}>Word Count</h3>
            <p style={{ fontSize: "2rem", fontWeight: "700", margin: 0 }}>
              {text.split(/\s+/).filter((element) => element.length !== 0).length}
            </p>
          </div>
          <div className="stat-card" style={{
            padding: "1.5rem",
            borderRadius: "15px",
            background: props.mode === "dark" ? "rgba(52, 152, 219, 0.2)" : "rgba(44, 62, 80, 0.1)"
          }}>
            <h3 style={{ fontSize: "1.2rem", marginBottom: "0.5rem" }}>Characters</h3>
            <p style={{ fontSize: "2rem", fontWeight: "700", margin: 0 }}>{text.length}</p>
          </div>
          <div className="stat-card" style={{
            padding: "1.5rem",
            borderRadius: "15px",
            background: props.mode === "dark" ? "rgba(52, 152, 219, 0.2)" : "rgba(44, 62, 80, 0.1)"
          }}>
            <h3 style={{ fontSize: "1.2rem", marginBottom: "0.5rem" }}>Reading Time</h3>
            <p style={{ fontSize: "2rem", fontWeight: "700", margin: 0 }}>
              {Math.ceil(0.008 * text.split(/\s+/).filter((element) => element.length !== 0).length)} min
            </p>
          </div>
        </div>
        <div className="preview-section" style={{
          marginTop: "2rem",
          padding: "1.5rem",
          borderRadius: "15px",
          background: props.mode === "dark" ? "rgba(52, 152, 219, 0.1)" : "rgba(44, 62, 80, 0.05)"
        }}>
          <h2 style={{ marginBottom: "1rem" }}>Preview</h2>
          <p style={{ 
            fontSize: "1.1rem",
            lineHeight: "1.6",
            opacity: text.length > 0 ? 1 : 0.7
          }}>
            {text.length > 0 ? text : "Enter something in the textbox above to preview it here."}
          </p>
        </div>
      </div>
      {emails.length > 0 && (
        <div
          className="container my-4 email-list"
          style={{ 
            color: props.mode === "dark" ? "white" : "#042743",
            backgroundColor: props.mode === "dark" ? "rgba(26, 26, 26, 0.8)" : "rgba(255, 255, 255, 0.8)",
            borderRadius: "20px",
            padding: "2rem",
            boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)"
          }}
        >
          <h2 style={{ 
            fontSize: "2rem", 
            fontWeight: "600",
            marginBottom: "1.5rem"
          }}>Found Email Addresses</h2>
          <ul style={{
            listStyle: "none",
            padding: 0,
            display: "grid",
            gap: "1rem"
          }}>
            {emails.map((email, index) => (
              <li 
                key={index}
                style={{
                  padding: "1rem 1.5rem",
                  borderRadius: "10px",
                  background: props.mode === "dark" ? "rgba(52, 152, 219, 0.2)" : "rgba(44, 62, 80, 0.1)",
                  transition: "transform 0.3s ease",
                  cursor: "pointer"
                }}
                onMouseEnter={(e) => e.target.style.transform = "translateX(10px)"}
                onMouseLeave={(e) => e.target.style.transform = "translateX(0)"}
              >
                {email}
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
}