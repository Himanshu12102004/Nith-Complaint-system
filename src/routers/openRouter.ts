import express from 'express';
import { getAllHostels } from '../controllers/openRoutes/getHostels';
import { getAllNatures } from '../controllers/openRoutes/getAllNatures';
const router = express.Router();
router.route('/getAllHostels').get(getAllHostels);
router.route('/getNature').get(getAllNatures);
export { router as openRouter };
