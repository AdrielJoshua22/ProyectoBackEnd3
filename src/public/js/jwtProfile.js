const token = localStorage.getItem('accessToken');
if(!token) window.location.replace('/login');

fetch('/api/sessions/profileInfo', 
{
    method:'GET',
    headers:
    {
        authorization: `Bearer ${token}`
    }
}).then(response=>response.json())
.then(result=>
{
    const user =result.payload;
    document.querySelector("#nombre").innerHTML = `bienvenido ${user.name}`;
    document.querySelector("#apellido").innerHTML = `apellido: ${user.lastName}`;
    document.querySelector("#edad").innerHTML = `edad: ${user.age}`;
    document.querySelector("#email").innerHTML = `email: ${user.email}`;
})