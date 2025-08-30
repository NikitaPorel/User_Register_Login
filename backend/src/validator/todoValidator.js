import yup from "yup";

export const todoSchema = yup.object({
  title: yup.string().trim().min(3, "Title must be atleast 3 characters").required(),
  
});

export const validateTodo = (schema) => async (req, res, next) => {
  try {
    await schema.validate(req.body);
    next();
  } catch (err) {
    return res.status(400).json({ errors: err.errors });
  }
};