import { Request } from 'express';
import { UserDoc } from '../models/temporaryUser';
import { permanentUserDoc } from '../models/userSchema';
export enum Designations {
  FACULTY = 'Faculty',
  WARDEN = 'Warden',
  CHIEF_EXECUTIVE_ENGINEER = 'Chief Executive Engineer',
  ASSISTANT_ENGINEER = 'Assistant Engineer',
  JUNIOR_ENGINEER = 'Junior Engineer',
}

export enum RequestedFor {
  EMAIL_VERIFICATION = 'Email Verification',
  PASSWORD_CHANGE = 'Password Change',
  FORGOT_PASSWORD = 'Forgot Password',
}

export interface requestWithDeviceFingerprint extends Request {
  deviceFingerprint?: string;
}
export interface requestWithTempUser extends Request {
  tempUser?: UserDoc;
  deviceFingerprint?: string;
}
export interface requestWithPermanentUser extends Request {
  permanentUser?: permanentUserDoc;
}
export interface requestWithPermanentUserAndParsedFilters extends Request {
  permanentUser?: permanentUserDoc;
  parsedFilters?: Object;
  moreFilters?: any;
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
