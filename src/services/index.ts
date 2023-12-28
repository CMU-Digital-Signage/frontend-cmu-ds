<<<<<<< HEAD
import { getUserInfo, signOut, getAdmin, addAdmin } from "./user";
import { getDeviceMac, getDevicePoster } from "./device";

export { getUserInfo, signOut, getDeviceMac, getDevicePoster, getAdmin, addAdmin };
=======
import { getUserInfo, signOut } from "./user";
import { getAdmin, addAdmin, deleteAdmin } from "./admin";
import { getDeviceMac, getDevicePoster } from "./device";

export {
  getUserInfo,
  signOut,
  getAdmin,
  addAdmin,
  deleteAdmin,
  getDeviceMac,
  getDevicePoster,
};
>>>>>>> 14efc6c68c71d7e93c5cdee43b7bda2d446e7b43
