import React from "react";
import { useLocation, Link } from "react-router-dom";
import { Breadcrumb } from "antd";
import "./PageHeader.scss";

const $PageHeader = () => {
  const location = useLocation();
  const checkRoute = (val) => {
    if (
      (val.split("/")[1] === "requests" &&
        val.split("/").length == 2) ||
      (val.split("/")[1] === "administrative" && val.split("/").length == 2) ||
      (val.split("/")[1] === "users" && val.split("/").length == 2)
    ) {
      return true;
    } else {
      return false;
    }
  };

  //breadcrumbs will be taken from url and each section will be mapped
  const breadCrumbView = () => {
    const { pathname } = location;
    const pathnames = pathname.split("/").filter((item) => item);
    const capatilize = (s) => {
      switch (s) {
        case "maintenanceRequests":
          return "Maintenance Requests";

        case "reviewRequests":
          return "Review Requests";

        case "registeredUsers":
          return "Registered Users";

        case "userRequests":
          return "User Requests";

        case "apply_purchase_requests":
          return "Purchase Requests";
        
        case "addLocation":
          return "Add Location";

        case "tasks":
          return "Tasks";

        default:
          return s.charAt(0).toUpperCase() + s.slice(1).split("_");
      }
    };

    return (
      <div className="page-header">
        <Breadcrumb>
          {pathnames.length > 0 ? (
            <Breadcrumb.Item>
              <Link to="/dashboard">Home</Link>
            </Breadcrumb.Item>
          ) : (
            <Breadcrumb.Item>Home</Breadcrumb.Item>
          )}
          {pathnames.map((name, index) => {
            const routeTo = `/${pathnames.slice(0, index + 1).join("/")}`;
            const isLast = index === pathnames.length - 1;
            return isLast ? (
              <Breadcrumb.Item>
                {capatilize(name).replace("_", " ")}
              </Breadcrumb.Item>
            ) : checkRoute(routeTo) ? (
              <Breadcrumb.Item>
                {capatilize(name).replace("_", " ")}
              </Breadcrumb.Item>
            ) : (
              <Breadcrumb.Item>
                <Link to={`${routeTo}`}>
                  {capatilize(name).replace("_", " ")}
                </Link>
              </Breadcrumb.Item>
            );
          })}
        </Breadcrumb>
      </div>
    );
  };

  return <>{breadCrumbView()}</>;
};

export default $PageHeader;
