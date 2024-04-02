import prisma from "../prisma/Prisma.js";
import { getUserById } from "../prisma/db-operations.js";

// Get all users
export const getAllUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get a single user by ID
export const getUser = async (req, res) => {
  try {
    const user = await getUserById(req.params.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update a user
export const updateUser = async (req, res) => {
  try {
    if (req.body.userId !== req.params.userId) {
      return res
        .status(404)
        .json({ message: "You're not authorized to update user" });
    }
    const updatedUser = await prisma.User.update({
      where: {
        id: req.params.userId,
      },
      data: {
        post: req.body.post.postId,
      },
    });
    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete a user
export const deleteUser = async (req, res) => {
  try {
    if (req.body.userId !== req.params.userId) {
      return res
        .status(404)
        .json({ message: "You're not authorized to update user" });
    }

    const deletedUser = await model.User.findByIdAndDelete(req.params.userId);
    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    await model.Thought.deleteMany({ username: deletedUser.username });
    res
      .status(200)
      .json({ message: "User and user data deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error });
  }
};
