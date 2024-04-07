import express from 'express';
import { getUserFromPermanent } from '../middleware/getUserFromPermanent';
import { lodgeComplaint } from '../controllers/complaint/lodgeComplaint';
import { getYourComplaints } from '../controllers/complaint/getYourComplaints';
import { getAssignedComplaints } from '../controllers/complaint/getAssignedComplaints';
import { validateComplaintType } from '../middleware/validateComplaintType';
import { parseFilters } from '../middleware/parseFilters';
const router = express.Router();
router
  .route('/lodgeComplaint')
  .post(getUserFromPermanent, validateComplaintType, lodgeComplaint);
router
  .route('/getMyComplaints')
  .post(getUserFromPermanent, parseFilters, getYourComplaints);
router
  .route('/getAssignedComplaints')
  .post(getUserFromPermanent, parseFilters, getAssignedComplaints);

export { router as complaintRouter };
