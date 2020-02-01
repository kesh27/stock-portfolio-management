import express from 'express';
import users from './users';

const api = express();
const router = express.Router();

router.use('/', users);

api.use(router);
export default api;
