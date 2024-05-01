import {
  Custom_error,
  async_error_handler,
  sync_middleware_type,
} from '@himanshu_guptaorg/utils';
import { NatureModel } from '../../../models/natureOfComplaintModel';

const validateComplaintType: sync_middleware_type = async_error_handler(
  async (req, res, next) => {
    const { natureOfComplaint, subNatureOfComplaint } = req.body;
    if (!natureOfComplaint || !subNatureOfComplaint) {
      throw new Custom_error({
        errors: [{ message: 'invalidNatureOfComplaintOrSubNatureOfComplaint' }],
        statusCode: 400,
      });
    }
    const natures = await NatureModel.find({ 'nature.isActive': true });
    let formattedNatures: any = {};
    natures.forEach((elem) => {
      formattedNatures[elem.nature.name] = elem.subNature
        .map((sub) => {
          if (sub.isActive) return sub.name;
          else return false;
        })
        .filter((sub) => {
          return sub;
        });
    });
    if (
      !(
        formattedNatures[natureOfComplaint] &&
        formattedNatures[natureOfComplaint].includes(subNatureOfComplaint)
      )
    ) {
      throw new Custom_error({
        errors: [{ message: 'invalidNatureOfComplaintOrSubNatureOfComplaint' }],
        statusCode: 400,
      });
    }
    next();
  }
);

export { validateComplaintType };
