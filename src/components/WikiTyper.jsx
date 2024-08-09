import {
  getRandomWiki,
  getTypeText,
  getWikiPageText,
  wikiText,
  wikiPage,
} from "../scripts/wikiText.js";
import React, { useState, useEffect } from "react";
import TypingInput from "./TypingInput.jsx";

function WikiTyper() {
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadText();
  }, []);

  async function loadText() {
    setIsLoading(true);
    await getTypeText();
    setIsLoading(false);
  }

  return (
    <>
      <div className="container">
        <h1>Wiki Typer</h1>
        <div className="app-container">
          <div className="left-sidebar"></div>
          <div className="typing-container">
            <div className="typing-header">
              <h1>{isLoading ? "Loading" : wikiPage}</h1>
              <div className="stats-container">
                <p>
                  Character count: {isLoading ? "Loading" : wikiText.length}
                </p>
              </div>
            </div>
            {isLoading ? "Loading" : <TypingInput />}
            <div className="controls-container">
              <button onClick={loadText}>New text</button>
              <button>Reset</button>
            </div>
          </div>
          <div className="right-sidebar"></div>
        </div>
      </div>
    </>
  );
}

export default WikiTyper;
