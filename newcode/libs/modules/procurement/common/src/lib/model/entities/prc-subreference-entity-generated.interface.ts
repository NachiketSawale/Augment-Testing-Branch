/*
 * Copyright(c) RIB Software GmbH
 */

import { IPrcHeaderEntity } from './prc-header-entity.interface';
import { IEntityBase } from '@libs/platform/common';

export interface IPrcSubreferenceEntityGenerated extends IEntityBase {

  /**
   * BpdBusinesspartnerFk
   */
  BpdBusinesspartnerFk?: number | null;

  /**
   * BpdContactFk
   */
  BpdContactFk?: number | null;

  /**
   * BpdSubsidiaryFk
   */
  BpdSubsidiaryFk?: number | null;

  /**
   * BpdSupplierFk
   */
  BpdSupplierFk?: number | null;

  /**
   * Description
   */
  Description?: string | null;

  /**
   * Id
   */
  Id: number;

  /**
   * PrcHeaderEntity
   */
  PrcHeaderEntity?: IPrcHeaderEntity | null;

  /**
   * PrcHeaderFk
   */
  PrcHeaderFk: number;

  /**
   * PrcStructureFk
   */
  PrcStructureFk?: number | null;

  /**
   * UserDefinedDate1
   */
  UserDefinedDate1?: string | null;

  /**
   * UserDefinedDate2
   */
  UserDefinedDate2?: string | null;

  /**
   * UserDefinedDate3
   */
  UserDefinedDate3?: string | null;

  /**
   * UserDefinedDate4
   */
  UserDefinedDate4?: string | null;

  /**
   * UserDefinedDate5
   */
  UserDefinedDate5?: string | null;
}
