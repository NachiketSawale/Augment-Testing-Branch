/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase } from '@libs/platform/common';

export interface IPpsMaterialCompEntityGenerated extends IEntityBase {

  /**
   * Id
   */
  Id: number;

  /**
   * MdcMaterialItemFk
   */
  MdcMaterialItemFk: number;

  /**
   * PpsMaterialItemFk
   */
  PpsMaterialItemFk: number;

  /**
   * PpsMaterialProductFk
   */
  PpsMaterialProductFk: number;

  /**
   * Remark
   */
  Remark?: string | null;

  /**
   * UserFlag1
   */
  UserFlag1: boolean;

  /**
   * UserFlag2
   */
  UserFlag2: boolean;

  /**
   * Userdefined1
   */
  Userdefined1?: string | null;

  /**
   * Userdefined2
   */
  Userdefined2?: string | null;

  /**
   * Userdefined3
   */
  Userdefined3?: string | null;

  /**
   * Userdefined4
   */
  Userdefined4?: string | null;

  /**
   * Userdefined5
   */
  Userdefined5?: string | null;
}
