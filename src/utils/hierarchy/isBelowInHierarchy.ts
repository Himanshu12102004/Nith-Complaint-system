import { Designations } from '../../types/types';

function isBelowInHierarchy(above: string, below: string) {
  if (
    below == Designations.WARDEN ||
    below == Designations.FACULTY ||
    below == Designations.FI_CONSTRUCTION_CELL ||
    above == Designations.WARDEN ||
    above == Designations.FACULTY ||
    above == Designations.FI_CONSTRUCTION_CELL
  )
    return false;
  if (above == below) return false;
  if (
    above == Designations.ASSISTANT_ENGINEER &&
    below == Designations.CHIEF_EXECUTIVE_ENGINEER
  )
    return false;
  if (
    above == Designations.JUNIOR_ENGINEER &&
    (below == Designations.CHIEF_EXECUTIVE_ENGINEER ||
      below == Designations.ASSISTANT_ENGINEER)
  )
    return false;
  if (above == Designations.SUPERVISOR) return false;
  return true;
}
export { isBelowInHierarchy };
