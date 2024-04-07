import { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import { requestWithPermanentUserAndParsedFilters } from '../types/types';

const parseFilters = async (
  req: requestWithPermanentUserAndParsedFilters,
  res: Response,
  next: NextFunction
) => {
  try {
    const filters = req.body.filters;
    const query: any = {};
    const moreFilters: any = {};
    moreFilters.pages = { pageNo: 1, pageSize: 10 };
    if (!filters) {
      req.parsedFilters = query;
      next();
      return;
    }
    if (filters.complaintId) {
      console.log(filters);
      query.complaintId = filters.complaintId;
      req.parsedFilters = query;
      next();
      return;
    }
    if (filters.lodgedBy) {
      query.lodgedBy = new mongoose.Types.ObjectId(filters.lodgedBy as string);
    }
    if (filters.natureOfComplaint) {
      query.natureOfComplaint = filters.natureOfComplaint;
    }

    if (filters.subNatureOfComplaint) {
      query.subNatureOfComplaint = filters.subNatureOfComplaint;
    }

    if (filters.currentlyAssignedTo) {
      query.currentlyAssignedTo = new mongoose.Types.ObjectId(
        filters.currentlyAssignedTo as string
      );
    }
    if (filters.lodgedOnStart && filters.lodgedOnEnd) {
      query.lodgedOn = {
        $gte: filters.lodgedOnStart,
        $lte: filters.lodgedOnEnd,
      };
    } else if (filters.lodgedOnStart) {
      query.lodgedOn = { $gte: filters.lodgedOnStart };
    } else if (filters.lodgedOnEnd) {
      query.lodgedOn = { $lte: filters.lodgedOnEnd };
    }

    if (filters.isComplete !== undefined) {
      query.isComplete = filters.isComplete;
    }
    if (filters.hostel) moreFilters.hostel = filters.hostel;
    if (filters.pages) {
      if (filters.pages.pageNo) moreFilters.pages.pageNo = filters.pages.pageNo;
      if (filters.pages.pageSize) moreFilters.pageSize = filters.pages.pageSize;
    }
    req.moreFilters = moreFilters;
    req.parsedFilters = query;
    next();
  } catch (error) {
    next(error);
  }
};

export { parseFilters };
