import axios from "axios";

export default axios.create({
  baseURL: "https://koukan.onrender.com",
  // baseURL: "http://localhost:8000/",
});
