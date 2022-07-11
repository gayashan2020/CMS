import { Route, Redirect } from "react-router-dom";
import { getAccessToken, getUser } from "../config/LocalStorage";
import { RoutesConstant } from "../assets/constants";

const PrivateRoutes = ({
  exact,
  key,
  path,
  component: Component,
  isLayOut,
  Layout,
  accessLevel,
}) => {
  const checkAccess = () => {
    if (getAccessToken()) {
      return true;
    } else return false;
  };
  return (
    <Route
      exact={exact}
      key={key}
      path={path}
      render={(props) => {
        return checkAccess() ? (
          isLayOut ? (
            <Layout>
              <Component {...props} />
            </Layout>
          ) : (
            <Component {...props} />
          )
        ) : (
          <Redirect to={RoutesConstant.login} />
        );
      }}
    />
  );
};

export default PrivateRoutes;
