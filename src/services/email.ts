import config from 'config';
import axios from 'axios';
import { Context } from '../context';
import { RequestError } from '../utils/errors';

const send = async (context: Context, to: string, message: string, subject: string) => {
  try {
    const { from, headerInfo, endpoint } = config.get('email');
    const mailOptions = { from, to, subject, message };
    
    await axios.post(endpoint, mailOptions, headerInfo);
    context.logger.info(`E-mail message sent to ${to}`);
    context.logger.info(message);
  } catch(error) { throw new RequestError(error.toString()) }
}

export const sendNewContractCreated = async (context: Context, to: string, message: string) => {
  await send(context, to, message, "New Contract request from RSM Dogsy");
  await send(context, config.get('email.admin'), message, "New Contract request created in RSM Dogsy");
}