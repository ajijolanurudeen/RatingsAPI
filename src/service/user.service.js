const bcrypt = require("bcrypt");
const userModel = require("../models/user.model")

const registerUser = async({name, email, password, role})=>{
    if(!name||!email||!password){
        throw new Error("missing reqiured fields")
    }
    email = email.trim().toLowerCase()
    const existingUser = await userModel.findUserByEmail(email);
    if(existingUser){
        throw new Error("This user already exists")
    }
     // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  //Optional: Validate role
  const allowedRoles = ["user", "admin"];
  const finalRole = allowedRoles.includes(role) ? role : "user";

  //Save user
  const newUser = await userModel.registerUser(
    name,
    email,
    hashedPassword,
    finalRole
  );

  return {
    message: "User registered successfully",
    user: {
      id: newUser.user_id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role
    }
  };
};

//get all users
const getUsers = async({page = 1, limit = 10})=>{
    page = Number(page);
    limit = Number(limit);
    if(!Number.isInteger(page)|| page < 1) page = 1;
    if(!Number.isInteger(limit) || limit < 1) limit = 10
    const offset = (page -1) * limit;
    return await userModel.getUsers(limit,offset);
}

//get one user

const getOneUser =  async(user_id)=>{
    if(!user_id){
        throw new Error("user id is required");
    }
    return await userModel.getOneUser(user_id);
};

//Update user

const updateUser = async (user_id, data) => {
  const { name, email, password } = data;

  // 1️⃣ Check if user exists
  const existingUser = await userModel.getOneUser(user_id);
  if (!existingUser) {
    const error = new Error("User not found");
    error.status = 404;
    throw error;
  }

  const updatedFields = {};

  if (name) updatedFields.name = name;

  if (email) {
    const emailTaken = await userModel.findUserByEmail(email);
    if (emailTaken) {
      const error = new Error("Email already in use");
      error.status = 400;
      throw error;
    }
    updatedFields.email = email;
  }

  if (password) {
    const hashedPassword = await bcrypt.hash(password, 10);
    updatedFields.password = hashedPassword;
  }

  if (Object.keys(updatedFields).length === 0) {
    const error = new Error("No fields to update");
    error.status = 400;
    throw error;
  }

  await userModel.updateUser(user_id, updatedFields);

  return {
    message: "User updated successfully",
    updated: Object.keys(updatedFields),
  };
};

//Delete User
const deleteUser = async(user_Id)=>{
    const deleted = await userModel.deleteUser(user_Id)
    if(!deleted){
        throw new Error("user not found or unauthorized");
    }
    return deleted
}

module.exports = {
  registerUser,
  getOneUser,
  getUsers,
  updateUser,
  deleteUser

};
