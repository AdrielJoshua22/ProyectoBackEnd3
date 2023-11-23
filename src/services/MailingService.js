import nodemailer from 'nodemailer';
import config from '../../config.js';

export default class MailingService 
{
    constructor()
    {
        this.transport = nodemailer.createTransport(
        {
            service:'gmail',
            port:587,
            auth:
            {
                user: config.GMAIL_USER,
                pass: config.GMAIL_PASS
            }
        })
    }

    sendMail = async (mailRequest)=>
    {
        const result = await this.transport.sendMail(mailRequest);
        return result;
    }
}