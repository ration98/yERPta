import React, { createContext, useState, useContext, useEffect } from "react";
import { useRouter } from "next/router";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [expiresAt, setExpiresAt] = useState(null);
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUser = localStorage.getItem("user");
      const storedExpiresAt = localStorage.getItem("expiresAt");
      // if (storedUser && storedExpiresAt) {
      //   setUser(JSON.parse(storedUser));
      //   setExpiresAt(Number(storedExpiresAt));
      // }
      if (storedUser) setUser(JSON.parse(storedUser));
      if (storedExpiresAt) setExpiresAt(Number(storedExpiresAt));
    }
  }, []);

  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("expiresAt", expiresAt);
    } else {
      localStorage.removeItem("user");
      localStorage.removeItem("expiresAt");
    }
  }, [user, expiresAt]);

  useEffect(() => {
    if (expiresAt) {
      const now = Math.floor(Date.now() / 1000);
      const timeout = expiresAt - now;

      console.log("Timeout dihitung:", timeout, "detik");

      if (timeout <= 0) {
        console.log("Token sudah kedaluwarsa!");
        logout(); // Logout langsung jika token sudah expired
      } else {
        console.log("Mengatur timer logout dalam", timeout, "detik");
        const timer = setTimeout(() => {
          logout();
        }, timeout * 1000);

        return () => clearTimeout(timer); // Bersihkan timer jika dependency berubah
      }
    }
  }, [expiresAt]);

  useEffect(() => {
    console.log("useEffect dipanggil karena expiresAt berubah:", expiresAt);
  }, [expiresAt]);

  const logout = () => {
    console.log("Memanggil logout...");
    setUser(null);
    setExpiresAt(null);
    router.push("/authentication/sign-in/basic");
  };

  return (
    <UserContext.Provider
      value={{ user, setUser, logout, setExpiresAt, expiresAt }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);