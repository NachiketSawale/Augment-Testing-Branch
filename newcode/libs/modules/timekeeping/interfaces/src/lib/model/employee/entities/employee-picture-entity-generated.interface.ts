/*
 * Copyright(c) RIB Software GmbH
 */

import { IEmployeeEntity } from './employee-entity.interface';
import { IEntityBase } from '@libs/platform/common';

export interface IEmployeePictureEntityGenerated extends IEntityBase {

  /**
   * BlobsFk
   */
  BlobsFk: number;

  /**
   * Comment
   */
  Comment?: string | null;

  /**
   * EmployeeEntity
   */
  EmployeeEntity?: IEmployeeEntity | null;

  /**
   * EmployeeFk
   */
  EmployeeFk: number;

  /**
   * Id
   */
  Id: number;

  /**
   * IsDefault
   */
  IsDefault: boolean;

  /**
   * PictureDate
   */
  PictureDate?: string | null;
}
