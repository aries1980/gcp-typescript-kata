//import { cors } from 'cors';
//import { compression } from 'compression';
import express from 'express';
import birthday from './birthday';
//import healthcheck from './healthcheck';

const router = express.Router();

router.use('/hello', birthday);
//router.use('/health', healthcheck);

export default router;
