import prisma from "../prisma/Prisma";

// Add a comment to a Posts
export const addComment = async (req, res) => {
  try {
    const postId = req.params.postId;
    const commentBody = req.body.commentBody;

    // Check if post exists
    const post = await prisma.post.findUnique({
      where: { id: postId },
    });

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Create the comment using Prisma relation creation
    const newComment = await prisma.comment.create({
      data: {
        post: { connect: { id: postId } }, // Connect to the existing post
        commentBody,
      },
    });

    res.status(201).json(newComment); // Return the created comment
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Remove a Comment to a thoughts
export const deleteComment = async (req, res) => {
  try {
    const postId = req.params.postId;
    const commentId = req.params.commentId;

    // Check if post exists
    const post = await prisma.post.findUnique({
      where: { id: postId },
    });

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Delete the comment using Prisma relation deletion
    await prisma.comment.delete({
      where: {
        id: commentId, // Filter by comment ID
        postId, // Ensure the comment belongs to the specified post
      },
    });

    res.status(200).json({ message: "Comment removed successfully" }); // Informative message
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};
