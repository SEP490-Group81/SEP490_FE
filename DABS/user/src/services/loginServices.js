import { get } from "../utils/request";

export const checkUserCredentials = async (email, password) => {
    try {
        const users = await get('company');
        const user = users.find(
            (u) => u.email === email && u.password === password
        );

        if (user) {
            return {
                success: true,
                user,
            };
        } else {
            return {
                success: false,
                message: 'Invalid email or password',
            };
        }
    } catch (error) {
        console.error('Error fetching users:', error);
        return {
            success: false,
            message: 'Unable to login. Please try again later.',
        };
    }
};
