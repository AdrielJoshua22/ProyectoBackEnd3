const form = document.getElementById('resetNewPassword');

form.addEventListener('submit', async e => 
{
    e.preventDefault();

    const data = new FormData(form);
    const obj = {};
    data.forEach((value, key) => obj[key] = value);

    try {
        const response = await fetch('/api/sessions/resetPassword', {method: 'POST',headers: {'Content-Type': 'application/json',},});

        const result = await response.json();

        if (response.status === 200) 
        {
            Swal.fire({
                icon: 'success',
                title: 'Éxito',
                text: 'Contraseña reestablecida con exito',
            });
        } else 
        {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: result.error || 'Hubo algun error intentando restablecer su contraseña',
            });
        }
    } catch (error) 
    {
        Swal.fire({
            icon: 'error',
            title: 'Error de red',
            text: 'Hubo un error al procesar la solicitud. Por favor, inténtalo de nuevo.',
        });
    }
});