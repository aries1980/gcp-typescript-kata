import express from 'express';
import { Request, Response } from 'express';
const birthdayPing = require('../birthday/gcpBirthdayMiddleware  ').ping;

const router: express.Router = express.Router();
const pings: any = {
  deepcrawl: birthdayPing,
};

router.get('/', (req: Request, res: Response) => {
  res.sendStatus(200);
});

router.get('/downstream', async (req: Request, res: Response) => {
  const report: any = {};

  for (const i in pings) {
    try {
      await pings[i]();
      report[i] = 'UP';
    }
    catch (err) {
      report[i] = 'DOWN';
      console.log(err);
    }
  }

  res.setHeader('Content-Type', 'application/json');
  res.send(JSON.stringify(report, undefined, 2));
});

export default router;
