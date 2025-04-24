/*
 * Copyright(c) RIB Software GmbH
 */

import { IEmployeeEntity } from './employee-entity.interface';
import { IEmployeeSkillEntity } from './employee-skill-entity.interface';
import { IEntityBase } from '@libs/platform/common';

export interface IEmployeeSkillDocumentEntityGenerated extends IEntityBase {

  /**
   * Barcode
   */
  Barcode?: string | null;

  /**
   * Date
   */
  Date?: string | null;

  /**
   * Description
   */
  Description?: string | null;

  /**
   * DocumentTypeFk
   */
  DocumentTypeFk: number;

  /**
   * EmployeeEntity
   */
  EmployeeEntity?: IEmployeeEntity | null;

  /**
   * EmployeeFk
   */
  EmployeeFk: number;

  /**
   * EmployeeSkillDocTypeFk
   */
  EmployeeSkillDocTypeFk: number;

  /**
   * EmployeeSkillEntity
   */
  EmployeeSkillEntity?: IEmployeeSkillEntity | null;

  /**
   * EmployeeSkillFk
   */
  EmployeeSkillFk: number;

  /**
   * FileArchiveDocFk
   */
  FileArchiveDocFk: number;

  /**
   * Id
   */
  Id: number;

  /**
   * OriginFileName
   */
  OriginFileName?: string | null;
}
