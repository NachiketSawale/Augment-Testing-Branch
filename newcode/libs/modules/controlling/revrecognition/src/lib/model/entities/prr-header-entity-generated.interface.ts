/*
 * Copyright(c) RIB Software GmbH
 */


import { IEntityBase } from '@libs/platform/common';

export interface IPrrHeaderEntityGenerated extends IEntityBase {

  /**
   * BasClerkResponsibleFk
   */
  BasClerkResponsibleFk?: number | null;

  /**
   * BasCompanyTransheader
   */
  BasCompanyTransheader?: string | null;

  /**
   * CommentText
   */
  CommentText?: string | null;

  /**
   * CompanyFk
   */
  CompanyFk: number;

  /**
   * CompanyPeriodFk
   */
  CompanyPeriodFk: number;

  /**
   * CompanyPeriodFkEndDate
   */
  CompanyPeriodFkEndDate: Date;

  /**
   * CompanyPeriodFkStartDate
   */
  CompanyPeriodFkStartDate: Date;

  /**
   * CompanyYearFk
   */
  CompanyYearFk: number;

  /**
   * Id
   */
  Id: number;

  /**
   * PrjProjectFk
   */
  PrjProjectFk: number;

  /**
   * PrrStatusFk
   */
  PrrStatusFk: number;

  /**
   * Remark
   */
  Remark?: string | null;

  /**
   * UserDefined1
   */
  UserDefined1?: string | null;

  /**
   * UserDefined2
   */
  UserDefined2?: string | null;

  /**
   * UserDefined3
   */
  UserDefined3?: string | null;

  /**
   * UserDefined4
   */
  UserDefined4?: string | null;

  /**
   * UserDefined5
   */
  UserDefined5?: string | null;
}
