import { wikiText } from "../scripts/wikiText.js";
import React, { useState, useRef, useEffect, useLayoutEffect } from "react";

function TypingInput() {
  const [typedText, setTypedText] = useState("");
  const [correctIndex, setCorrectIndex] = useState(0);
  const [incorrectIndex, setIncorrectIndex] = useState();
  const [hasStarted, setHasStarted] = useState(false);
  const [hasFinished, setHasFinished] = useState(false);
  const wikiTextElementRef = useRef(null);

  useLayoutEffect(() => {
    validateTextTyped();
  }, [typedText]);

  function validateTextTyped() {
    const needsCheckingWiki = wikiText.slice(correctIndex, typedText.length);
    const needsCheckingTyped = typedText.slice(correctIndex, typedText.length);
    console.log(`Checking wiki: ${needsCheckingWiki}`);
    console.log(`Checking typed: ${needsCheckingTyped}`);

    if (needsCheckingTyped === needsCheckingWiki) {
      setCorrectIndex(typedText.length);
      setIncorrectIndex(null);
    } else if (!incorrectIndex) {
      setIncorrectIndex(typedText.length - 1);
    }
  }

  function displayIncorrectText() {
    if (incorrectIndex) {
      return (
        <span className="typed-error">
          {typedText.slice(incorrectIndex, typedText.length)}
        </span>
      );
    }
  }

  function displayTypedText() {
    return <span className="typed">{typedText.slice(0, correctIndex)}</span>;
  }

  function displayUntypedText() {
    return (
      <span className="untyped">
        {wikiText.slice(typedText.length, wikiText.length)}
      </span>
    );
  }

  return (
    <>
      <div className="input-container" ref={wikiTextElementRef}>
        {displayTypedText()}
        {displayIncorrectText()}
        {displayUntypedText()}
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
