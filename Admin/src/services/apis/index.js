import { signUp } from "../AuthService"; // Load environment variables

// Define the base URL for the API from .env
const BASE_URL = "http://localhost:8087/v1";
//updated

// Define the base URL for the API

// Define the endpoints
const apis = {
  baseurl: {
    Baseimageurl:
      `http://localhost:8087/v1/get-Images/image/` ||
      `https://api.i2rtest.in/v1/get-Images/image/`,
    newsImageBase: `${BASE_URL}/public/images/news/`,
    authorImageBase: `${BASE_URL}/public/images/authors/`,
  },
  auth: {
    login: `${BASE_URL}/public/auth/login`,
    signUp: `${BASE_URL}/public/auth/register`,
  },
  sidemenu: {
    sidebarmenu: `${BASE_URL}/public/menus/sidebar-menus`,
    AllSidebarList: `${BASE_URL}/public/menus/sidebar-menus-list`,
  },
  permission: { permission: `${BASE_URL}/public/permission/permissions` },
  roles: {
    role: `${BASE_URL}/private/role/create-role`,
    rolesList: `${BASE_URL}/private/role/roles-lists`,
    getById: `${BASE_URL}/private/role/get-role`,
    updateRole: `${BASE_URL}/private/role/edit-role/`,
    deleteRole: `${BASE_URL}/private/role/delete-role/`,
  },
  employee: {
    createEmployee: `${BASE_URL}/private/employee/create-employee`,
    employeeList: `${BASE_URL}/private/employee/employee-lists`,
    getEmployeeById: `${BASE_URL}/private/employee/get-employee/`,
    updateEmployee: `${BASE_URL}/private/employee/edit-employee/`,
    deleteEmployee: `${BASE_URL}/private/employee/delete-employee/`,
  },
  news: {
    create: `${BASE_URL}/private/news/create-news`,
    list: `${BASE_URL}/private/news/news-list`,
    getById: `${BASE_URL}/private/news/get-news/`,
    update: `${BASE_URL}/private/news/update-news/`,
    delete: `${BASE_URL}/private/news/delete-news/`,
    status: `${BASE_URL}/private/news/update-news-status/`,
  },
  author: {
    create: `${BASE_URL}/private/author/create-author`,
    list: `${BASE_URL}/private/author/author-list`,
  },
};

export default apis;
