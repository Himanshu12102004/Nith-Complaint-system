import { Designations } from '../../types/types';

function isEngineer(designation: string) {
  if (
    designation == Designations.ASSISTANT_ENGINEER ||
    designation == Designations.EXECUTIVE_ENGINEER_CIVIL ||
    designation == Designations.EXECUTIVE_ENGINEER_ELECTRICAL ||
    designation == Designations.JUNIOR_ENGINEER ||
    designation == Designations.SUPERVISOR
  )
    return true;
  return false;
}
export { isEngineer };
