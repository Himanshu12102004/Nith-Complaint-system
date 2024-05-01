import express from 'express';
import { getUserFromPermanent } from '../middleware/user/getUserFromPermanent';
import { lodgeComplaint } from '../controllers/complaint/lodgeComplaint';
import { getYourComplaints } from '../controllers/complaint/getYourComplaints';
import { getAssignedComplaints } from '../controllers/complaint/getAssignedComplaints';
import { validateComplaintType } from '../middleware/inputValidation/complaint/validateComplaintType';
import { parseFilters } from '../middleware/inputValidation/filters/parseFilters';
import { isNotEngineerMiddleware } from '../middleware/engineer/isNotEngineer';
import { isEngineerMiddleware } from '../middleware/engineer/isEngineer';
const router = express.Router();
router
  .route('/lodgeComplaint')
  .post(getUserFromPermanent, validateComplaintType, lodgeComplaint);
router
  .route('/getMyComplaints')
  .post(
    getUserFromPermanent,
    isNotEngineerMiddleware,
    parseFilters,
    getYourComplaints
  );
router
  .route('/getAssignedComplaints')
  .post(
    getUserFromPermanent,
    isEngineerMiddleware,
    parseFilters,
    getAssignedComplaints
  );

export { router as complaintRouter };
