import axios from "axios";
import {
  getAccessToken,
  setAccessToken,
  removeAccessToken,
} from "../../config/LocalStorage";

import { $Message } from "../../components/antd";

const instance = axios.create({
  // baseURL: "http://localhost:8081/api",
  baseURL: process.env.REACT_APP_API_URL,
  responseType: "json",
  headers: {
    "Content-Type": "application/json",
  },
});

const http = {
  getData: async function (url, parm) {
    let response;
    await instance({
      method: "GET",
      url: url,
      params: parm,
      headers: { "x-access-token": getAccessToken() },
    })
      .then((res) => {
        response = res.data;
      })
      .catch(async (err) => {
        let errorObj = await setError(err);

        response = { data: errorObj.data, reCall: errorObj.reCall };
      });
    return response;
  },

  postData: async function (url, data, extraHeaders, parm) {
    let response;
    await instance({
      method: "POST",
      headers: { "x-access-token": getAccessToken(), extraHeaders },
      url: url,
      data: data,
      params: parm,
    })
      .then((res) => {
        response = res.data;
      })
      .catch(async (err) => {
        let errorObj = await setError(err);
        response = { data: errorObj.data, reCall: errorObj.reCall };
      });
    return response;
  },

  putData: async function (url, data, extraHeaders, parm) {
    let response;
    await instance({
      method: "PUT",
      headers: { "x-access-token": getAccessToken(), extraHeaders },
      url: url,
      data: data,
      params: parm,
    })
      .then((res) => {
        response = res.data;
      })
      .catch(async (err) => {
        let errorObj = await setError(err);
        response = { data: errorObj.data, reCall: errorObj.reCall };
      });
    return response;
  },

  deleteData: async function (url, data, extraHeaders, parm) {
    let response;
    await instance({
      method: "DELETE",
      headers: { "x-access-token": getAccessToken(), extraHeaders },
      url: url,
      data: data,
      params: parm,
    })
      .then((res) => {
        response = res.data;
      })
      .catch(async (err) => {
        let errorObj = await setError(err);
        response = { data: errorObj.data, reCall: errorObj.reCall };
      });
    return response;
  },
};
export default http;

async function setError(error) {
  if (!error.response) {
    // network error
    console.log("error at start");
    $Message.error("Network Error");
  } else {
    const originalRequest = error.config;

    if (error.response.data) {
      if (error.response.data.message != "Failed to authenticate token.") {
        $Message.error(error.response.data.message);
      }
    } else {
      console.log("error at error.response.statusText");
      $Message.error(error.response.statusText);
    }
    if (error.response.status === 403) {
      console.log("error because not authorized");
      $Message.error("Not Authorized");
    }
    if (error.response.status === 401 && !getAccessToken()) {
      let reCall = false,
        data = null;
      console.log("error because token not available");
      return { data: data, reCall: reCall };
    }
    // if (
    //   getRefreshToken() &&
    //   error.response.status === 401 &&
    //   !originalRequest._retry
    // ) {
    //   let reCall = false,
    //     data = null;
    //   await instance({
    //     method: "GET",
    //     url: "/employee/get_token",
    //     headers: { "x-access-token": getRefreshToken() },
    //   })
    //     .then(async (res) => {
    //       if (res.status === 200) {
    //         setAccessToken(res.data.data.token);
    //         originalRequest.headers["x-access-token"] = res.data.data.token;

    //         if (originalRequest.url.toString().includes("get_access_levels")) {
    //           return (reCall = true);
    //         }
    //         data = await axios(originalRequest);
    //       }
    //     })
    //     .catch(async (err) => {
    //       if (err.response.status === 401) {
    //         console.log("error at catch 401");
    //         try {
    //           $Message.error("error at catch 401 at Login - Not Authorized");
    //           History.push("./Login");
    //         } catch (error) {
    //           $Message.error("error at catch 401 - Not Authorized");
    //           removeAccessToken();
    //           removeRefreshToken();
    //           window.location.reload();
    //         }
    //       } else {
    //         console.log("error at catch other");
    //       }
    //     });
    //   return { data: data, reCall: reCall };
    // }
    // if (getRefreshToken() && error.response.status === 401) {
    //   console.log("error after get token");
    // }
  }
}
