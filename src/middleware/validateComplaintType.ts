import { Custom_error, sync_middleware_type } from '@himanshu_guptaorg/utils';
import {
  NatureOfComplaint,
  SubNatureOfCarpentryComplaint,
  SubNatureOfElectricalComplaint,
  SubNatureOfMasonryComplaint,
  SubNatureOfPlumbingComplaint,
} from '../types/types';

const validateComplaintType: sync_middleware_type = (req, res, next) => {
  try {
    const { natureOfComplaint, subNatureOfComplaint } = req.body;
    if (!natureOfComplaint || !subNatureOfComplaint) {
      throw new Custom_error({
        errors: [{ message: 'invalidNatureOfComplaintOrSubNatureOfComplaint' }],
        statusCode: 400,
      });
    }

    switch (natureOfComplaint) {
      case NatureOfComplaint.CARPENTRY:
        if (
          ![
            SubNatureOfCarpentryComplaint.BROKEN_DOOR,
            SubNatureOfCarpentryComplaint.DAMAGED_WINDOW,
          ].includes(subNatureOfComplaint)
        ) {
          throw new Custom_error({
            errors: [{ message: 'invalidSubNatureOfComplaintForCarpentry' }],
            statusCode: 400,
          });
        }
        break;

      case NatureOfComplaint.ELECTRICAL:
        if (
          ![
            SubNatureOfElectricalComplaint.BROKEN_BULB,
            SubNatureOfElectricalComplaint.FAULTY_FAN,
            SubNatureOfElectricalComplaint.MALFUNCTIONING_SWITCH,
            SubNatureOfElectricalComplaint.DAMAGED_SOCKET,
            SubNatureOfElectricalComplaint.FAULTY_GYESER,
          ].includes(subNatureOfComplaint)
        ) {
          throw new Custom_error({
            errors: [{ message: 'invalidSubNatureOfComplaintForElectrical' }],
            statusCode: 400,
          });
        }
        break;

      case NatureOfComplaint.MASONRY:
        if (
          ![
            SubNatureOfMasonryComplaint.DAMPNESS_ISSUE,
            SubNatureOfMasonryComplaint.LOOSE_PLASTER,
            SubNatureOfMasonryComplaint.NEED_WHITEWASHING,
            SubNatureOfMasonryComplaint.BROKEN_FLOOR_TILE,
          ].includes(subNatureOfComplaint)
        ) {
          throw new Custom_error({
            errors: [{ message: 'invalidSubNatureOfComplaintForMasonry' }],
            statusCode: 400,
          });
        }
        break;

      case NatureOfComplaint.PLUMBING:
        if (
          ![
            SubNatureOfPlumbingComplaint.WATER_LEAKAGE,
            SubNatureOfPlumbingComplaint.NO_WATER_SUPPLY,
            SubNatureOfPlumbingComplaint.CLOGGED_DRAINAGE,
          ].includes(subNatureOfComplaint)
        ) {
          throw new Custom_error({
            errors: [{ message: 'invalidSubNatureOfComplaintForPlumbing' }],
            statusCode: 400,
          });
        }
        break;

      default:
        throw new Custom_error({
          errors: [{ message: 'invalidNatureOfComplaint' }],
          statusCode: 400,
        });
    }

    next();
  } catch (err) {
    next(err);
  }
};

export { validateComplaintType };
