/*
 * Copyright(c) RIB Software GmbH
 */

import { IEmployeeSkillDocumentEntity } from './employee-skill-document-entity.interface';
import { IEmployeeSkillEntity } from './employee-skill-entity.interface';

import { CompleteIdentification } from '@libs/platform/common';

export class EmployeeSkillComplete implements CompleteIdentification<IEmployeeSkillEntity>{

  /**
   * MainItemId
   */
  public MainItemId: number = 0;

  /**
   * SkillDocumentsToDelete
   */
  public SkillDocumentsToDelete?: IEmployeeSkillDocumentEntity[] | null = [];

  /**
   * SkillDocumentsToSave
   */
  public SkillDocumentsToSave?: IEmployeeSkillDocumentEntity[] | null = [];

  /**
   * Skills
   */
  public Skills?: IEmployeeSkillEntity | null = null;
}
