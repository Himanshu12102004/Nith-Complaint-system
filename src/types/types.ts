import { Request } from 'express';
import { UserDoc } from '../models/users/temporaryUser';
import { permanentUserDoc } from '../models/users/userSchema';
import { ComplaintDoc } from '../models/complaints/complaintModel';
export enum Designations {
  FACULTY = 'Faculty',
  WARDEN = 'Warden',
  EXECUTIVE_ENGINEER_CIVIL = 'Executive Engineer (Civil)',
  EXECUTIVE_ENGINEER_ELECTRICAL = 'Executive Engineer (Electrical)',
  ASSISTANT_ENGINEER = 'Assistant Engineer',
  JUNIOR_ENGINEER = 'Junior Engineer',
  SUPERVISOR = 'Supervisor',
  ASSOCIATE_DEAN_CIVIL = 'Associate Dean (Civil)',
  ASSOCIATE_DEAN_ELECTRICAl = 'Associate Dean (Electrical)',
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
export enum BelongsTo {
  CIVIL = 'civil',
  ELECTRICAL = 'electrical',
}
