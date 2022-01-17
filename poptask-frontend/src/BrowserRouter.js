import React, { useState, useCallback } from "react";
import { createBrowserHistory } from "history";
import Context from "../context";

const BrowserRouter = props => {
  const history = createBrowserHistory();
  const [location, setLocation] = useState(history.location);

  const computeRootMatch = useCallback(pathname => {
    return { path: "/", url: "/", params: {}, isExact: pathname === "/" };
  }, []);

  history.listen(location => {
    setLocation(location);
  });

  return (
    <Context.Provider
      value={{ history, location, match: computeRootMatch(location.pathname) }}
    >
      {props.children}
    </Context.Provider>
  );
};

export default BrowserRouter;