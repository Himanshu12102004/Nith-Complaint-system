import express from 'express';
import { getUserFromPermanent } from '../middleware/user/getUserFromPermanent';
import { setTentativeDateOfCompletion } from '../controllers/complaintControls/setTentativeDateOfCompletion';
import { closeComplaint } from '../controllers/complaintControls/closeComplaint';
import { doesComplaintExist } from '../middleware/inputValidation/complaint/doesComplaintExist';
const router = express.Router();
router
  .route('/setTentativeDate')
  .patch(
    getUserFromPermanent,
    doesComplaintExist,
    setTentativeDateOfCompletion
  );
router
  .route('/closeComplaint')
  .patch(getUserFromPermanent, doesComplaintExist, closeComplaint);
export { router as complaintControllerRouter };
