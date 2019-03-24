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
    const dateOfBirth = extractDateOfBirth(req.body.dateOfBirth);

    res.status(204);
    console.info({ message: 'The birthday has been saved.', username, dateOfBirth });
  } catch (err) {
    res.status(504);
    res.json({ message: err.message });
    console.error({ message: err.message });
  }

  next();
};

export const loadBirthdayMiddleware = (storage: any) => async (req: Request, res: Response, next: NextFunction) => {
  const username = req.params.usernameParam;
  // @TODO: calculate the birthday.
  const dayUntilBirthday = 1;

  try {
    res.status(200);
    res.json({message: `Hello ${username}! Your birthday is in ${dayUntilBirthday} day(s).`});
    console.info({message: 'The birthday has been loaded.', req});
  } catch (err) {
    res.status(504);
    res.json({message: err.message});
    console.error({message: err.message, req});
  }
};
