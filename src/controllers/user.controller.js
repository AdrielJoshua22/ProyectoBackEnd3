import { userService } from "../services/index.js";
import MailingService from '../services/MailingService.js';
import auth from "../services/auth.js";
import crypto from 'crypto';

const generateResetToken = () => {return crypto.randomBytes(20).toString('hex')};

const restartPass = async (req, res) => 
{
    try 
    {
        const userEmail = req.params.email;
        const user = await userService.getUserByEmail({ email: userEmail });

        if (!user) 
        {
            return res.status(404).json({ msj: 'Correo electrónico no encontrado' });
        }

        const resetToken = generateResetToken();
        const resetTokenExpiry = new Date();
        resetTokenExpiry.setHours(resetTokenExpiry.getHours() + 1); // Token válido por 1 hora

        // Guarda el token y su fecha de vencimiento en el usuario
        user.resetToken = resetToken;
        user.resetTokenExpiry = resetTokenExpiry;
        await user.save();

        const resetLink = `http://localhost:8080/api/users/resetPassword?token=${resetToken}`; // Sustituye por tu dominio

        const mailService = new MailingService();

        const mailRequest = 
        {
            from: 'e-commerce wine uruguay',
            to: userEmail,
            subject: 'Link de restablecimiento de contraseña',
            html:
            `
                <h1>Su cuenta ha solicitado un restablecimiento de contraseña</h1>
                <p>Si usted no solicitó ningún cambio de contraseña, póngase en contacto con la administración de e-commerce wine Uruguay para que le asesoren sobre el caso y no realice ninguna acción respecto a este correo.</p>
                <a target="_blank" href="${resetLink}"><button>Restablecer contraseña</button></a>  
            `
        }

        const mailResult = await mailService.sendMail(mailRequest);

        return res.status(200).json({ message: 'Correo de restablecimiento enviado con éxito' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Error interno del servidor' });
    }
};

const renderResetPasswordPage = async (req, res) => 
{
    if (req.method === 'GET') 
    {
        const resetToken = req.query.token;
        return res.render('resetPassword', { resetToken });
    } else if (req.method === 'POST') 
    {
        // Procesar el formulario enviado con la nueva contraseña
        const resetToken = req.body.resetToken;
        const newPassword = req.body.newPassword;
        const confirmPassword = req.body.confirmPassword;

        try {
            const user = await userService.getUserByResetToken(resetToken);

            if (!user || user.resetTokenExpiry < new Date()) {return res.status(400).json({ message: 'Tiempo de restablecimiento expirado o usuario invalido'});}

            // Verificar que las contraseñas coincidan
            if (newPassword !== confirmPassword) {return res.status(400).json({ message: 'Las contraseñas no coinciden' });}

            const hashedPasword = await auth.createHash(newPassword); 

            user.password = hashedPasword;
            user.resetToken = null;
            user.resetTokenExpiry = null;
            await user.save();

            return res.status(200).json({ message: 'Contraseña restablecida con exito' });
        } catch (error) {
            return res.status(500).json({ message: 'Error interno del servidor' });
        }
    }
};

const changeUserRole = async (req, res) => 
{
    try 
    {
        const userId = req.params.uid;
        const updatedUser = await userService.changeUserRole(userId);
  
        if (!updatedUser) return res.status(404).json({ message: 'Usuario no encontrado' });
        return res.status(200).json({ message: 'Rol de usuario actualizado exitosamente', user: updatedUser });
    } catch (error) 
    {
        console.error(error);
        return res.status(500).json({ error: 'Error interno del servidor' });
    }
};

export default 
{
    restartPass,
    renderResetPasswordPage, 
    changeUserRole
}