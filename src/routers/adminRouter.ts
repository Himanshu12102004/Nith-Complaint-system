import express from 'express';
import { getUserFromPermanent } from '../middleware/getUserFromPermanent';
import { verifyEngineers } from '../controllers/admin/verifyEngineers';
import { getUnverifiedEngineers } from '../controllers/admin/getUnverifiedEngineers';
import { getEngineersUnderYou } from '../controllers/admin/getEngineersUnderYou';
import { assignComplaints } from '../controllers/admin/assignComplaint';
import { get } from 'mongoose';
import { getAllEngineers } from '../controllers/admin/getAllEngineers';
import { getEngineerDetails } from '../controllers/admin/getEngineerDetails';
const router = express.Router();
router
  .route('/getUnverifiedEngineers')
  .get(getUserFromPermanent, getUnverifiedEngineers);
router.route('/verifyEngineer').post(getUserFromPermanent, verifyEngineers);
router
  .route('/getEngineersUnderYou')
  .get(getUserFromPermanent, getEngineersUnderYou);
router.route('/assignComplaint').post(getUserFromPermanent, assignComplaints);
router.route('/getAllEngineers').get(getUserFromPermanent, getAllEngineers);
router
  .route('/getEngineerDetails')
  .post(getUserFromPermanent, getEngineerDetails);
export { router as adminRouter };
