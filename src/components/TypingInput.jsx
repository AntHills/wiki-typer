import { wikiText } from "../scripts/wikiText.js";
import React, { useState, useRef, useEffect, useLayoutEffect } from "react";

function TypingInput({ start, setCharactersTyped, finish }) {
  const [typedText, setTypedText] = useState("");
  const [correctIndex, setCorrectIndex] = useState(0);
  const [incorrectIndex, setIncorrectIndex] = useState();
  const [isRunning, setIsRunning] = useState(false);
  const [isEnded, setIsEnded] = useState(false);

  useLayoutEffect(() => {
    validateTextTyped();
  }, [typedText]);

  function validateTextTyped() {
    const needsCheckingWiki = wikiText.slice(correctIndex, typedText.length);
    const needsCheckingTyped = typedText.slice(correctIndex, typedText.length);

    if (typedText.length > 0 && !isRunning) {
      setIsRunning(true);
      start();
    }

    if (needsCheckingTyped === needsCheckingWiki) {
      setCorrectIndex(typedText.length);
      setIncorrectIndex(null);
      if (typedText.length === wikiText.length) {
        finish();
        setIsRunning(false);
        setIsEnded(true);
      }
    } else if (!incorrectIndex) {
      setIncorrectIndex(typedText.length - 1);
    }

    setCharactersTyped(typedText.length);
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
        disabled={isEnded ? true : false}
      />
    </>
  );
}

export default TypingInput;
