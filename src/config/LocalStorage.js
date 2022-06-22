import { StringConstant } from "../assets/constants";

export function setAccessToken(token) {
  localStorage.setItem(StringConstant.Token, token);
}

export function getAccessToken() {
  return localStorage.getItem(StringConstant.Token);
}

export function removeAccessToken() {
  return localStorage.removeItem(StringConstant.Token);
}

export function setUser(user) {
  localStorage.setItem(StringConstant.User, user);
}
export function getUser() {
  return localStorage.getItem(StringConstant.User);
}
export function removeUser() {
  return localStorage.removeItem(StringConstant.User);
}

export default {
  setAccessToken,
  getAccessToken,
  removeAccessToken,
  setUser,
  getUser,
};
