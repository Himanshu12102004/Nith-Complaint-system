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
    if (!filters) {
      req.parsedFilters = query;
      next();
      return;
    }
    console.log('dfjdhfhdj');
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

    if (filters.complaintId) {
      query.complaintId = filters.complaintId;
    }

    if (filters.isComplete !== undefined) {
      query.isComplete = filters.isComplete;
    }
    req.parsedFilters = query;
    next();
  } catch (error) {
    next(error);
  }
};

export { parseFilters };
