import {
  getUserInfo,
  getAllUser,
  signOut,
  setPassword,
  changePassword,
} from "./user";
import { addAdmin, deleteAdmin } from "./admin";
import {
  getDevice,
  addDeviceTV,
  addDevicePi,
  editDevice,
  deleteDevice,
} from "./device";
import {
  searchPoster,
  getPoster,
  addPoster,
  editPoster,
  deletePoster,
} from "./poster";
import {
  getEmergency,
  addEmergency,
  editEmergency,
  deleteEmergency,
  activateEmergency,
  deactivateEmergency,
} from "./emergency";
import { getPosterEachDevice, turnOnOffDevice } from "./pi";
import { sendEmail } from "./email";
import { getIframe } from "./proxy";

export {
  getIframe,
  getUserInfo,
  getAllUser,
  signOut,
  addAdmin,
  deleteAdmin,
  getDevice,
  addDeviceTV,
  addDevicePi,
  editDevice,
  deleteDevice,
  searchPoster,
  getPoster,
  addPoster,
  editPoster,
  deletePoster,
  getEmergency,
  addEmergency,
  editEmergency,
  deleteEmergency,
  activateEmergency,
  deactivateEmergency,
  getPosterEachDevice,
  setPassword,
  changePassword,
  sendEmail,
  turnOnOffDevice,
};
