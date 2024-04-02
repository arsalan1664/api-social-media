import express from "express";
import {
  createPost,
  deletePost,
  getAllPosts,
  getPost,
  updatePost,
} from "../controllers/postController.js";
import {
  createReaction,
  deleteReaction,
} from "../controllers/reactionController.js";
import { requireSignin } from "../utils/authMiddleware.js";

const router = express.Router();

//post routes
router.get("/", getAllPosts);
router.post("/", createPost);
router.get("/:postId", getPost);
router.put("/:postId", updatePost);
router.delete("/:postId", deletePost);

//reactions routes
router.post("/:postId/reactions", createReaction);
router.delete("/:postId/reactions/:reactionId", deleteReaction);

//comment routes
router.post("/:postId/comments", createReaction);
router.delete("/:postId/comments/:commentId", deleteReaction);

export default router;
