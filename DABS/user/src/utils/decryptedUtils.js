import CryptoJS from 'crypto-js';
import { my_secret_key } from '../constant/CryptoJS/secretKey';
import { decodeToken } from './jwtUtils';
import { getUserById } from '../services/userService';

export const getDecryptedUserFromLocalStorage = async () => {
    try {
        const encryptedToken = localStorage.getItem('encryptedToken');
        if (!encryptedToken) return null;
        const bytes = CryptoJS.AES.decrypt(encryptedToken, my_secret_key);
        const decryptedToken = bytes.toString(CryptoJS.enc.Utf8); 
        const decoded = decodeToken(decryptedToken);
        const user = await getUserById(decoded.nameidentifier);
        return user;
    } catch (error) {
        console.error('Error decrypting token or fetching user:', error);
        return null;
    }
};