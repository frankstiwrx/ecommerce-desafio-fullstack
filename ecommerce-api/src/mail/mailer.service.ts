import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailerService {
  private transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 465),
    secure: String(process.env.SMTP_SECURE).toLowerCase() === 'true',
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
  });

  async sendVerificationEmail(to: string, token: string) {
    const verifyUrl = `${process.env.APP_URL}/auth/verify-email?token=${token}`;
    await this.transporter.sendMail({
      from: process.env.MAIL_FROM || process.env.SMTP_USER,
      to,
      subject: 'Verifique seu e-mail',
      text: `Clique para verificar: ${verifyUrl}`,
      html: `<p>Bem-vindo! ✨</p><p>Clique para verificar seu e-mail:</p>
             <p><a href="${verifyUrl}">${verifyUrl}</a></p>`,
    });
  }
}
