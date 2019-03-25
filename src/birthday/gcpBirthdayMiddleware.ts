import { Moment } from 'moment';
import moment = require('moment');
import { Request, Response, NextFunction } from 'express';

export const extractDateOfBirth = (date: string): Moment => {
  const datePattern = /^\d{4}\-(0[1-9]|1[012])\-(0[1-9]|[12][0-9]|3[01])$/;
  if (datePattern.test(date) === false) {
    throw new TypeError('Invalid date of birth');
  }

  const dateOfBirth: Moment = moment(date);
  if (dateOfBirth.isValid() === false) {
    throw new TypeError('Invalid date of birth');
  }

  return dateOfBirth;
};

export const extractUsername = (usernameParam: string) => {
  const username = usernameParam ? usernameParam.replace(/[^a-zA-Z0-9_\/]/g, '') : '';
  if (username === '') {
      throw new TypeError('The username is missing.');
  }

  return username;
};

export const saveBirthdayMiddleware = (storage: any) => async (req: Request, res: Response, next: NextFunction) => {
  try {
    const username = extractUsername(req.params.usernameParam);
    const dateOfBirth = extractDateOfBirth(req.body.dateOfBirth).format('YYYY-MM-DD');

    const birthdayStorage = process.env.GCS_BUCKET_BIRTHDAY;
    const myBucket = storage.bucket(birthdayStorage);
    const object = myBucket.file(username);

    object.save(dateOfBirth, (err: any) => {
      if (!err) {
        throw new EvalError(JSON.stringify({ message: 'Unsuccessful save. Google is down?', err }));
      }
    });

    console.info({ message: 'The birthday has been saved.', username, dateOfBirth });
    res.status(204).end();
  } catch (err) {
    res.status(504);
    res.json({ message: err.message });
    console.error({ message: err.message });
  }

  next();
};

export const loadBirthdayMiddleware = (storage: any) => async (req: Request, res: Response, next: NextFunction) => {

  try {
    const birthdayStorage = process.env.GCS_BUCKET_BIRTHDAY;
    const username = extractUsername(req.params.usernameParam);

    const content = await storage
      .bucket(birthdayStorage)
      .file(username)
      .download();

    const dateOfBirth = extractDateOfBirth(content.toString());
    const message = getResponse(username, dateOfBirth);

    res.status(200);
    res.json({ message });
    console.info({message: 'The birthday has been loaded.'});

  } catch (err) {
    res.status(504);
    res.json({message: err.message});
    console.error({message: err.message});
  }

  next();
};

export const getResponse = (username: string, dateOfBirth: Moment) => {
  const today = moment();

  dateOfBirth.year(today.year());
  let dateDiff = dateOfBirth.diff(today, 'days');

  if (dateDiff === 0) {
    return `Hello ${username}! Happy birthday!`;
  }

  if (dateDiff < 0) {
    dateOfBirth.add(1, 'years');
    dateDiff = dateOfBirth.diff(today, 'days');
  }

  return `Hello ${username}! Your birthday is in ${dateDiff} day(s).`;
};
