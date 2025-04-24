/*
 * Copyright(c) RIB Software GmbH
 */

import { IDescriptionInfo } from '@libs/platform/common';

export interface IPrcBoqLookupVEntityGenerated {

  /**
   * BoqHeaderFk
   */
  BoqHeaderFk: number;

  /**
   * BoqItemPrjBoqFk
   */
  BoqItemPrjBoqFk?: number | null;

  /**
   * BriefInfo
   */
  BriefInfo?: IDescriptionInfo | null;

  /**
   * Code
   */
  Code: string;

  /**
   * ControllingCode
   */
  ControllingCode?: string | null;

  /**
   * ControllingUnitFk
   */
  ControllingUnitFk?: number | null;

  /**
   * DescriptionInfo
   */
  DescriptionInfo?: IDescriptionInfo | null;

  /**
   * Id
   */
  Id: number;

  /**
   * IsCanceled
   */
  IsCanceled: boolean;

  /**
   * IsDelivered
   */
  IsDelivered: boolean;

  /**
   * IsPartDelivered
   */
  IsPartDelivered: boolean;

  /**
   * PackageCode
   */
  PackageCode: string;

  /**
   * PackageDescription
   */
  PackageDescription?: string | null;

  /**
   * PackageFk
   */
  PackageFk: number;

  /**
   * PrcHeaderFk
   */
  PrcHeaderFk: number;

  /**
   * PrcItemStatusFk
   */
  PrcItemStatusFk?: number | null;

  /**
   * Reference
   */
  Reference?: string | null;
}
