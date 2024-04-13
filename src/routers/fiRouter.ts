import express from 'express';
import { getUserFromPermanent } from '../middleware/user/getUserFromPermanent';
import { parseFilters } from '../middleware/inputValidation/filters/parseFilters';
import { getAllComplaints } from '../controllers/fi/getAllComplaints';
import { getAllHostels } from '../controllers/fi/getHostels';
import { makeHostel } from '../controllers/fi/makeHostel';
import { deleteHostel } from '../controllers/fi/deleteHostel';
const router = express.Router();
router
  .route('/getAllComplaints')
  .post(getUserFromPermanent, parseFilters, getAllComplaints);
router.route('/makeHostel').post(getUserFromPermanent, makeHostel);
router.route('/deleteHostel').delete(getUserFromPermanent, deleteHostel);
router.route('/getAllHostels').get(getAllHostels);
export { router as fiRouter };
