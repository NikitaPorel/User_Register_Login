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
    // console.log("data", data);

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
    // console.log("data", data);
    return res.status(200).json({
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




export const deleteTodo = async (req, res) => {
  try {
    const todoId = req.params.id
    const data = await todoSchema.findByIdAndDelete({
      userId: req.userId,
      _id: todoId
    });
    // console.log("data", data);
    if(data){

      return res.status(200).json({
        success: true,
        message: "Todo deleted successfully",
        data: data
      });
    }
    else{
      return res.status(404).json({
        success: false,
        message: "No such data",

      })
    }

  } catch (error) {
    console.error("Error creating todo:", error);
    return res.status(500).json({
      success: false,
      message: "Could not access",
      error: error.message,
    });
  }
};



// export const updateTodo = async (req, res) => {
//   try {
//     const { title } = req.body;
//     console.log("title", title); 

//     const todoId = req.params.id;

//     const data = await todoSchema.findByIdAndUpdate( 
//       todoId, 
//       {
//         title: title,
//         userId: req.userId
//       })
//     if(data){
//       return res.status(200).json({
//         success: true,
//         message: "Todo updated Successfully",
//         data: data
//       })
//     }
//   } catch (error) {
//     console.error("Error updating todo:", error);
//     return res.status(500).json({
//       success: false,
//       message: "Could not update",
//       error: error.message,
//     });
//   }
// }

export const updateTodo = async (req, res) => {
  try {
    const { title } = req.body;
    const todoId = req.params.id;

    // Find the existing note first
    const data = await todoSchema.findOne({
      userId: req.userId,
      _id: todoId,
    });

    if (!data) {
      return res.status(404).json({
        success: false,
        message: "Todo not found",
      });
    }

    // Check if another note with the same title exists
    const existing = await todoSchema
      .findOne({
        // title:title,
        title: { $regex: title, $options: "i" },
        userId: req.userId,
        // _id: todoId
        _id: { $ne: todoId }, // Exclude the current note being updated
      })
      // .select("-data"); // Exclude 'data' field

    // console.log("ex", existing);

    if (existing) {
      return res.status(400).json({
        success: false,
        message: "Title already exists",
      });
    }

    // Update and save the note
    data.title = title;
    data.updatedAt = Date.now();
    await data.save();

    return res.status(200).json({
      success: true,
      message: "Todo updated successfully",
      data: data,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Could not update note",
    });
  }
};




export const getTodoById = async (req, res) => {
  try {
    const todoId = req.params.id;
    const data = await todoSchema.findOne({ userId: req.userId, _id: todoId });
    if (data) {
      return res.status(200).json({
        success: true,
        message: "Todo fetched successfully",
        data: data,
      });
    } else {
      return res.status(404).json({
        success: false,
        message: "no such Todo found",
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "could not access",
    });
  }
};