/*
 * Copyright(c) RIB Software GmbH
 */

import { ICrewAssignmentEntity } from './crew-assignment-entity.interface';
import { IEmployeeEntity } from './employee-entity.interface';

export interface IValidateParamsGenerated {

  /**
   * ChangedCrewAssignment
   */
  ChangedCrewAssignment?: ICrewAssignmentEntity | null;

  /**
   * CrewAssignmentToValidate
   */
  CrewAssignmentToValidate?: ICrewAssignmentEntity | null;

  /**
   * CrewAssignmentsToDelete
   */
  CrewAssignmentsToDelete?: ICrewAssignmentEntity[] | null;

  /**
   * CrewAssignmentsToSave
   */
  CrewAssignmentsToSave?: ICrewAssignmentEntity[] | null;

  /**
   * Employee
   */
  Employee?: IEmployeeEntity | null;

  /**
   * Valid
   */
  Valid: boolean;

  /**
   * ValidError
   */
  ValidError?: string | null;
}
