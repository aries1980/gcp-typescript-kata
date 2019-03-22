import express from 'express';
//import cors from 'cors';
//import compression from 'compression';

import routes from './router';

const app = express();

//app.use(responseTime()); // X-Response-Time header.
app.use((req, res, next) => {
  if (process.env.NODE_ENV === 'development') {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Credentials', true);
    res.header('Access-Control-Allow-Methods', 'GET, PUT');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Apikey, X-Requested-With, Content-Type, Accept, Authorization, Cache-Control, Pragma');
  }
  next();
});
app.use(routes);

// Export your express server so you can import it in the lambda function.
export default app;
