//This MailService uses Nodemailer to send OTP emails to users for account verification.

import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    },
  });

  async sendOtpEmail(to: string, otp: string) {
    await this.transporter.sendMail({
      to,
      subject: 'Your OTP Code',
      html: `<h2>Your OTP is <b>${otp}</b></h2>`,
    });
  }
}
