import express from 'express';
import users from './users';
import trade from './trade';
import portfolio from './portfolio';
import holdings from './holdings';
import returns from './returns';

const api = express();
const router = express.Router();

router.use('/', users);
router.use('/', trade);
router.use('/', portfolio);
router.use('/', holdings);
router.use('/', returns);

// rest routes will be handled by next

api.use(router);
export default api;
