import {
  Custom_response,
  async_error_handler,
  sync_middleware_type,
} from '@himanshu_guptaorg/utils';
import { NatureModel } from '../../models/natureOfComplaintModel';

const getAllNatures: sync_middleware_type = async_error_handler(
  async (req, res, next) => {
    const all = req.query.all;
    const formattedNatures: any = {};
    if (all == 'true') {
      const natures = await NatureModel.find({});
      natures.forEach((elem) => {
        formattedNatures[elem.nature.name] = elem.subNature.map((sub) => {
          return sub.name;
        });
      });
    } else {
      const natures = await NatureModel.find({ 'nature.isActive': true });
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
    }
    const response = new Custom_response(
      true,
      null,
      { natures: formattedNatures },
      'success',
      200,
      null
    );
    res.status(response.statusCode).json(response);
  }
);
export { getAllNatures };
