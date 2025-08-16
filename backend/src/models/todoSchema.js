import mongoose from "mongoose";

const todoSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "person",
        required: true,
      },
});

export default mongoose.model("todo", todoSchema);