import express from 'express';
import users from './users';
import trade from './trade';

const api = express();
const router = express.Router();

router.use('/', users);
router.use('/', trade);

api.use(router);
export default api;
