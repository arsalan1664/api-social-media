// // Add a reaction to a Posts
export const createReaction = async (req, res) => {
  try {
    const thoughtId = req.params.thoughtId;
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
        thought: { connect: { id: post } }, // Connect to the existing thought
        reactionBody,
      },
    });

    res.status(201).json(newReaction); // Return the created reaction
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// // Remove a reaction to a thoughts
export const deleteReaction = async (req, res) => {
  try {
    const thought = await model.Thought.findById(req.params.thoughtId);
    if (!thought) {
      return res.status(404).json({ message: "Thought not found" });
    }
    const newThought = await model.Thought.create(req.body);
    thought.reactions.pull(req.params.reactionId);
    await thought.save();
    res.status(200).json({ message: "reaction removed successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
