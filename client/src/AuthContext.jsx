// AuthContext.js
import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { apiUrl } from "./api";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  let token = window.localStorage.getItem("token");
  let notToken = token == undefined;
  const [isLoggedIn, setIsLoggedIn] = useState(!notToken);
  const [role, setRole] = useState();
  const [userId, setUserId] = useState()

  const getUser = async () => {
    axios
      .get(apiUrl + "/getUser", {
        headers: {
          token: token,
          "Content-Type": "application/json",
        },
      })
      .then((res) => {
        console.log("auth response", res);
        setUserId(res.data._id)

        setRole(res.data.Role);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const login = async () => {

    setIsLoggedIn(true);
  };

  const logout = () => {
    // Perform logout actions
    window.localStorage.removeItem("token");
    setIsLoggedIn(false);
    window.location.href("/")

  };

  useEffect(() => {
    getUser();
  }, [isLoggedIn]);

  return (
    <AuthContext.Provider value={{ userId, role, isLoggedIn, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
