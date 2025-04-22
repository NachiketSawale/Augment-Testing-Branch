/*
 * Copyright(c) RIB Software GmbH
 */

import { IDescriptionInfo } from '@libs/platform/common';

export interface IBilBoqCreationDataGenerated {

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
   * ProjectBoqHeaderId
   */
  ProjectBoqHeaderId: number;

  /**
   * Reference
   */
  Reference?: string | null;
}
