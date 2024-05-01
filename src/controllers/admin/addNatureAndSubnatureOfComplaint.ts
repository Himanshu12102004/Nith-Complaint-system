import {
  Custom_error,
  Custom_response,
  async_error_handler,
  sync_middleware_type,
} from '@himanshu_guptaorg/utils';
import { Designations, requestWithPermanentUser } from '../../types/types';
import { NatureModel } from '../../models/natureOfComplaintModel';

const addNatureAndSubnatureOfComplaint: sync_middleware_type =
  async_error_handler(async (req: requestWithPermanentUser, res, next) => {
    if (
      req.permanentUser!.designation != Designations.CHIEF_EXECUTIVE_ENGINEER
    ) {
      throw new Custom_error({
        errors: [{ message: 'notAuthorized' }],
        statusCode: 401,
      });
    }
    if (!req.body.nature)
      throw new Custom_error({
        errors: [{ message: 'pleaseSendANatureOfComplaint' }],
        statusCode: 400,
      });
    const { nature, subNature } = req.body;
    if (!req.body.subNature)
      throw new Custom_error({
        errors: [{ message: 'pleaseGiveAtLeastOneSubNatureOfComplaint' }],
        statusCode: 400,
      });
    const previousNature = await NatureModel.findOne({
      'nature.name': nature,
    });
    let updatedNature: any;
    if (!previousNature) {
      const natureDoc = NatureModel.build({ nature, subNature });
      updatedNature = await natureDoc.save();
    } else if (!previousNature.nature.isActive) {
      const formattedSubNatures: { name: string; isActive: boolean }[] = [];
      subNature.forEach((elem: string) => {
        formattedSubNatures.push({ name: elem, isActive: true });
      });
      updatedNature = await NatureModel.updateOne(
        { 'nature.name': nature },
        { $set: { subNature: formattedSubNatures, 'nature.isActive': true } }
      );
    } else {
      subNature.forEach((inputtedSubNature: string) => {
        let flag = 0;
        previousNature.subNature.forEach((dataBaseSubNatures) => {
          if (inputtedSubNature == dataBaseSubNatures.name) {
            flag = 1;
            if (!dataBaseSubNatures.isActive) {
              dataBaseSubNatures.isActive = true;
            }
          }
        });
        if (flag == 0)
          previousNature.subNature.push({
            name: inputtedSubNature,
            isActive: true,
          });
      });
      updatedNature = await NatureModel.updateOne(
        { 'nature.name': nature },
        { $set: { subNature: previousNature.subNature } }
      );
    }
    const response = new Custom_response(
      true,
      null,
      updatedNature,
      'success',
      200,
      null
    );
    res.status(response.statusCode).json(response);
  });

export { addNatureAndSubnatureOfComplaint };
