import axios from "axios"
import useAuth from "./useAuth"

const useRefreshToken = () => {
    const { setAuth } = useAuth();

    const refresh = async () => {
        const response = await axios.get('user/refresh', {
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