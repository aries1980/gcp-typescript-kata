import * as express from 'express';
// import { restPing } from '../utils/fetch.js';
import { Storage } from '@google-cloud/storage';
import { saveBirthdayMiddleware, loadBirthdayMiddleware } from './gcpBirthdayMiddleware';

const storage = new Storage();
const saveBirthday = saveBirthdayMiddleware(storage);
const loadBirthday = loadBirthdayMiddleware(storage);

const router = express.Router();
router.route('/:usernameParam')
  .put(saveBirthday)
  .get(loadBirthday);

// export const ping = () => {
//   return restPing(`${slackApiEndpoint}`, proxyReqOptDecorator(), 'Birthday API');
// };

export default router;
