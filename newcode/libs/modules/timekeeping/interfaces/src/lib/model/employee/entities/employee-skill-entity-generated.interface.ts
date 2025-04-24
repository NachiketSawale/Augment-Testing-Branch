/*
 * Copyright(c) RIB Software GmbH
 */

import { IEmployeeSkillDocumentEntity } from './employee-skill-document-entity.interface';
import { IEntityBase } from '@libs/platform/common';

export interface IEmployeeSkillEntityGenerated extends IEntityBase {

  /**
   * CommentText
   */
  CommentText?: string | null;

  /**
   * Duration
   */
  Duration?: number | null;

  /**
   * EmployeeFk
   */
  EmployeeFk: number;

  /**
   * EmployeeSkillStatusFk
   */
  EmployeeSkillStatusFk?: number | null;

  /**
   * Id
   */
  Id: number;

  /**
   * LeadDays
   */
  LeadDays?: number | null;

  /**
   * RefreshDate
   */
  RefreshDate?: string | null;

  /**
   * SkillFk
   */
  SkillFk: number;

  /**
   * TksEmployeeskilldocEntities
   */
  TksEmployeeskilldocEntities?: IEmployeeSkillDocumentEntity[] | null;

  /**
   * ValidTo
   */
  ValidTo?: string | null;
}
