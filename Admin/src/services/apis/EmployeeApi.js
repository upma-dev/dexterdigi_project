import axios from "axios";
import apis from './index'

export const employeeCreateApi = async (formdata) => {
  const token = localStorage.getItem("token").replace(/^"(.*)"$/, "$1");
  
  try {
    const response = await axios.post(
      apis.employee.createEmployee,
      formdata,  // Send the FormData object
      {
        headers: {
          'Content-Type': 'multipart/form-data', // Set the correct content type for multipart
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response;
  } catch (error) {
    console.error("Error creating employee:", error);
    throw error;
  }
};


export const getEmployeesApi = async () => {
    const token = localStorage.getItem("token").replace(/^"(.*)"$/, "$1");
    try {
        const response = await axios.get(
            apis.employee.employeeList,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response;
  } catch (error) {
    console.error("Error creating facility:", error);
    throw error;
  }
};

export const EditEmployeeApi =async(id,formdata)=> {
  const token = localStorage.getItem("token").replace(/^"(.*)"$/, "$1");

  try {
    const response = await axios.put(
      apis.employee.updateEmployee+id,
      formdata, // Send the FormData object
      {
        headers: {
          "Content-Type":
            "multipart/form-data", // Set the correct content type for multipart
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log(response, "---------------response---------------");
    return response.data;
  } catch (error) {
    console.error("Error creating Project:", error);
    throw error;
  }
};
export const getEmployeeById =async(id)=> {
  const token = localStorage.getItem("token").replace(/^"(.*)"$/, "$1");

  try {
    const response = await axios.get(
      apis.employee.getEmployeeById+id,
     
      {
        headers: {
          "Content-Type": "application/json", // Set the correct content type for multipart
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log(response, "---------------response---------------");
    return response.data;
  } catch (error) {
    console.error("Error creating Project:", error);
    throw error;
  }
};

export const deleteEmployeesApi = async (id) => {
  console.log(id, "---------------id---------------");
  const token = localStorage.getItem("token").replace(/^"(.*)"$/, "$1");
  try {
    const response = await axios.delete(apis.employee.deleteEmployee+id,{
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    }
     
    );

    return response.data;
  } catch (error) {
    console.error("Error creating facility:", error);
    throw error;
  }
};