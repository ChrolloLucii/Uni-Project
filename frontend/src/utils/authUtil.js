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

export async function hasOrganizerAccess(){
    try {
        const token = localStorage.getItem('token');
        if (!token) return false;
        
        // Проверяем доступ через API
        const res = await fetch('http://localhost:4000/api/organizer/profile', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        
        if (!res.ok) return false;
        
        const data = await res.json();
        return data.role === 'ORGANIZER' || data.role === 'JUDGE';
    } catch (error) {
        console.error('Ошибка проверки доступа:', error);
        return false;
    }
}