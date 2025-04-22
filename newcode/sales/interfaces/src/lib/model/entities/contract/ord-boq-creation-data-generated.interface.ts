/*
 * Copyright(c) RIB Software GmbH
 */

import { IDescriptionInfo } from '@libs/platform/common';

export interface IOrdBoqCreationDataGenerated {

  /**
   * BasCurrencyFk
   */
  BasCurrencyFk: number;

  /**
   * BriefInfo
   */
  BriefInfo?: IDescriptionInfo | null;

  /**
   * MainItemId
   */
  MainItemId: number;

  /**
   * Reference
   */
  Reference?: string | null;
}
