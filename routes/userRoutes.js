import express from "express";
import {
  deleteUser,
  getAllUsers,
  getUser,
  updateUser,
} from "../controllers/userController.js";
import {
  addFriend,
  getAllFriends,
  unfriend,
} from "../controllers/friendController.js";

const router = express.Router();

// user routes
router.get("/", getAllUsers);
router.get("/:userId", getUser);
router.put("/:userId", updateUser);
router.delete("/:userId", deleteUser);

//friend Routes
router.get("/:userId/friends", getAllFriends);
router.post("/:userId/friends/", addFriend);
router.delete("/:userId/friends/:friendsId", unfriend);

export default router;
