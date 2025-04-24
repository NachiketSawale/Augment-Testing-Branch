/*
 * Copyright(c) RIB Software GmbH
 */

import { IMaterialLookupVEntity } from './material-lookup-ventity.interface';

export interface IUpdateMaterialPriceUpdateRequestGenerated {

  /**
   * Materials
   */
  Materials?: IMaterialLookupVEntity[] | null;

  /**
   * PriceVersionFk
   */
  PriceVersionFk: number;
}
