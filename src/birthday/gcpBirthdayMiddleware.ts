import * as moment from 'moment';
import { Request, Response, NextFunction } from 'express';

export const saveBirthday = (storage: any) => async (req: Request, res: Response, next: NextFunction) => {
  const datePattern = '^\d{4}\-(0[1s-9]|1[012])\-(0[1-9]|[12][0-9]|3[01])$';
  const username = req.param.userParam;

  try {
    res.status(204);
    console.info({ message: 'The birthday has been saved.', req})
  } catch (err) {
    res.status(504);
    res.json({ message: err.message });
    console.error({ message: err.message, req })
  }

  next();
};

export const loadBirthday = (storage: any) => async (req: Request, res: Response, next: NextFunction) => {
    const username = req.param.userParam;
    // @TODO: calculate the birthday.
    const dayUntilBirthday = 1;

    try {
        res.status(200);
        res.json({ message: `Hello ${username}! Your birthday is in ${dayUntilBirthday} day(s).`});
        console.info({ message: 'The birthday has been saved.', req})
    } catch (err) {
        res.status(504);
        res.json({ message: err.message });
        console.error({ message: err.message, req })
    }
};
