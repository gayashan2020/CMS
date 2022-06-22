import React from "react";
import { useHistory } from "react-router-dom";
import {
  $Dropdown,
  $Menu,
  $AntIcons,
  $Avatar,
  $Image,
  $Button,
} from "../../../antd";
import {
  getUser,
  removeAccessToken,
  removeUser,
} from "../../../../config/LocalStorage";

import "./Header.scss";
import avater from "../../../../assets/images/avater.png";
const Header = (props) => {
  const history = useHistory();

  const handleLogOut = async () => {
    try {
      removeAccessToken();
      removeUser();
      history.push("/login");
    } catch (error) {}
  };

  const handleProfile = async () => {
    // try {
    //   history.push("/edit_profile");
    // } catch (error) {}
  };

  const currentUser = JSON.parse(getUser());
  const { UserOutlined, DownOutlined } = $AntIcons;

  function handleButtonClick(e) {}

  function handleMenuClick(e) {}

  const displayProfileImage = (currentUser) => {
    try {
      if (currentUser.imageUrl) {
        // return config.imageFolder + currentUser.imageUrl;
      } else {
        return {avater};
      }
    } catch (error) {
      return {avater};
    }
  };

  const menu = (
    <$Menu onClick={handleMenuClick} className="top-bar-dropdown">
      <$Menu.Item key="1" icon={<UserOutlined />} onClick={handleLogOut}>
        Log Out
      </$Menu.Item>
    </$Menu>
  );
  return (
    <div className="top-header">
      <div className="topbar-btn-wrapper">
        <$Avatar src={displayProfileImage(currentUser)} />
        <$Dropdown
          overlay={menu}
          placement="bottomRight"
          className="topbar-btn"
          trigger={["click"]}
        >
          <$Button>{'User'}</$Button>
        </$Dropdown>
      </div>
    </div>
  );
};
export default Header;
