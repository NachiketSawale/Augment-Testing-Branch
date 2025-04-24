/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase } from '@libs/platform/common';

export interface ICertifiedEmployeeEntityGenerated extends IEntityBase {

  /**
   * Comment
   */
  Comment?: string | null;

  /**
   * EmpCertificateFk
   */
  EmpCertificateFk?: number | null;

  /**
   * EmpCertificateTypeFk
   */
  EmpCertificateTypeFk: number;

  /**
   * EmpValidFrom
   */
  EmpValidFrom?: string | null;

  /**
   * EmpValidTo
   */
  EmpValidTo?: string | null;

  /**
   * EmployeeFk
   */
  EmployeeFk: number;

  /**
   * Id
   */
  Id: number;

  /**
   * ValidFrom
   */
  ValidFrom?: string | null;

  /**
   * ValidTo
   */
  ValidTo?: string | null;
}
