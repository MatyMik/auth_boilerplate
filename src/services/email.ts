import config from 'config';
import nodemailer from 'nodemailer';

import axios from 'axios';
import { Context } from '../context';
import { RequestError } from '../utils/errors';

const sendWithSMTP = async (to: string, subject: string, message: string) => {
  const { host, port, from } = config.get('email'); 
  const transporter = nodemailer.createTransport({ host, port, secure: false, tls: {rejectUnauthorized: false} });
  const options = { from, to, subject, html: message, text: message }
  await transporter.sendMail(options);
}

const sendWithAxios = async (to: string, subject: string, message: string) => {
  const { endpoint, from, header } = config.get('email'); 
  await axios.post(endpoint, { from, to, subject, message }, header);
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

export const sendNewContractCreated = async (context: Context, to: string, message: string) => {
  await send(context, config.get('email.to'), message, "New Contract request from RSM Dogsy");
  await send(context, config.get('email.admin'), message, "New Contract request created in RSM Dogsy");
}

export const sendNewRefreshToken = async (context: Context, message: string) => {
  await send(context, config.get('email.to'), message, "New permission request RSM Dogsy");
}
