import {getAccessToken, setAccessTokenMemory} from "./AuthContext";

const API_URL = "http://localhost:8080/api/v1";

export async function apiFetch(url, options = {}) {
  const token = getAccessToken();

  const res = await fetch(API_URL + url, {
    ...options,
    headers: {
      ...(options.headers || {}),
      'Authorization': token ? `Bearer ${token}` : '',
      'Content-Type': 'application/json'
    },
    credentials: 'include', // NOT: Cookieleri otomatik olarak göndermesi için gerekli !!!
  });

  // Access Token'ın süresi dolmuşsa yenile
  if(res.status === 401) {
    const refreshRes = await fetch(API_URL + '/auth/refresh', {
      method: 'POST',
      credentials: 'include' // NOT: Üsttekinin aynısı !!!
    });

    if(refreshRes.ok) {
      const data = await refreshRes.json();
      setAccessTokenMemory(data.accessToken);

      // tokeni yeniledik ve ilk isteği tekrar gönderdik.
      return await apiFetch(url, options)
    }
    else {
      throw new Error("Unauthorized");
      // Dikkat: kullanıcının neyi yalnış yaptığı veya
      // hangi bilgisinin hatalı olduğunu kullanıcıya dönmüyoruz.
      // Bunun yerine "Yetkisiz işlem" statusu kullanıyoruz.
      // Backend'te de bu şekilde olacak.
    }
  }

  return res
}