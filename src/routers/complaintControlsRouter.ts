import express from 'express';
import { getUserFromPermanent } from '../middleware/getUserFromPermanent';
import { setTentativeDateOfCompletion } from '../controllers/complaintControls/setTentativeDateOfCompletion';
const router = express.Router();
router
  .route('/setTentativeDate')
  .post(getUserFromPermanent, setTentativeDateOfCompletion);
export { router as complaintControllerRouter };
