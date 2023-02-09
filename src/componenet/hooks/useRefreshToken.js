import axios from "axios"
import useAuth from "./useAuth"

const BASE_URL = "https://koukan.onrender.com/api"

const useRefreshToken = () => {
    const { setAuth } = useAuth();

    const refresh = async () => {
        const response = await axios.get(BASE_URL + 'user/refresh', {
            withCredentials: true
        });
        setAuth(prev => {
            console.log(JSON.stringify(prev));
            console.log(response.data.jwt);
            return{...prev, accessToken: response.data.jwt}
        })
        return response.data.jwt;
    }
return refresh;
}

export default useRefreshToken