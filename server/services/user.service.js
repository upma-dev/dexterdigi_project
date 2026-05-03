const { Admins, Vendors, Clients } = require("../models");
const httpStatus = require("http-status");
const ApiError = require("../utils/ApiError");
const bcrypt = require("bcryptjs");

const createUser = async (userBody) => {
    if (await Admins.isEmailTaken(userBody.email)) {
       throw new ApiError(httpStatus.OK, "Email already taken");
     } else {
       const hashedPassword = await bcrypt.hash(userBody.password, 10);
       const newUser = await Admins.create({
         ...userBody,
         password: hashedPassword,
       });
       console.log("newUser",newUser);
     return newUser;
 }
 }

 const createClient = async (userBody) => {
  if (await Clients.isEmailTaken(userBody.email)) {
     throw new ApiError(httpStatus.OK, "Email already taken");
   } else {
     const hashedPassword = await bcrypt.hash(userBody.password, 10);
     const newUser = await Clients.create({
       ...userBody,
       password: hashedPassword,
     });
     console.log("newUser",newUser);
   return newUser;
}
}

 const getUserByEmail = async (email) => {
  return await Admins.findOne({email: email});
}

const getVendorByEmail = async (email) => {
  return await Vendors.findOne({email: email});
}
const deleteClient = async (id) => {
  const newUser = await Admins.findByIdAndDelete(id);
  return { message: "Employee deleted Successfully", success: true };
};

const getClientByEmail = async (email) => {
  return await Clients.findOne({email: email});
}
 
const getUserByToken = async (remembertoken) => {
   return await Admins.findOne({remembertoken: remembertoken});
}
 
const getVendorByToken = async (remembertoken) => {
  return await Admins.findOne({remembertoken: remembertoken});
}

const getClientByToken = async (remembertoken) => {
  return await Clients.findOne({remembertoken: remembertoken});
}

// Update Employee (Admin) with new fields
const updateEmployee = async (id, data) => {

  // Update employee and return
  const User = await Admins.findByIdAndUpdate(id, data, {
    new: true,
  });

  return { message: "Employee Updated Successfully", success: true, User };
};

const findEmployeeById = async (id) => {
  const User = await Admins.findById(id)
    .populate("role_id", "name")
  if (!User) return { message: "User not found", success: false };

  return {
    message: "Employee Fetched Successfully",
    success: true,
    User,
  };
};


const getAdmins = async () => {
  try {
    const admin = await Admins.find()
    .populate("role_id")
    
    return admin;
  } catch (error) {
    console.error("Error getting admin :", error);
    throw error;
  }
};


 module.exports ={  createUser, getUserByEmail, updateEmployee , findEmployeeById, getUserByToken,getAdmins ,getVendorByEmail,getVendorByToken ,createClient, getClientByEmail, getClientByToken,deleteClient};