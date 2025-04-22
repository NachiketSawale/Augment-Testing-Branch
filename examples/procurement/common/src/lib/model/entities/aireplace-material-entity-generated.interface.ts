/*
 * Copyright(c) RIB Software GmbH
 */

import { IDescriptionInfo } from '@libs/platform/common';

export interface IAIReplaceMaterialEntityGenerated {

  /**
   * MaterialCode
   */
  MaterialCode?: string | null;

  /**
   * MaterialDescriptionInfo
   */
  MaterialDescriptionInfo?: IDescriptionInfo | null;

  /**
   * MaterialFk
   */
  MaterialFk: number;

  /**
   * PrcItemId
   */
  PrcItemId: number;

  /**
   * TotalCurrency
   */
  TotalCurrency: number;

  /**
   * UomConversionStatus
   */
  UomConversionStatus: number;
}
