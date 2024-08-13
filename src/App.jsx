import WikiTyper from "./components/WikiTyper.jsx";
import ReactGA from "react-ga4";
import React, { useEffect } from "react";

ReactGA.initialize("G-G920F54PPT");

function App() {
  useEffect(() => {
    ReactGA.send({ hitType: "pageview", page: window.location.pathname });
  }, []);

  return (
    <>
      <WikiTyper />
    </>
  );
}

export default App;
