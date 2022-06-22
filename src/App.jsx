import React from "react";
import { BrowserRouter, Switch } from "react-router-dom";
import { appRoutes } from "./navigation";


const App = (props) => {
  let routes = <Switch>{appRoutes()}</Switch>;

  return (
    <div>

        <BrowserRouter>{routes}</BrowserRouter>

    </div>
  );
};

export default App;