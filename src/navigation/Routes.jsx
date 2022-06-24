import { Login, Dashboard, Home, Register } from "../pages";
import { Redirect, Route } from "react-router-dom";
import PrivateRoutes from "./PrivateRoutes";
import { DashBoardLayOut } from "../components/layouts/dashBoard";
import { RoutesConstant, StringConstant } from "../assets/constants";
import React, { useContext, useState, useEffect } from "react";

export default () => {
  return [
    <PrivateRoutes
      exact
      key="dashBoard"
      path={RoutesConstant.dashboard}
      component={Dashboard}
      isLayOut={true}
      Layout={DashBoardLayOut}
      accessLevel={StringConstant.admin}
    />,
    <Route
      exact
      key="register"
      path={RoutesConstant.register}
      component={Register}
    />,
    <Route exact key="login" path={RoutesConstant.login} component={Login} />,
    <Route key="root" path="/" component={Home} />,
  ];
};
