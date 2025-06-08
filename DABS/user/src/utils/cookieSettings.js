import Cookies from 'js-cookie';

export const storeTokens = (jwt, refreshToken, refreshTokenExpiryTime) => {
    if (jwt) {
        Cookies.set("jwt", jwt, { expires: 1 }); 
    }
    if (refreshToken && refreshTokenExpiryTime) {
        const refreshTokenExpiryDate = new Date(refreshTokenExpiryTime);
        Cookies.set("refreshToken", refreshToken, { expires: refreshTokenExpiryDate }); 
    }
};

export function deleteCookie(name) {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
}