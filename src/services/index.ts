<<<<<<< HEAD
<<<<<<< HEAD
import { getUserInfo, signOut, getAdmin, addAdmin } from "./user";
import { getDeviceMac, getDevicePoster } from "./device";

export { getUserInfo, signOut, getDeviceMac, getDevicePoster, getAdmin, addAdmin };
=======
import { getUserInfo, signOut } from "./user";
import { getAdmin, addAdmin, deleteAdmin } from "./admin";
import { getDeviceMac, getDevicePoster } from "./device";
=======
import { getUserInfo, getAllUser, signOut } from "./user";
import { addAdmin, deleteAdmin } from "./admin";
import { getDevice, addDevice, editDevice, deleteDevice } from "./device";
import { getPoster } from "./poster";
import { getPosterEachDevice } from "./pi";
>>>>>>> 1d20848325e1254eb69ca835dbb098e6ab3ad6b8

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
  getPosterEachDevice,
};
>>>>>>> 14efc6c68c71d7e93c5cdee43b7bda2d446e7b43
