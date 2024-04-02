// // Add a comment to a Posts
export const createComment = async (req, res) => {
  try {
    // const thought = await model.Thought.findById(req.params.thoughtId);
    // const reaction = req.body.reactionBody;
    // console.log({ thought, reaction });
    // ///
    // if (!thought) {
    //   return res.status(404).json({ message: "thought not found" });
    // }
    // thought.reactions.push({
    //   reactionBody: reaction,
    //   username: thought.username,
    // });
    // await thought.save();
    // res.status(201).json(thought.reactions);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// // Remove a Comment to a thoughts
export const deleteComment = async (req, res) => {
  try {
    // const thought = await model.Thought.findById(req.params.thoughtId);
    // if (!thought) {
    //   return res.status(404).json({ message: "Thought not found" });
    // }
    // const newThought = await model.Thought.create(req.body);
    // thought.reactions.pull(req.params.reactionId);
    // await thought.save();
    // res.status(200).json({ message: "reaction removed successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
