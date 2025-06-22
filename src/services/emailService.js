import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

export const enviarCodigoRecuperacion = async (correo, codigo) => {
  if (!process.env.SMTP_HOST) {
    console.warn('SMTP no configurado. Código:', codigo);
    return;
  }
  await transporter.sendMail({
    from: process.env.SMTP_FROM || process.env.SMTP_USER,
    to: correo,
    subject: 'Recuperación de contraseña',
    text: `Tu código de recuperación es ${codigo}`,
    html: `<p>Tu código de recuperación es <b>${codigo}</b></p>`
  });
};
