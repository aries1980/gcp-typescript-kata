import app from './app';
const port = parseInt(process.env.PORT, 10) || 3333;
app.listen(port, console.info(`External Integration endpoint is running on port ${port}.`)); // eslint-disable-line no-console
