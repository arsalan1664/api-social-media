import prisma from "../prisma/Prisma.js";
// // Add a reaction to a Posts
export const createReaction = async (req, res) => {
  try {
    const postId = req.params.postId;
    const reactionBody = req.body.reactionBody;

    // Check if post exists
    const post = await prisma.post.findUnique({
      where: { id: postId },
    });

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Create the reaction using Prisma relation creation
    const newReaction = await prisma.reaction.create({
      data: {
        post: { connect: { id: post } }, // Connect to the existing post
        reactionBody,
      },
    });

    res.status(201).json(newReaction); // Return the created reaction
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// // Remove a reaction to a posts
export const deleteReaction = async (req, res) => {
  try {
    const postId = req.params.postId;
    const reactionId = req.params.reactionId;

    // Check if post exists
    const post = await prisma.post.findUnique({
      where: { id: postId },
    });

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Delete the reaction using Prisma relation deletion
    await prisma.reaction.delete({
      where: {
        id: reactionId, // Filter by reaction ID
        postId, // Ensure the reaction belongs to the specified post
      },
    });

    res.status(200).json({ message: "Reaction removed successfully" }); // Informative message
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};
