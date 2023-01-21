import { createContext, useState } from "react";

const AuthContext = createContext({});

/**
 * Wrapper for protected routes.
 * @param {*} param0
 * @returns
 */
export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({});

  return (
    <AuthContext.Provider value={{ auth, setAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
