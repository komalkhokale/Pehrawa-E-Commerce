import axios from "axios"

const authApiInstance = axios.create({
  baseURL: "/api/auth",
 withCredentials: true,
})

// export async function register({email, contact, password, fullname, isSeller}) {
    

//     const response = await authApiInstance.post("/register", {
//         email,
//         contact,
//         password,
//         fullname,
//         isSeller
//     })

//     return response.data


// }

export async function register(userData) {
  try {
    const response = await authApiInstance.post("/register", userData);
    return response.data;
  }catch (err) {
  console.log(err.response?.status);
  console.log(err.response?.data);
  throw err;
}
  }

// export async function login({email, password}) {
//     const response = await authApiInstance.post("/login", {
//         email,
//         password
//     })

//     return response.data
// }

export async function login(userData) {
  try {
    const response = await authApiInstance.post("/login", userData);
    return response.data;
  } catch (err) {
    console.log("Request:", userData);
    console.log("Errors:", err.response?.data?.errors);
    console.log("Response:", err.response?.data);
    throw err;
  }
}


export async function getMe() {
  
  const response = await authApiInstance.get("/me")

  return response.data

}


export async function logout() {
  try {
    const response = await authApiInstance.post("/logout");
    return response.data;
  } catch (err) {
    console.log(err.response?.data);
    throw err;
  }
}