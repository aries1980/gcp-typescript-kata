const express = require('express');
const deepcrawlPing = require('../birthday/deepcrawl').ping;

const router = express.Router();
const pings = {
  deepcrawl: deepcrawlPing,
};

router.get('/', (req, res) => {
  res.sendStatus(200);
});

router.get('/downstream', async (req, res) => {
  let report = {};

  for (let i in pings) {
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
  res.send(JSON.stringify(report, null, 2));
});

export default router;
