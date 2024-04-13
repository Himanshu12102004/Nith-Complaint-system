import {
  Custom_error,
  Custom_response,
  async_error_handler,
  sync_middleware_type,
} from '@himanshu_guptaorg/utils';
import { HostelModel } from '../../models/hostelModel';
import { Request, Response, NextFunction } from 'express';

const getAllHostels: sync_middleware_type = async_error_handler(
  async (req: Request, res: Response, next: NextFunction) => {
    const hostels = await HostelModel.find({}, 'name');
    const hostelNames = hostels.map((hostel) => hostel.name);
    const response = new Custom_response(
      true,
      null,
      { hostels: hostelNames },
      'success',
      200,
      null
    );
    res.status(response.statusCode).json(response);
  }
);

export { getAllHostels };
