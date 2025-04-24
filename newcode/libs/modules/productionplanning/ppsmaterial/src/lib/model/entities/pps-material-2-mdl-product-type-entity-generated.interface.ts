/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase } from '@libs/platform/common';

export interface IPpsMaterial2MdlProductTypeEntityGenerated extends IEntityBase {

  /**
   * Description
   */
  Description?: string | null;

  /**
   * Id
   */
  Id: number;

  /**
   * IsLive
   */
  IsLive: boolean;

  /**
   * PpsMaterialFk
   */
  PpsMaterialFk: number;

  /**
   * ProductCategory
   */
  ProductCategory: string;

  /**
   * ProductType
   */
  ProductType?: string | null;

  /**
   * ProductionMode
   */
  ProductionMode?: string | null;
}
