export default function decodeToken(token){
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayLoad = decodeURIComponent(
            atob(base64)
            .split('')
            .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
            .join('')
        );
        return JSON.parse(jsonPayLoad);
    }
        catch (error) {
            console.log('Ошибка декодирования токена', error);
            return null;
        }

    }

export function hasOrganizerAccess(token){
    const decodedToken = decodeToken(token);
    if (!decodedToken){
        return false;
    }
    return decodedToken.role === 'ORGANIZER' || decodedToken.role === 'JUDGE';
}