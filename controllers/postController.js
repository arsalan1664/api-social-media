import { Prisma } from "@prisma/client";
import prisma from "../prisma/Prisma.js";
import { upload } from "../utils/multer.js";
import path from "path";
import fs from "fs/promises";

// Get all thoughts
export const getAllPosts = async (req, res) => {
  try {
    const post = await prisma.post.findMany();
    res.status(200).json(post);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//create post
export const createPost = async (req, res) => {
  try {
    upload.single("image")(req, res, async (err) => {
      if (err) {
        return res.status(400).json({ message: err });
      }

      const { userId, postText, videoURL } = req.body;

      let imageURL = req.file ? `/uploads/${req.file.filename}` : ""; // Assuming upload dir structure

      const user = await prisma.user.findFirst({
        where: { userId },
      });

      if (!user) {
        return res.status(400).json({ message: "Invalid User" });
      }

      const newPost = await prisma.post.create({
        data: {
          username: user.username,
          postText,
          videoURL,
          imageURL,
          User: { connect: { id: user.id } },
        },
      });

      res.status(201).json(newPost);
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to create post!" });
  }
};

// Get a single Post by ID
export const getPost = async (req, res) => {
  try {
    const Post = await prisma.post.findUnique({
      where: {
        id: req.params.postId,
      },
    });

    if (!Post) {
      return res.status(404).json({ message: "Post not found" });
    }
    res.status(200).json(Post);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// // Update a Post
export const updatePost = async (req, res) => {
  try {
    const { userId, postText } = req.body;

    const { postId } = req.params.postId;

    const post = await prisma.post.findFirst({
      where: postId,
    });

    if (!post) return res.status(404).json({ message: "Post not found" });

    if (post.userId !== userId) {
      return res
        .status(404)
        .json({ message: "You're not authorized to Update this post" });
    }

    const updatedPost = await prisma.post.update({
      where: { id: req.params.postId },
      data: {
        postText,
      },
    });

    res.status(200).json(updatedPost);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// // Delete a Post
export const deletePost = async (req, res) => {
  try {
    const { userId } = req.body;

    const { postId } = req.params.postId;

    const post = await prisma.post.findFirst({
      where: postId,
    });

    if (!post) return res.status(404).json({ message: "Post not found" });
    console.log(req.body.userId, post.userId);
    if (post.userId !== userId) {
      return res
        .status(404)
        .json({ message: "You're not authorized to Update this post" });
    }

    // Delete the post
    await prisma.post.delete({
      where: { id: req.params.postId },
      include: { reactions: true },
    });

    // Delete the image file
    if (post.imageURL) {
      const filePath = path.join(".", "uploads", path.basename(post.imageURL)); // Adjust path if needed
      try {
        await fs.rm(filePath);
      } catch (error) {
        console.error(`Error deleting image file: ${error}`);
      }
    }

    res.status(200).json({ message: "Post deleted successfully" });
  } catch (error) {
    console.error(error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      res.status(400).json({ message: error.message });
    } else {
      res.status(500).json({ message: "Internal server error" });
    }
  }
};
