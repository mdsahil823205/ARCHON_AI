import React, { useEffect } from "react";
import { serverUrl } from "../App";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setUserData, setLoading } from "../redux/userSlice";

const UseGetCurrentUser = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const GetCurrentUser = async () => {
      try {
        dispatch(setLoading(true));
        const result = await axios.get(`${serverUrl}/api/user/me`, {
          withCredentials: true,
        });
        dispatch(setUserData(result.data.user));
      } catch (error) {
        console.log(error);
        dispatch(setUserData(null));
      } finally {
        dispatch(setLoading(false));
      }
    };

    GetCurrentUser();
  }, [dispatch]);
};

export default UseGetCurrentUser;