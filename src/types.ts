import { Request } from 'express';
import { Context } from './context';
export { Context } from './context';

export type ContextualRequest = Request & { context: Context; rawBody: Buffer };

export type Delta<T> = { [key in keyof T]?: T[key] };
