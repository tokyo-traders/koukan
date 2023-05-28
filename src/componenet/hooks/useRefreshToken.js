import axios from "axios";
import useAuth from "./useAuth";
import jwt_decode from "jwt-decode";

const useRefreshToken = () => {
  const { setAuth } = useAuth();

  const refresh = async () => {
    const response = await axios.get("/api/user/refresh", {
      withCredentials: true,
    });
    console.log(response);
    const accessToken = response.data.jwt;
    const decoded = jwt_decode(response.data.jwt);
    setAuth({ user: decoded.user, accessToken });
    return response.data.jwt;
  };
  return refresh;
};

export default useRefreshToken;
