import express from 'express';
import { getAllHostels } from '../controllers/fi/getHostels';
import { getAllNatures } from '../controllers/admin/getAllNatures';
const router = express.Router();
router.route('/getAllHostels').get(getAllHostels);
router.route('/getNature').get(getAllNatures);
export { router as openRouter };
