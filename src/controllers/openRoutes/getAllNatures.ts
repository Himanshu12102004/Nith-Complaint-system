import {
  Custom_response,
  async_error_handler,
  sync_middleware_type,
} from '@himanshu_guptaorg/utils';
import { NatureModel } from '../../models/natureOfComplaintModel';

const getAllNatures: sync_middleware_type = async_error_handler(
  async (req, res, next) => {
    const all = req.query.all;
    const formattedSubNatures: any = {};
    const formattedNatures: { label: string; value: string }[] = [];
    if (all == 'true') {
      const natures = await NatureModel.find({});
      natures.forEach((elem) => {
        formattedNatures.push({
          label: elem.nature.name,
          value: elem.nature.name,
        });
        formattedSubNatures[elem.nature.name] = elem.subNature.map((sub) => {
          return { label: sub.name, value: sub.name };
        });
      });
    } else {
      const natures = await NatureModel.find({ 'nature.isActive': true });
      natures.forEach((elem) => {
        formattedNatures.push({
          label: elem.nature.name,
          value: elem.nature.name,
        });
        formattedSubNatures[elem.nature.name] = elem.subNature
          .map((sub) => {
            if (sub.isActive) return { label: sub.name, value: sub.name };
            else return false;
          })
          .filter((sub) => {
            return sub;
          });
      });
    }
    const response = new Custom_response(
      true,
      null,
      { natures: formattedNatures, subNatures: formattedSubNatures },
      'success',
      200,
      null
    );
    res.status(response.statusCode).json(response);
  }
);
export { getAllNatures };
