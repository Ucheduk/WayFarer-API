import express from 'express';
import bodyParser from 'body-parser';
import swaggerUi from 'swagger-ui-express';
import debug from 'debug';
import usersRouter from './routes/users';
import tripRouter from './routes/trips';
import bookingRouter from './routes/bookings';
import * as swaggerDoc from '../swagger.json';

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
const router = express.Router();

app.use('/api/v1', usersRouter(router));
app.use('/api/v1', tripRouter(router));
app.use('/api/v1', bookingRouter(router));
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDoc));

const port = process.env.PORT || 8000;
const server = app.listen(port, () => debug('dev')(`Listening on port ${port}...`));

export default server;
