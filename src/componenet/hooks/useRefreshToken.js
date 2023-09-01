import axios from "axios";
import useAuth from "./useAuth";
import jwt_decode from "jwt-decode";
import { useNavigate } from "react-router-dom";

const useRefreshToken = () => {
  const { setAuth } = useAuth();
  const navigate = useNavigate();
  const refresh = async () => {
    try {
      const response = await axios.get("/api/user/refresh", {
        withCredentials: true,
      });
      const accessToken = response.data.jwt;
      const decoded = jwt_decode(response.data.jwt);
      setAuth({ user: decoded.user, accessToken });
      return response.data.jwt;
    } catch (err) {
      if (err.response.status === 401) {
        setAuth({});
        navigate("/", { replace: true });
      }
    }
  };
  return refresh;
};

export default useRefreshToken;
