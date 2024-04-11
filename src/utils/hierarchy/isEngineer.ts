import { Designations } from '../../types/types';

function isEngineer(designation: string) {
  if (
    designation == Designations.ASSISTANT_ENGINEER ||
    designation == Designations.CHIEF_EXECUTIVE_ENGINEER ||
    designation == Designations.JUNIOR_ENGINEER ||
    designation == Designations.SUPERVISOR
  )
    return true;
  return false;
}
export { isEngineer };
