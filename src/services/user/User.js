import { httpCollection } from "../http";

const subURL = "/user/";

export default {
  login: async function (params) {
    let { data } = await httpCollection.getData(subURL + "user_login", params);
    return data;
  },

  get_users: async function (params) {
    let { data } = await httpCollection.postData(subURL + "users", params);
    return data;
  },

  editUser: async function (params, id) {
    let { data } = await httpCollection.putData(subURL + "edit_user/" + id + "/",params);
    return data;
  },

  editUserStatus: async function (id,params) {
    let { data } = await httpCollection.putData(subURL + "change_user_statues/" + id + "/",params);
    return data;
  },
};
