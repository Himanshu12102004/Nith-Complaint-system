import { Designations } from '../../types/types';

function isBelowInHierarchy(above: string, below: string) {
  if (
    below == Designations.WARDEN ||
    below == Designations.FACULTY ||
    below == Designations.ASSOCIATE_DEAN_ELECTRICAl ||
    above == Designations.WARDEN ||
    above == Designations.FACULTY ||
    above == Designations.ASSOCIATE_DEAN_CIVIL
  )
    return false;
  if (above == below) return false;
  if (
    above == Designations.ASSISTANT_ENGINEER &&
    (below == Designations.EXECUTIVE_ENGINEER_CIVIL ||
      below == Designations.EXECUTIVE_ENGINEER_ELECTRICAL)
  )
    return false;
  if (
    above == Designations.JUNIOR_ENGINEER &&
    (below == Designations.EXECUTIVE_ENGINEER_CIVIL ||
      below == Designations.EXECUTIVE_ENGINEER_ELECTRICAL ||
      below == Designations.ASSISTANT_ENGINEER)
  )
    return false;
  if (above == Designations.SUPERVISOR) return false;
  return true;
}
export { isBelowInHierarchy };
