import cookieCutter from 'cookie-cutter'

// function getCookie(name) {
//     let cookieValue = null;
//     if (document.cookie && document.cookie !== '') {
//         const cookies = document.cookie.split(';');
//         for (let i = 0; i < cookies.length; i++) {
//             const cookie = cookies[i].trim();
//             if (cookie.substring(0, name.length + 1) === (name + '=')) {
//                 cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
//                 break;
//             }
//         }
//     }
//     return cookieValue;
// }

// function setCookie(name, value) {
//     if (document.cookie && document.cookie !== '') {
//         document.cookie = `${name}=${encodeURIComponent(value)}`
//     }
// }

async function login(user) {
    const response = await fetch('http://127.0.0.1:8000/accounts/api/token_auth/',{
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': cookieCutter.get('csrftoken')
        },
        body: JSON.stringify(user)
    })
    if (!response.ok) { 
        alert("Ошибка HTTP: " + response.status);
        return response.status;
    }

    let json = await response.json();
    cookieCutter.set('Token', json.token);
    return json;
}

export default login