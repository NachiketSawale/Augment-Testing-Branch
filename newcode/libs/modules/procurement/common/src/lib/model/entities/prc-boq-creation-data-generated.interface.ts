/*
 * Copyright(c) RIB Software GmbH
 */

import { IDescriptionInfo } from '@libs/platform/common';

export interface IPrcBoqCreationDataGenerated {

  /**
   * BasCurrencyFk
   */
  BasCurrencyFk: number;

  /**
   * BoqHeaderId
   */
  BoqHeaderId?: number | null;

  /**
   * BoqItemPrjBoqFk
   */
  BoqItemPrjBoqFk?: number | null;

  /**
   * BoqItemPrjItemFk
   */
  BoqItemPrjItemFk?: number | null;

  /**
   * BoqSource
   */
  BoqSource: number;

  /**
   * BriefInfo
   */
  BriefInfo?: IDescriptionInfo | null;

  /**
   * CreateVersionBoq
   */
  CreateVersionBoq: boolean;

  /**
   * PackageFk
   */
  PackageFk?: number | null;

  /**
   * PrcHeaderFk
   */
  PrcHeaderFk: number;

  /**
   * PrcHeaderFkOriginal
   */
  PrcHeaderFkOriginal: number;

  /**
   * Reference
   */
  Reference?: string | null;

  /**
   * SubPackageId
   */
  SubPackageId: number;

  /**
   * TakeOverOption
   */
  TakeOverOption: number;

  /**
   * TargetModuleName
   */
  TargetModuleName?: string | null;

  /**
   * WicBoqId
   */
  WicBoqId?: number | null;

  /**
   * WicGroupId
   */
  WicGroupId?: number | null;
}
