
import React, { useState, useRef } from "react";

export default function TextForm(props) {
  // Utility functions
  function removeCodeComments(str) {
    let out = str.replace(/(^|\s)\/\/.*$/gm, "");
    out = out.replace(/\/\*[\s\S]*?\*\//gm, "");
    out = out.replace(/<!--([\s\S]*?)-->/gm, "");
    return out;
  }

  // Remove SQL comments: single-line '--' and multi-line '/* ... */'
  function removeSqlCommentsLocal(str) {
    if (!str) return str;
    let out = str.replace(/\/\*[\s\S]*?\*\//gm, "");
    out = out.replace(/--.*$/gm, "");
    out = out
      .split(/\r?\n/)
      .map((line) => line.replace(/[ \t]+$/g, ""))
      .filter((line) => line.trim() !== "")
      .join("\n");
    return out;
  }

  // Lightweight, safer SQL formatter kept inline to avoid module parse issues.
  function formatSqlQueryLocal(input) {
    if (!input) return input;
    // Mask single-quoted strings (handles doubled single quotes '')
    const strings = [];
    const masked = input.replace(/'(?:[^']|'')*'/g, (m) => {
      const key = `__STR${strings.length}__`;
      strings.push(m);
      return key;
    });

    // Normalize whitespace (compact spaces, we'll preserve newlines later)
    let s = masked.replace(/\s+/g, ' ').trim();

    const kws = [
      'SELECT', 'FROM', 'WHERE', 'ORDER BY', 'GROUP BY', 'HAVING', 'LIMIT', 'OFFSET', 'JOIN', 'INNER JOIN', 'LEFT JOIN', 'RIGHT JOIN', 'FULL JOIN', 'CROSS JOIN', 'ON', 'INSERT INTO', 'VALUES', 'UPDATE', 'SET', 'DELETE', 'UNION'
    ];

    // Uppercase keywords first (multi-word first), then insert newline before them
    kws.sort((a,b) => b.length - a.length).forEach(kw => {
      const pat = kw.split(' ').join('\\s+');
      const re = new RegExp('\\b' + pat + '\\b', 'gi');
      s = s.replace(re, kw);
    });
    const kwsPattern = kws.map(k => k.replace(/ /g, '\\s+')).join('|');
    s = s.replace(new RegExp('\\b(' + kwsPattern + ')\\b', 'g'), '\n$1');

    // Ensure spaces around operators but preserve newlines
    s = s.replace(/([<>!=]=?|=)/g, ' $1 ').replace(/[ \t]+/g, ' ').trim();

    // Split into lines and format
    const lines = s.split(/\n+/).map(l => l.trim()).filter(Boolean);
    const out = [];
    lines.forEach(line => {
      if (/^SELECT\b/i.test(line)) {
        const rest = line.replace(/^SELECT\b/i, '').trim();
        out.push('SELECT');
        if (rest) {
          const cols = rest.split(',').map(c => c.trim()).filter(Boolean);
          cols.forEach((c, i) => out.push('  ' + c + (i === cols.length -1 ? '' : ',')));
        }
      } else {
        const kwMatch = line.match(/^(SELECT|FROM|WHERE|ORDER BY|GROUP BY|HAVING|LIMIT|OFFSET|VALUES|SET|INSERT INTO|UPDATE|DELETE|UNION|INNER JOIN|LEFT JOIN|RIGHT JOIN|FULL JOIN|CROSS JOIN|JOIN|ON)\b/i);
        if (kwMatch) {
          const kw = kwMatch[1].toUpperCase();
          const rest = line.slice(kwMatch[1].length).trim();
          if (rest) {
            out.push(kw);
            out.push('  ' + rest);
          } else {
            out.push(kw);
          }
        } else {
          out.push(line);
        }
      }
    });

    // Simple parentheses-based indentation
    const final = [];
    let depth = 0;
    out.forEach(line => {
      if (/^\)/.test(line)) depth = Math.max(0, depth - 1);
      final.push('  '.repeat(depth) + line);
      const opens = (line.match(/\(/g) || []).length;
      const closes = (line.match(/\)/g) || []).length;
      depth += opens - closes;
      if (depth < 0) depth = 0;
    });

    let result = final.join('\n');
    // restore strings
    strings.forEach((st, idx) => {
      result = result.replace(new RegExp(`__STR${idx}__`, 'g'), st);
    });

    // preserve trailing semicolon
    if (/;\s*$/.test(input.trim()) && !/;\s*$/.test(result)) result = result.trim() + ';';

    return result.trim();
  }


  function minifyCode(str) {
    let out = removeCodeComments(str);
    out = out.replace(/\s+/g, " ");
    out = out.replace(/>\s+</g, "><");
    return out.trim();
  }

  const [text, setText] = useState("");
  const [emails, setEmails] = useState([]);
  const undoStack = useRef([]);
  const redoStack = useRef([]);

  const handleUpClick = () => {
    undoStack.current.push(text);
    let newText = text.toUpperCase();
    setText(newText);
    props.showAlert("Converted to UPPERCASE!", "success");
    redoStack.current = [];
  };

  const handleLoClick = () => {
    undoStack.current.push(text);
    let newText = text.toLowerCase();
    setText(newText);
    props.showAlert("Converted to lowercase!", "success");
    redoStack.current = [];
  };

  const handleClearText = () => {
    undoStack.current.push(text);
    setText("");
    props.showAlert("Text Cleared!", "success");
    redoStack.current = [];
  };

  const handleOnChange = (event) => {
    undoStack.current.push(text);
    setText(event.target.value);
    redoStack.current = [];
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    props.showAlert("Copied to Clipboard!", "success");
  };

  const handleExtraSpace = () => {
    undoStack.current.push(text);
    let newText = text.split(/[ ]+/);
    setText(newText.join(" "));
    props.showAlert("Extra Spaces removed!", "success");
    redoStack.current = [];
  };

  const handleRemoveBlankLines = () => {
    undoStack.current.push(text);
    let newText = text.split(/\r?\n/).filter(line => line.trim() !== '').join('\n');
    setText(newText);
    props.showAlert("Blank lines removed!", "success");
    redoStack.current = [];
  };

  const handleRemoveComments = () => {
    undoStack.current.push(text);
    const newText = removeCodeComments(text);
    setText(newText);
    props.showAlert("Code comments removed!", "success");
    redoStack.current = [];
  };

  const handleRemoveSqlComments = () => {
    undoStack.current.push(text);
    const newText = removeSqlCommentsLocal(text);
    setText(newText);
    props.showAlert("SQL comments removed!", "success");
    redoStack.current = [];
  };

  const handleBeautifySql = () => {
    undoStack.current.push(text);
    const newText = formatSqlQueryLocal(text);
    setText(newText);
    props.showAlert("SQL formatted successfully!", "success");
    redoStack.current = [];
  };

  const handleMinifyCode = () => {
    undoStack.current.push(text);
    const newText = minifyCode(text);
    setText(newText);
    props.showAlert("Code minified!", "success");
    redoStack.current = [];
  };

  const handleUndo = () => {
    if (undoStack.current.length > 0) {
      redoStack.current.push(text);
      const prev = undoStack.current.pop();
      setText(prev);
      props.showAlert("Undo performed!", "info");
    }
  };

  const handleRedo = () => {
    if (redoStack.current.length > 0) {
      undoStack.current.push(text);
      const next = redoStack.current.pop();
      setText(next);
      props.showAlert("Redo performed!", "info");
    }
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

  return (
    <div>
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
          <button className="btn btn-secondary" onClick={handleUndo}>
            <span style={{ marginRight: "8px" }}>⮪</span>Undo
          </button>
          <button className="btn btn-secondary" onClick={handleRedo}>
            <span style={{ marginRight: "8px" }}>⮫</span>Redo
          </button>
          <button className="btn btn-secondary" onClick={handleClearText}>
            <span style={{ marginRight: "8px" }}>🗑️</span>Clear
          </button>
          <button className="btn btn-secondary" onClick={handleCopy}>
            <span style={{ marginRight: "8px" }}>📋</span>Copy
          </button>
          <button className="btn btn-secondary" onClick={handleRemoveComments}>
            <span style={{ marginRight: "8px" }}>🗑️</span>Remove Code Comments
          </button>
          <button className="btn btn-secondary" onClick={handleRemoveSqlComments}>
            <span style={{ marginRight: "8px" }}>🧾</span>Remove SQL Comments
          </button>
          <button className="btn btn-secondary" onClick={handleBeautifySql}>
            <span style={{ marginRight: "8px" }}>🎨</span>Beautify SQL
          </button>
          <button className="btn btn-secondary" onClick={findEmails}>
            <span style={{ marginRight: "8px" }}>📧</span>Find Emails
          </button>
          <button className="btn btn-primary" onClick={handleUpClick}>
            <span style={{ marginRight: "8px" }}>⬆️</span>Uppercase
          </button>
          <button className="btn btn-primary" onClick={handleLoClick}>
            <span style={{ marginRight: "8px" }}>⬇️</span>Lowercase
          </button>
          <button className="btn btn-primary" onClick={handleExtraSpace}>
            <span style={{ marginRight: "8px" }}>✨</span>Remove Spaces
          </button>
          <button className="btn btn-primary" onClick={handleRemoveBlankLines}>
            <span style={{ marginRight: "8px" }}>🧹</span>Remove Blank Lines
          </button>
          <button className="btn btn-primary" onClick={handleMinifyCode}>
            <span style={{ marginRight: "8px" }}>⚡</span>Minify Code
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
          <div className="stat-card" style={{
            padding: "1.5rem",
            borderRadius: "15px",
            background: props.mode === "dark" ? "rgba(52, 152, 219, 0.2)" : "rgba(44, 62, 80, 0.1)"
          }}>
            <h3 style={{ fontSize: "1.2rem", marginBottom: "0.5rem" }}>Total Lines</h3>
            <p style={{ fontSize: "2rem", fontWeight: "700", margin: 0 }}>
              {text ? text.split(/\r\n|\r|\n/).length : 0}
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
    </div>
  );
}