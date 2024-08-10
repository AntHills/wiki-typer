import {
  getRandomWiki,
  getTypeText,
  getWikiPageText,
  wikiText,
  wikiPage,
} from "../scripts/wikiText.js";
import React, { useState, useEffect, useRef, useLayoutEffect } from "react";
import TypingInput from "./TypingInput.jsx";

function WikiTyper() {
  const [isLoading, setIsLoading] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [rawWPM, setRawWPM] = useState(0);
  const [charactersTyped, setCharactersTyped] = useState(0);
  const intervalIdRef = useRef(null);
  const startTimeRef = useRef(0);

  useEffect(() => {
    loadText();
  }, []);

  useEffect(() => {
    if (isRunning) {
      intervalIdRef.current = setInterval(() => {
        setElapsedTime(Date.now() - startTimeRef.current);
      }, 10);
    }

    return () => {
      clearInterval(intervalIdRef.current);
    };
  }, [isRunning]);

  useLayoutEffect(() => {
    if (isRunning) {
      calculateRawWPM();
    }
  }, [elapsedTime]);

  function start() {
    setIsRunning(true);
    startTimeRef.current = Date.now() - elapsedTime;
  }

  function finish() {
    setIsRunning(false);
    setCharactersTyped(0);
  }

  function reset() {
    setIsRunning(false);
    setRawWPM(0);
    setElapsedTime(0);
    setCharactersTyped(0);
  }

  function calculateRawWPM() {
    const rawWPM = charactersTyped / 5 / (elapsedTime / 60000);

    setRawWPM(rawWPM.toFixed(0));
  }

  function formatTime() {
    let hours = Math.floor(elapsedTime / (1000 * 60 * 60));
    let minutes = Math.floor((elapsedTime / (1000 * 60)) % 60);
    let seconds = Math.floor((elapsedTime / 1000) % 60);
    let milliseconds = Math.floor((elapsedTime % 1000) / 10);

    hours = String(hours).padStart(2, "0");
    minutes = String(minutes).padStart(2, "0");
    seconds = String(seconds).padStart(2, "0");
    milliseconds = String(milliseconds).padStart(2, "0");

    return `${minutes}:${seconds}:${milliseconds}`;
  }

  async function loadText() {
    setIsLoading(true);
    await getTypeText();
    if (!wikiText) {
      await getTypeText();
    }
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
              <h1 className="page-name">{isLoading ? "Loading" : wikiPage}</h1>
              <div className="wpm-container">
                <span className="raw-wpm-display">{rawWPM}</span>
                <span className="raw-wpm-display-label">WPM</span>
              </div>
              <div className="stats-container">
                <p>
                  Character count: {isLoading ? "Loading" : wikiText.length}
                </p>

                <br />
                <span className="time-display">Time: {formatTime()}</span>
              </div>
            </div>
            <div className="input-container">
              {isLoading ? (
                "Fetching random wikipedia text"
              ) : (
                <TypingInput
                  start={() => {
                    start();
                  }}
                  setCharactersTyped={setCharactersTyped}
                  finish={finish}
                />
              )}
            </div>
            <div className="controls-container">
              <button
                className="new-text-button"
                onClick={() => {
                  reset();
                  loadText();
                }}
              >
                New text
              </button>
            </div>
          </div>
          <div className="right-sidebar"></div>
        </div>
      </div>
    </>
  );
}

export default WikiTyper;
