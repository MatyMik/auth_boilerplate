import config from 'config';
import nodemailer from 'nodemailer';

import axios from 'axios';
import { Context } from '../context';
import { RequestError } from '../utils/errors';

const transporter = nodemailer.createTransport({
  host: config.get('email.host'),
  port: 587,
  auth: {
    user: 'geovany.kilback20@ethereal.email',
    pass: 'QuDD3QtxvmadzmYmx4'
  },
  tls: {rejectUnauthorized: false}
});

const send = async (context: Context, to: string, message: string, subject: string) => {
  try {
    const { from } = config.get('email'); 
    await transporter.sendMail({ from, to, subject, text: message, html: message });
    context.logger.info(`E-mail message sent to ${to}`);
    context.logger.info(message);
  } catch(error) { throw new RequestError(error.toString()) }
}

export const sendNewContractCreated = async (context: Context, to: string, message: string) => {
  await send(context, config.get('email.to'), message, "New Contract request from RSM Dogsy");
  await send(context, config.get('email.admin'), message, "New Contract request created in RSM Dogsy");
}