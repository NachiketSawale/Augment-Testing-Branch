/*
 * Copyright(c) RIB Software GmbH
 */

import { ICertifiedEmployeeEntity } from './certified-employee-entity.interface';
import { ICrewAssignmentEntity } from './crew-assignment-entity.interface';
import { IEmployeeDefaultEntity } from './employee-default-entity.interface';
import { EmployeeDefaultComplete } from './employee-default-complete.class';
import { IEmployeeDocumentEntity } from './employee-document-entity.interface';
import { IEmployeeEntity } from './employee-entity.interface';
import { IEmployeePictureEntity } from './employee-picture-entity.interface';
import { IEmployeeWTMEntity } from './employee-wtmentity.interface';
import { IPlannedAbsenceEntity } from './planned-absence-entity.interface';
import { PlannedAbsenceComplete } from './planned-absence-complete.class';
import { IEmployeeSkillEntity } from './employee-skill-entity.interface';
import { EmployeeSkillComplete } from './employee-skill-complete.class';

import { CompleteIdentification } from '@libs/platform/common';

export class EmployeeComplete implements CompleteIdentification<IEmployeeEntity>{

  /**
   * CertificationToDelete
   */
  public CertificationToDelete?: ICertifiedEmployeeEntity[] | null = [];

  /**
   * CertificationToSave
   */
  public CertificationToSave?: ICertifiedEmployeeEntity[] | null = [];

  /**
   * CrewAssignmentsToDelete
   */
  public CrewAssignmentsToDelete?: ICrewAssignmentEntity[] | null = [];

  /**
   * CrewAssignmentsToSave
   */
  public CrewAssignmentsToSave?: ICrewAssignmentEntity[] | null = [];

  /**
   * DefaultsToDelete
   */
  public DefaultsToDelete?: IEmployeeDefaultEntity[] | null = [];

  /**
   * DefaultsToSave
   */
  public DefaultsToSave?: EmployeeDefaultComplete[] | null = [];

  /**
   * DocumentsToDelete
   */
  public DocumentsToDelete?: IEmployeeDocumentEntity[] | null = [];

  /**
   * DocumentsToSave
   */
  public DocumentsToSave?: IEmployeeDocumentEntity[] | null = [];

  /**
   * Employee
   */
  public Employee?: IEmployeeEntity | null = null;

  /**
   * EmployeePicturesToSave
   */
  public EmployeePicturesToSave?: IEmployeePictureEntity[] | null = [];

  /**
   * EmployeeWTMToDelete
   */
  public EmployeeWTMToDelete?: IEmployeeWTMEntity[] | null = [];

  /**
   * EmployeeWTMToSave
   */
  public EmployeeWTMToSave?: IEmployeeWTMEntity[] | null = [];

  /**
   * Employees
   */
  public Employees?: IEmployeeEntity[] | null = [];

  /**
   * MainItemId
   */
  public MainItemId: number = 0;

  /**
   * PlannedAbsencesToDelete
   */
  public PlannedAbsencesToDelete?: IPlannedAbsenceEntity[] | null = [];

  /**
   * PlannedAbsencesToSave
   */
  public PlannedAbsencesToSave?: PlannedAbsenceComplete[] | null = [];

  /**
   * PpsEmployeeAssignmentToDelete
   */
  //public PpsEmployeeAssignmentToDelete?: IIIdentifyable[] | null = [];

  /**
   * PpsEmployeeAssignmentToSave
   */
  //public PpsEmployeeAssignmentToSave?: IIIdentifyable[] | null = [];

  /**
   * SkillsToDelete
   */
  public SkillsToDelete?: IEmployeeSkillEntity[] | null = [];

  /**
   * SkillsToSave
   */
  public SkillsToSave?: EmployeeSkillComplete[] | null = [];
}
