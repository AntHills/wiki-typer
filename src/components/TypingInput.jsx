import { wikiText } from "../scripts/wikiText.js";
import React, { useState, useRef, useEffect } from "react";

function TypingInput() {
  const [typedText, setTypedText] = useState("");
  const wikiTextElementRef = useRef(null);

  useEffect(() => {
    validateTextTyped();
  }, [typedText]);

  function validateTextTyped() {
    const wikiTextSpread = wikiText.split("", typedText.length);
    console.log(wikiTextSpread);
    const typedTextSpread = [...typedText];
    console.log(typedTextSpread);

    if (JSON.stringify(wikiTextSpread) === JSON.stringify(typedTextSpread)) {
      return true;
    } else {
      return false;
    }
  }

  function displayFormattedText() {
    let inputHTML = [];

    // Check typed

    // get remaining text
    const untypedHTML = <span className="untyped">{wikiText}</span>;
    console.log(untypedHTML);
    inputHTML.push(untypedHTML);
    console.log(inputHTML);
    return inputHTML;
  }

  return (
    <>
      <div className="input-container" ref={wikiTextElementRef}>
        {wikiText}
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
