require('dotenv').config();
import { create as createContext } from './context';
import { start as startServer } from './server';

createContext().then(startServer);
