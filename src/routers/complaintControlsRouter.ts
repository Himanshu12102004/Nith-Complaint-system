import express from 'express';
import { getUserFromPermanent } from '../middleware/getUserFromPermanent';
import { setTentativeDateOfCompletion } from '../controllers/complaintControls/setTentativeDateOfCompletion';
import { closeComplaint } from '../controllers/complaintControls/closeComplaint';
const router = express.Router();
router
  .route('/setTentativeDate')
  .patch(getUserFromPermanent, setTentativeDateOfCompletion);
router.route('/closeComplaint').patch(getUserFromPermanent, closeComplaint);
export { router as complaintControllerRouter };
