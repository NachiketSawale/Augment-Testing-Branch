/*
 * Copyright(c) RIB Software GmbH
 */

import { IDescriptionInfo } from '@libs/platform/common';

export interface ICrewMemberEntityGenerated {

  /**
   * Code
   */
  Code: string;

  /**
   * Comment
   */
  Comment?: string | null;

  /**
   * CompanyFk
   */
  CompanyFk: number;

  /**
   * CompanyOperatingFk
   */
  CompanyOperatingFk: number;

  /**
   * DescriptionTranslateType
   */
  DescriptionTranslateType?: IDescriptionInfo | null;

  /**
   * EmployeeCrewFk
   */
  EmployeeCrewFk: number;

  /**
   * FamilyName
   */
  FamilyName?: string | null;

  /**
   * FirstName
   */
  FirstName?: string | null;

  /**
   * FromDateTime
   */
  FromDateTime: string;

  /**
   * Id
   */
  Id: number;

  /**
   * Initials
   */
  Initials?: string | null;

  /**
   * PaymentGroupFk
   */
  PaymentGroupFk: number;

  /**
   * ProfessionalCategoryFk
   */
  ProfessionalCategoryFk: number;

  /**
   * ShiftFk
   */
  ShiftFk: number;

  /**
   * TimekeepingGroupFk
   */
  TimekeepingGroupFk?: number | null;

  /**
   * ToDateTime
   */
  ToDateTime?: string | null;
}
