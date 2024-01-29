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
    var text = document.getElementById("myBox");
    text.select();
    navigator.clipboard.writeText(text.value);
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
        style={{ color: props.mode === "dark" ? "white" : "#042743" }}
      >
        <h1>{props.heading}</h1>
        <div className="mb-3">
          <textarea
            className="form-control"
            onChange={handleOnChange}
            style={{
              backgroundColor: props.mode === "dark" ? "grey" : "white",
              color: props.mode === "dark" ? "white" : "#042743",
            }}
            value={text}
            id="myBox"
            rows="7"
          ></textarea>
        </div>
        <button className="btn btn-primary mx-1 my-1" onClick={handleUpClick}>
          Convert to Uppercase
        </button>
        <button className="btn btn-primary mx-1 my-1" onClick={handleLoClick}>
          Convert to Lowercase
        </button>
        <button className="btn btn-primary mx-1 my-1" onClick={handleClearText}>
          Clear Text
        </button>
        <button className="btn btn-primary mx-1 my-1" onClick={handleCopy}>
          Copy Text
        </button>
        <button className="btn btn-primary mx-1 my-1" onClick={handleExtraSpace}>
          Remove Extra Space
        </button>
        {/* Add the Email ID Finder Button */}
        <button className="btn btn-primary mx-1 my-1" onClick={findEmails}>
          Find Email Addresses
        </button>
      </div>
      <div
        className="container my-3"
        style={{ color: props.mode === "dark" ? "white" : "#042743" }}
      >
        <h2>Your Text Summary</h2>
        <p>
          {text.split(" ").filter((element) => element.length !== 0).length} words and {text.length} characters
        </p>
        <p>{0.008 * (text.split(" ").length - 1)} Minutes read</p>
        <h2>Preview</h2>
        <p>{text.length > 0 ? text : "Enter something in the textbox above to preview it here. "}</p>
      </div>
      {/* Conditional Rendering of Found Email Addresses Section */}
      {emails.length > 0 && (
        <div
          className="container my-3"
          style={{ color: props.mode === "dark" ? "white" : "#042743" }}
        >
          <h2>Found Email Addresses</h2>
          <ul>
            {emails.map((email, index) => (
              <li key={index}>{email}</li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
}