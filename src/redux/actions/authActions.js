import { apis } from "../../apis";
import { i18n } from "../../i18n";
import { storage } from "../../utils/storage";
import {
  LOGIN_FALIED,
  LOGIN_SUCCESS,
  LOGOUT,
  SET_ROLES,
  SET_USERNAME,
} from "../actionTypes";
import { store } from "../store";

export const logout = async () => {
  try {
    await storage.removeItem("token");
    store.dispatch({ type: LOGOUT });
  } catch (error) {}
};
