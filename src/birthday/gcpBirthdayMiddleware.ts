import { Moment } from 'moment';
import moment = require('moment');
import { Request, Response, NextFunction } from 'express';

export const saveBirthdayMiddleware = (storage: any) => async (req: Request, res: Response, next: NextFunction) => {
  const datePattern = /^\d{4}\-(0[1-9]|1[012])\-(0[1-9]|[12][0-9]|3[01])$/;
  const username = req.params.usernameParam ? req.params.usernameParam.replace(/[^a-zA-Z0-9_\/]/g, '') : '';

  try {
    if (!req.body.dateOfBirth) {
      throw new TypeError('The date of birth is missing.');
    }

    if (datePattern.test(req.body.dateOfBirth) === false) {
      throw new TypeError('Invalid date of birth');
    }

    const dateOfBirth: Moment = moment(req.body.dateOfBirth);
    if (dateOfBirth.isValid() === false) {
      throw new TypeError('Invalid date of birth');
    }

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
