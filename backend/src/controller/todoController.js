

import todoSchema from "../models/todoSchema.js";

export const addTodo = async (req, res) => {
  try {
    const { title } = req.body;
    console.log("title", title);

    // check duplicate
    const existing = await todoSchema.findOne({
      title: title,
    //   title: { $regex: title, $options: "i" }, //case insensitive
      userId: req.userId,
    });
    console.log("userid...", req.userId);

    if (existing) {
      return res.status(400).json({
        success: false,
        message: "Title already exists",
      });
    }

    // create new todo
    const data = await todoSchema.create({
      title,
      userId: req.userId,
    });
    console.log("data", data);

    // always return once response is sent
    return res.status(201).json({
      success: true,
      message: "Todo created successfully",
      data,
    });

  } catch (error) {
    console.error("Error creating todo:", error);
    // only runs if an exception occurs
    return res.status(500).json({
      success: false,
      message: "Could not create todo",
      error: error.message,
    });
  }
};



export const getTodo = async (req, res) => {
  try {

    const data = await todoSchema.find({
      userId: req.userId,
    });
    console.log("data", data);
    return res.status(201).json({
      success: true,
      message: "Todo fetched successfully",
      data,
    });

  } catch (error) {
    console.error("Error creating todo:", error);
    return res.status(500).json({
      success: false,
      message: "Could not access",
      error: error.message,
    });
  }
};
