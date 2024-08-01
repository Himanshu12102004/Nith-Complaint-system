import { Request } from 'express';
import { UserDoc } from '../models/users/temporaryUser';
import { permanentUserDoc } from '../models/users/userSchema';
import { ComplaintDoc } from '../models/complaints/complaintModel';
export enum Designations {
  FACULTY = 'Faculty',
  WARDEN = 'Warden',
  CHIEF_EXECUTIVE_ENGINEER = 'Chief Executive Engineer',
  ASSISTANT_ENGINEER = 'Assistant Engineer',
  JUNIOR_ENGINEER = 'Junior Engineer',
  SUPERVISOR = 'Supervisor',
  FI_CONSTRUCTION_CELL = 'FI construction cell',
}

export enum RequestedFor {
  EMAIL_VERIFICATION = 'Email Verification',
  PASSWORD_CHANGE = 'Password Change',
  FORGOT_PASSWORD = 'Forgot Password',
}

export interface requestWithDeviceFingerprint extends Request {
  deviceFingerprint?: string;
  operatingSystem?: string;
}
export interface requestWithTempUser extends requestWithDeviceFingerprint {
  tempUser?: UserDoc;
}
export interface requestWithPermanentUser extends Request {
  permanentUser?: permanentUserDoc;
}
export interface requestWithPermanentUserAndDeviceFingerPrint
  extends requestWithPermanentUser {
  deviceFingerprint?: string;
}
export interface requestWithPermanentUserAndParsedFilters
  extends requestWithPermanentUser {
  parsedFilters?: Object;
  moreFilters?: any;
}
export interface requestWithQueryAndPermanentUser
  extends requestWithPermanentUser {
  dbQuery?: any;
}
export interface requestWithEngineer extends requestWithPermanentUser {
  engineer?: permanentUserDoc;
}
export interface requestWithComplaintAndEngineer
  extends requestWithPermanentUser {
  complaint?: ComplaintDoc;
  engineer?: permanentUserDoc;
}
export enum NatureOfComplaint {
  MASONRY = 'Masonry',
  ELECTRICAL = 'Electrical',
  PLUMBING = 'Plumbing',
  CARPENTRY = 'Carpentry',
}

export enum SubNatureOfElectricalComplaint {
  BROKEN_BULB = 'Broken Bulb',
  FAULTY_FAN = 'Faulty Fan',
  MALFUNCTIONING_SWITCH = 'Malfunctioning Switch',
  DAMAGED_SOCKET = 'Damaged Socket',
  FAULTY_GYESER = 'Faulty Geyser',
}

export enum SubNatureOfPlumbingComplaint {
  WATER_LEAKAGE = 'Water Leakage',
  NO_WATER_SUPPLY = 'No Water Supply',
  CLOGGED_DRAINAGE = 'Clogged Drainage',
}

export enum SubNatureOfMasonryComplaint {
  DAMPNESS_ISSUE = 'Dampness Issue',
  LOOSE_PLASTER = 'Loose Plaster',
  NEED_WHITEWASHING = 'Need Whitewashing',
  BROKEN_FLOOR_TILE = 'Broken Floor Tile',
}

export enum SubNatureOfCarpentryComplaint {
  BROKEN_DOOR = 'Broken Door',
  DAMAGED_WINDOW = 'Damaged Window',
}
