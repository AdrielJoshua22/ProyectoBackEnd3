const form = document.getElementById('restartForm');

form.addEventListener('submit', async e => 
{
    e.preventDefault();

    const data = new FormData(form);
    const obj = {};
    data.forEach((value, key) => obj[key] = value);

    // verifico que los correos coincidan, si es asi envio peticion sino espero a que sean validos (iguales)
    if (data.get('email') !== data.get('emailReplik')) {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Los correos ingresados deben coincidir',
        });
    } else {
        try {
            const response = await fetch('/api/users/resetPass/' + obj.email, {method: 'GET',headers: {'Content-Type': 'application/json',},});
            const result = await response.json();

            if (response.status === 200) 
            {
                Swal.fire({
                    icon: 'success',
                    title: 'Éxito',
                    text: 'Correo de restablecimiento enviado con éxito',
                });
            } else 
            {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: result.error || 'El correo ingresado es inválido o no se encuentra registrado en nuestra base de datos',
                });
            }
        } catch (error) 
        {
            console.error('Error en la solicitud fetch:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error de red',
                text: 'Hubo un error al procesar la solicitud. Por favor, inténtalo de nuevo.',
            });
        }
    }
});
