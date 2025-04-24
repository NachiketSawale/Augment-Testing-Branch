/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase } from '@libs/platform/common';

export interface IMaterialPriceVersion2CompanyEntityGenerated extends IEntityBase {

  /**
   * CompanyFk
   */
  CompanyFk: number;

  /**
   * Id
   */
  Id: number;

  /**
   * MaterialPriceVersionFk
   */
  MaterialPriceVersionFk: number;
}
