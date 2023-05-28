import { Outlet } from "react-router-dom";
import { useState, useEffect } from "react";
import useRefreshToken from "../hooks/useRefreshToken";
import useAuth from "../hooks/useAuth";

const PersistLogin = () => {
  const [isLoading, setIsLoading] = useState(true);
  const refresh = useRefreshToken();
  const { auth, persist } = useAuth();

  useEffect(() => {
    if (persist) {
      const verifyRefreshtoken = async () => {
        try {
          await refresh();
        } catch (err) {
          console.log(err);
        } finally {
          setIsLoading(false);
        }
      };
      !auth?.accessToken ? verifyRefreshtoken() : setIsLoading(false);
    } else {
      setIsLoading(false);
    }
  }, []);

  return <>{isLoading ? <div></div> : <Outlet />}</>;
};

export default PersistLogin;
