import express from 'express';
import users from './users';
import trade from './trade';
import portfolio from './portfolio';
import holdings from './holdings';

const api = express();
const router = express.Router();

router.use('/', users);
router.use('/', trade);
router.use('/', portfolio);
router.use('/', holdings);

api.use(router);
export default api;
