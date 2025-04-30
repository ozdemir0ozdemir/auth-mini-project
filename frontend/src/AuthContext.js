import {createContext, useContext, useState, useEffect} from "react";

const AuthContext = createContext(null);
const API_URL = "http://localhost:8080/api/v1";

export function AuthProvider({children}) {
  const [accessToken, _setAccessToken] = useState(null);

  // Sayfa yüklenince otomatik refresh dene
  useEffect(() => {
    async function refreshToken() {
      const res = await fetch(API_URL + '/auth/refresh', {
        method: 'POST',
        credentials: 'include',
      });
      if (res.ok) {
        const data = await res.json();
        setAccessToken(data.accessToken);
        setAccessTokenMemory(data.accessToken);
      } else {
        setAccessToken(null);
        setAccessTokenMemory(null);
      }
    }

    refreshToken();
  }, []);

  function setAccessToken(token) {
    _setAccessToken(token);
  }

  return (
      <AuthContext.Provider value={{accessToken, setAccessToken}}>
        {children}
      </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext);
}

let accessTokenMemory = null;

export function setAccessTokenMemory(token) {
  accessTokenMemory = token;
}

export function getAccessToken() {
  return accessTokenMemory;
}