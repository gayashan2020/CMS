import React, { useState } from "react";
import "./Layout.scss";
// import { LayoutHeader } from "/layouts/DashBoard/Header";
import { LayoutHeader } from "../header";
// import { DashBoard } from "components/STComponents";
import { $Button, $Layout, $Menu, $AntIcons, $Row } from "../../../antd";
import { useHistory, useLocation } from "react-router";
import { RoutesConstant } from "../../../../assets/constants";
import {
  getUser,
  getAccessToken,
  removeAccessToken,
  removeUser,
} from "../../../../config/LocalStorage";
const {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  HomeOutlined,
  LogoutOutlined,
  BookOutlined,
  ShoppingCartOutlined,
  ToolOutlined,
  UserOutlined,
  FileDoneOutlined,
  IdcardOutlined,
  PaperClipOutlined,
} = $AntIcons;

const Layout = (props) => {
  // const { userRole, getRole } = props;

  const [isCollapsed, setCollapsed] = useState(false);
  const history = useHistory();
  const location = useLocation();
  const toggleCollapse = () => {
    isCollapsed ? setCollapsed(false) : setCollapsed(true);
  };
  const userRole = JSON.parse(getAccessToken()).role;
  const userStatus = JSON.parse(getAccessToken()).status;

  let Mainmenu = [
    <HomeOutlined />,
    <FileDoneOutlined />,
    <PaperClipOutlined />,
    <UserOutlined />,
    <IdcardOutlined />,
    <LogoutOutlined />,
  ];

  const navigation = (url) => {
    // console.log(url);
    history.push(`${url}`);
  };

  // console.log("currentAccess", currentAccess);

  const handleLogOut = async () => {
    try {
      removeAccessToken();
      removeUser();
      history.push("/login");
    } catch (error) {}
  };

  const getMainPath = () => {
    let parm = location.pathname.toString();
    let parmArray = [parm];
    console.log(parmArray);
    let index = 1;
    while (parm.indexOf("/", index) > 0) {
      parmArray.push(parm.substring(0, parm.indexOf("/", index)));
      index = parm.indexOf("/", index) + 1;
    }
    return parmArray;
  };
  return (
    <>
      <LayoutHeader />
      <$Layout className={"main-container" + (isCollapsed ? " collapsed" : "")}>
        <div className={"side-nav"}>
          <div className="btn-collapse">
            <$Button type="primary" onClick={toggleCollapse}>
              {React.createElement(
                isCollapsed ? MenuUnfoldOutlined : MenuFoldOutlined
              )}
            </$Button>
          </div>
          {userStatus && userStatus === "approved" && (
            <$Menu
              defaultSelectedKeys={[RoutesConstant.userProfile]}
              mode="inline"
              theme="dark"
              inlineCollapsed={isCollapsed}
              selectedKeys={getMainPath()}
              defaultOpenKeys={getMainPath()}
            >
              <$Menu.Item
                key={RoutesConstant.userProfile}
                icon={Mainmenu[0]}
                onClick={() => history.push(RoutesConstant.userProfile)}
              >
                User Profile
              </$Menu.Item>
              {userRole && userRole === "admin" && (
                <$Menu.Item
                  key={RoutesConstant.dashboard}
                  icon={Mainmenu[0]}
                  onClick={() => history.push(RoutesConstant.dashboard)}
                >
                  Dashboard
                </$Menu.Item>
              )}
              <$Menu.Item
                key={RoutesConstant.courses}
                icon={Mainmenu[1]}
                onClick={() => history.push(RoutesConstant.courses)}
              >
                Courses
              </$Menu.Item>
              {userRole && userRole === "admin" && (
                <$Menu.Item
                  key={RoutesConstant.users}
                  icon={Mainmenu[1]}
                  onClick={() => history.push(RoutesConstant.users)}
                >
                  Users
                </$Menu.Item>
              )}
              {userRole && (userRole === "mentor" || userRole === "admin") && (
                <$Menu.Item
                  key={RoutesConstant.enroll}
                  icon={Mainmenu[1]}
                  onClick={() => history.push(RoutesConstant.enroll)}
                >
                  Enroll
                </$Menu.Item>
              )}
              <$Menu.Item
                key="logOut"
                onClick={handleLogOut}
                icon={Mainmenu[5]}
              >
                Log Out
              </$Menu.Item>
            </$Menu>
          )}
        </div>

        <div className="content-container">{props.children}</div>
      </$Layout>
    </>
  );
};

export default Layout;
