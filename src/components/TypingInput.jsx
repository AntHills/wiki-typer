import { wikiText } from "../scripts/wikiText.js";
import React, { useState, useRef, useEffect } from "react";

function TypingInput() {
  const [typedText, setTypedText] = useState("");
  const [correctIndex, setCorrectIndex] = useState(0);
  const [incorrectIndex, setIncorrectIndex] = useState();
  const wikiTextElementRef = useRef(null);
  const typedElementRef = useRef(null);
  const typedIncorrectElementRef = useRef(null);
  const untypedElementRef = useRef(null);

  useEffect(() => {
    validateTextTyped();
  }, [typedText]);

  function validateTextTyped() {
    const needsCheckingWiki = wikiText.slice(correctIndex, typedText.length);
    const needsCheckingTyped = typedText.slice(correctIndex, typedText.length);

    if (needsCheckingTyped === needsCheckingWiki) {
      setCorrectIndex(typedText.length);
      setIncorrectIndex(null);
    } else if (!incorrectIndex) {
      setIncorrectIndex(typedText.length - 1);
    }
    /*
    const wikiTextSpread = wikiText.split("", typedText.length);
    console.log(wikiTextSpread);
    const typedTextSpread = [...typedText];
    console.log(typedTextSpread);

    if (JSON.stringify(wikiTextSpread) === JSON.stringify(typedTextSpread)) {
      return true;
    } else {
      return false;
    }
      */
  }

  function displayIncorrectText() {
    let text = "";
    if (incorrectIndex) {
      text = typedText.slice(incorrectIndex, typedText.length);
      return text;
    }
  }

  function displayTypedText() {
    const text = typedText.slice(0, correctIndex);
    return text;
  }

  function displayUntypedText() {
    const untypedText = wikiText.slice(typedText.length, wikiText.length);
    return untypedText;
  }

  return (
    <>
      <div className="input-container" ref={wikiTextElementRef}>
        <span className="typed">{displayTypedText()}</span>
        <span className="typed-error">{displayIncorrectText()}</span>
        <span className="untyped">{displayUntypedText()}</span>
        <input
          value={typedText}
          type="text"
          className="typing-input"
          onChange={(e) => {
            setTypedText(e.target.value);
          }}
          data-form-type="other"
        />
      </div>
    </>
  );
}

export default TypingInput;
