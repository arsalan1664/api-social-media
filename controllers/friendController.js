import prisma from "../prisma/Prisma.js";

// Get all friends of a user
export const getAllFriends = async (req, res) => {
  try {
    const userId = req.params.userId;

    if (req.params.userId !== req.body.userId) {
      return res
        .status(404)
        .json({ message: "You're not authorized to perform this action" });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { friends: true },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user.friends);
  } catch (error) {
    console.error(error); // Log the error for debugging purposes
    res.status(500).json({ error: "Internal server error" }); // Generic error message for the client
  }
};

// Add a friend to a user
export const addFriend = async (req, res) => {
  try {
    // only user can create their own friend
    if (req.params.userId !== req.body.userId) {
      return res
        .status(404)
        .json({ message: "You're not authorized to perform this action" });
    }

    const userId = req.params.userId;
    const friendId = req.body.friendId;

    // Check unauthorized action (user cannot add themself)
    if (userId === friendId) {
      return res
        .status(400)
        .json({ message: "Cannot add yourself as a friend" });
    }

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if friend exists
    const friend = await prisma.user.findUnique({
      where: { id: friendId },
    });

    if (!friend) {
      return res.status(404).json({ message: "Friend not found" });
    }

    // Check if user already friends with the target user
    const existingFriendship = await prisma.user.findUnique({
      where: { id: userId },
      select: { friends: { where: { id: friendId } } },
    });

    if (existingFriendship?.friends?.length > 0) {
      return res
        .status(400)
        .json({ message: "You are already friends with this user" });
    }

    // Connect users with Prisma relation update
    await prisma.user.update({
      where: { id: userId },
      data: {
        friends: { connect: { id: friendId } },
      },
    });

    res.status(200).json({ message: "Friends connected successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Remove a friend from a user
export const unfriend = async (req, res) => {
  try {
    if (req.params.userId !== req.body.userId) {
      return res
        .status(404)
        .json({ message: "You're not authorized to perform this action" });
    }
    const userId = req.params.userId;
    const friendId = req.body.friendId;

    // Check unauthorized action (user cannot unfriend themself)
    if (userId === friendId) {
      return res.status(400).json({ message: "Cannot unfriend yourself" });
    }

    // Disconnect users with Prisma relation update
    await prisma.user.update({
      where: { id: userId },
      data: {
        friends: { disconnect: { id: friendId } },
      },
    });

    res.status(200).json({ message: "Unfriended successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};
