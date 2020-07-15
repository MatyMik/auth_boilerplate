import config from 'config';
import nodemailer from 'nodemailer';

import axios from 'axios';
import { Context } from '../context';
import { RequestError } from '../utils/errors';

const sendWithSMTP = async (to: string, subject: string, message: string) => {
  const { host, port, from, fromName } = config.get('email'); 
  const nextFrom = `"${fromName}"<${from}>`;
  const transporter = nodemailer.createTransport({ host, port, secure: false, tls: {rejectUnauthorized: false} });
  const options = { from: nextFrom, to, subject, html: message, text: message }
  await transporter.sendMail(options);
}

const sendWithAxios = async (to: string, subject: string, message: string) => {
  const { endpoint, from, header, fromName } = config.get('email'); 
  const nextFrom = `"${fromName}"<${from}>`;
  await axios.post(endpoint, { from: nextFrom, to, subject, message }, header);
}

const send = async (context: Context, to: string, message: string, subject: string) => {
  try {
    const { host, port } = config.get('email'); 
    if (!host || !port) {
      await sendWithAxios(to, subject, message);
    } else {
      await sendWithSMTP(to, subject, message);
    }

    context.logger.info(`E-mail (${subject}) message sent to ${to}`);
  } catch(error) { throw new RequestError(error.toString()) }
}

export const sendNewRefreshToken = async (context: Context, to: string, message: string, title: string) => {
  await send(context, to, message, `Request for new token – Új token igénylése - ${title}`);
}

export const sendNewHash = async (context: Context, to: string, message: string, title: string) => {
  await send(context, to, message, `New token – Új token – ${title}`);
}

