import express from 'express';
import { getUserFromPermanent } from '../middleware/user/getUserFromPermanent';
import { verifyEngineers } from '../controllers/admin/verifyEngineers';
import { getUnverifiedEngineers } from '../controllers/admin/getUnverifiedEngineers';
import { getEngineersUnderYou } from '../controllers/admin/getEngineersUnderYou';
import { assignComplaints } from '../controllers/admin/assignComplaint';
import { getAllEngineers } from '../controllers/admin/getAllEngineers';
import { getEngineerDetails } from '../controllers/admin/getEngineerDetails';
import { makeEngineers } from '../controllers/admin/makeEngineers';
import { doesComplaintExist } from '../middleware/inputValidation/complaint/doesComplaintExist';
import { doesEngineerExist } from '../middleware/inputValidation/engineer/doesEngineerExist';
import { doesComplaintBelongToTheEngineer } from '../middleware/inputValidation/complaint/doesComplaintBelongToTheEngineer';
import { isEngineerBelow } from '../middleware/engineer/isEngineerBelow';
import { attachQueryOfEnggUnderYou } from '../middleware/inputValidation/filters/attachQueryOfEnggUnderYou';
import { makeEngineerValidation } from '../middleware/inputValidation/sign/makeEngineerValidation';
import { isEngineerVerified } from '../middleware/inputValidation/engineer/isEngineerVerified';
import { deleteEngineer } from '../controllers/admin/deleteEngineer';
const router = express.Router();
router
  .route('/getUnverifiedEngineers')
  .get(getUserFromPermanent, getUnverifiedEngineers);
router
  .route('/verifyEngineer')
  .post(getUserFromPermanent, doesEngineerExist, verifyEngineers);
router
  .route('/getEngineersUnderYou')
  .get(getUserFromPermanent, attachQueryOfEnggUnderYou, getEngineersUnderYou);
router
  .route('/assignComplaint')
  .post(
    getUserFromPermanent,
    doesComplaintExist,
    doesEngineerExist,
    isEngineerVerified,
    doesComplaintBelongToTheEngineer,
    isEngineerBelow,
    assignComplaints
  );
router.route('/getAllEngineers').get(getUserFromPermanent, getAllEngineers);
router
  .route('/getEngineerDetails')
  .post(
    getUserFromPermanent,
    doesEngineerExist,
    isEngineerBelow,
    getEngineerDetails
  );
router
  .route('/makeEngineer')
  .post(getUserFromPermanent, makeEngineerValidation, makeEngineers);
router
  .route('/deleteEngineer')
  .delete(getUserFromPermanent, doesEngineerExist, deleteEngineer);
export { router as adminRouter };
