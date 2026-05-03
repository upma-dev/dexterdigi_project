const httpStatus = require("http-status");
const catchAsync = require("../utils/catchAsync");
const { userService, tokenService } = require("../services");

// Create (NEW)
const createEmployee = catchAsync(async (req, res) => {
  const image = req.files?.image ? req.files.image[0].filename : req?.body?.image;
  const newUser = await userService.createUser({ ...req.body, image });
  const tokens = await tokenService.generateAuthTokens(newUser);
  res.status(httpStatus.CREATED).json({
    message: "Employee created successfully",
    user: newUser,
    tokens,
    success: true,
  });
});

// List admins
const getAdmins = catchAsync(async (req, res) => {
  const { page = 1, limit = 10, sort = "", search = "" } = req.query;
  const options = { page: +page, limit: +limit, sort, search };
  const admins = await userService.getAdmins(options);
  res.json({ success: true, admins });
});

// Get by ID
const getUserById = catchAsync(async (req, res) => {
  const user = await userService.findEmployeeById(req.params.id);
  if (!user) return res.status(404).json({ message: "User not found" });
  res.status(200).json(user);
});

// Update
const updateUser = catchAsync(async (req, res) => {
  const image = req.files?.image ? req.files.image[0].filename : req?.body?.image;
  const updatedUser = await userService.updateEmployee(req.params.id, {
    ...req.body,
    image,
  });
  if (!updatedUser) return res.status(404).json({ message: "User not found" });
  res.status(200).json({ message: "User updated successfully", user: updatedUser, success: true });
});

// Delete
const deleteUser = catchAsync(async (req, res) => {
  const deletedUser = await userService.deleteClient(req.params.id);
  if (!deletedUser) return res.status(404).json({ message: "User not found" });
  res.status(200).json({ message: "User deleted successfully", success: true });
});


module.exports = {
  getAdmins,
  getUserById,
  updateUser,
  deleteUser,
  createEmployee,
};
