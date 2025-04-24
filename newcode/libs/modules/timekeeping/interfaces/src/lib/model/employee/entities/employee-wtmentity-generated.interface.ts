/*
 * Copyright(c) RIB Software GmbH
 */

import { IEmployeeEntity } from './employee-entity.interface';
import { IEntityBase } from '@libs/platform/common';

export interface IEmployeeWTMEntityGenerated extends IEntityBase {

  /**
   * CommentText
   */
  CommentText?: string | null;

  /**
   * EmployeeEntity
   */
  EmployeeEntity?: IEmployeeEntity | null;

  /**
   * EmployeeFallbackWTM
   */
  EmployeeFallbackWTM?: number | null;

  /**
   * EmployeeFk
   */
  EmployeeFk: number;

  /**
   * EmployeeWorkingTimeModelFk
   */
  EmployeeWorkingTimeModelFk: number;

  /**
   * HasOptedPayout
   */
  HasOptedPayout: boolean;

  /**
   * Id
   */
  Id: number;

  /**
   * IsFallbackWtmActive
   */
  IsFallbackWtmActive: boolean;

  /**
   * TimesymbolFk
   */
  TimesymbolFk?: number | null;

  /**
   * UserDefinedText01
   */
  UserDefinedText01?: string | null;

  /**
   * UserDefinedText02
   */
  UserDefinedText02?: string | null;

  /**
   * UserDefinedText03
   */
  UserDefinedText03?: string | null;

  /**
   * ValidFrom
   */
  ValidFrom?: string | null;

  /**
   * ValidTo
   */
  ValidTo?: string | null;
}
