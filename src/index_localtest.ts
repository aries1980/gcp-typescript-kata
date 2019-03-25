import app from './app';

/**
 * Start Express server.
 */
const port = parseInt(process.env.PORT, 10) || 3333;

const server = app.listen(port, () => {
    console.log('Press CTRL-C to stop\n');
});
