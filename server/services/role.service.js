const { adminRoles } = require("../models");

const createRole = async (roleData) => {
  try {
    const role = await adminRoles.create({ ...roleData });
    return { message: "Role created successfully", role };
  } catch (error) {
    console.error("Error adding role:", error);
    throw error;
  }
};

const getRole = async () => {
  try {
    const roles = await adminRoles.find().populate('sidebarMenus');
    return roles;
  } catch (error) {
    console.error("Error getting Category :", error);
    throw error;
  }
};

const getRoleById = async (Id) => {
  try {
    const roleById = await adminRoles.findById(Id);
    if (!roleById) {
      throw new Error("Role not found");
    }
    return roleById;
  } catch (error) {
    console.error("Error getting Role by ID:", error);
    throw error;
  }
};

const updateRole = async (Id, updatedData) => {
  try {
    const editRole = await adminRoles.findByIdAndUpdate(
      Id,
      {
        name: updatedData.name,
        sidebarMenus: updatedData.sidebarMenus,     // replaces full array
        permissions: updatedData.permissions,     // replaces full array
      },
      { new: true }
    );
    

    if (!editRole) {
      throw new Error("Role not found");
    }

    return editRole;
  } catch (error) {
    throw error;
  }
};


const deleteRole = async (Id) => {
  try {
    const deleteRole = await adminRoles.findByIdAndDelete(Id);
    if (!deleteRole) {
      throw new Error("Role not found");
    }
    return deleteRole;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  createRole,
  getRole,
  updateRole,
  getRoleById,
  deleteRole,
};
