import { getUserInfo, getAllUser, signOut } from "./user";
import { addAdmin, deleteAdmin } from "./admin";
import { getDevice, addDevice, editDevice, deleteDevice } from "./device";
import { getPoster, addPoster } from "./poster";
import {
  getEmergency,
  addEmergency,
  editEmergency,
  deleteEmergency,
} from "./emergency";
import { getPosterEachDevice } from "./pi";

export {
  getUserInfo,
  getAllUser,
  signOut,
  addAdmin,
  deleteAdmin,
  getDevice,
  addDevice,
  editDevice,
  deleteDevice,
  getPoster,
  addPoster,
  getEmergency,
  addEmergency,
  editEmergency,
  deleteEmergency,
  getPosterEachDevice,
};
