
"use client";

import { createContext, useContext, useEffect, useState } from "react";
import api from "../../lib/axios";

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = async () => {
    try {
      setLoading(true);
      // SEND COOKIE WITH REQUEST
      const meRes = await api.get("/user/auth/me", {
        withCredentials: true,
      });
      const userData = meRes.data.user;
      let profileData = {};
      try {
        const profileRes = await api.get("/user/profile/get", {
          withCredentials: true,
        });
        profileData = profileRes.data.profile || {};
      } catch (err) {
        console.log("No profile yet:", err.message);
      } 
      setUser({ ...userData, ...profileData });
    } catch (err) {
      console.log("Not logged in:", err.message);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const login = async (email, password) => {
    const res = await api.post(
      "/user/auth/login",
      { email, password },
      { withCredentials: true }
    );

    await fetchUser(); // IMPORTANT
    return res.data;
  };

  const logout = async () => {
    await api.post(
      "/user/auth/logout",
      {},
      { withCredentials: true }
    );
    setUser(null);
    window.location.href = "/login";
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, login, logout, refetch: fetchUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
