// import axios from "axios";

//send Email and password to backend
// const signup = async (email, password) => {
//   return await axios
//     .post(API_URL + "/signup", {
//       userName: username,
//       userEmail: email,
//       userPassword: password,
//     })
//     .then((res) => {
//       if (res.data.accessToken) {
//         localStorage.setItem("user", JSON.stringify(res.data));
//       }
//     });
// };

//get token from server
// const login = async (email, password) => {
//   return await axios
//     .post(API_URL + "/login", {
//       userEmail: email,
//       userPassword: password,
//     })
//     .then((res) => {
//       if (res.data.accessToken) {
//         localStorage.setItem("user", JSON.stringify(res.data));
//       }

//       return res.data;
//     });
// };

// const getUserData = async (token) => {
//   return await axios
//     .post(API_URL + "/user", {
//       accessToken: token,
//     })
//     .then((res) => {
//       return res.data;
//     });
// };

// const logout = () => {
//   localStorage.removeItem("user");
//   localStorage.removeItem("userData")
// };

// const getCurrentUser = () => {
//   return JSON.parse(localStorage.getItem("user"));
// };

// const authService = {
//   signup,
//   login,
//   logout,
//   getUserData,
//   getCurrentUser,
// };

// export default authService;
