const httpStatus = require("http-status");
const catchAsync = require("../utils/catchAsync");
const { authService, userService, tokenService } = require("../services");

const register = catchAsync(async (req, res) => {
  const user = await userService.createUser(req.body);
  const tokens = await tokenService.generateAuthTokens(user);
  res.status(httpStatus.CREATED).send({ user, tokens });
});

const registerClient = catchAsync(async (req, res) => {
  const client = await userService.createClient(req.body);
  const tokens = await tokenService.generateClientAuthTokens(client);
  res.status(httpStatus.CREATED).send({ client, tokens });
});

const login = catchAsync(async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await authService.loginUserWithEmailAndPassword(email, password);
    const tokens = await tokenService.generateAuthTokens(user);
    res.status(httpStatus.OK).json({ message: "Login successful", user, tokens });
  } catch (error) {
    console.error("Login error:", error.message);
    const status = error.message === "Incorrect email or password" ? httpStatus.UNAUTHORIZED : httpStatus.INTERNAL_SERVER_ERROR;
    const message = error.message === "Incorrect email or password" ? "Email or password is incorrect" : "An unexpected error occurred";
    res.status(status).json({ message });
  }
});

const loginClient = catchAsync(async (req, res) => {
  const { email, password } = req.body;
  const client = await authService.loginClientWithEmailAndPassword(email, password);
  const tokens = await tokenService.generateClientAuthTokens(client);
  res.status(httpStatus.OK).send({ message: "Login successfully", client, tokens });
});

const loginRestaurant = catchAsync(async (req, res) => {
  const { email, password } = req.body;
  const vendor = await authService.loginVendorWithEmailAndPassword(email, password);
  const tokens = await tokenService.generateVendorAuthTokens(vendor);
  res.status(httpStatus.OK).send({ message: "Login successfully", vendor, tokens });
});

const loginEmployee = catchAsync(async (req, res) => {
  const { email, password } = req.body;
  const user = await authService.loginUserWithEmailAndPassword(email, password);
  const tokens = await tokenService.generateAuthTokens(user);
  res.status(httpStatus.OK).send({ message: "Login successfully", user, tokens });
});

const logout = catchAsync(async (req, res) => {
  const { token } = req.body;
  await authService.logoutUser(token);
  res.status(httpStatus.OK).send({ message: "Logout successful" });
});

const requestOtp = catchAsync(async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ message: "Email is required", success: false });
  }
  const result = await authService.sendOtp(email);
  res.status(result.statusCode).send(result.response);
});

const verifyOtp = catchAsync(async (req, res) => {
  const { email, otp } = req.body;
  const result = await authService.verifyOtp(email, otp);
  res.status(result.statusCode).send(result.response);
});

const resetPassword = catchAsync(async (req, res) => {
  const result = await authService.resetPassword(req.body);
  res.status(result.statusCode).json(result.response);
});

const refreshAccessToken = catchAsync(async (req, res) => {
  const { rememberToken } = req.body;
  const data = await authService.refreshAccessToken(rememberToken);
  res.status(httpStatus.OK).json({ ...data, message: "Access token refreshed successfully", success: true });
});

module.exports = {
  register,
  registerClient,
  login,
  loginClient,
  loginRestaurant,
  loginEmployee,
  logout,
  requestOtp,
  verifyOtp,
  resetPassword,
  refreshAccessToken,
};
