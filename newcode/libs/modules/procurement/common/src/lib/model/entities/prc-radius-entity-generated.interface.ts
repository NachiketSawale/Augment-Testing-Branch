/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase, IDescriptionInfo } from '@libs/platform/common';

export interface IPrcRadiusEntityGenerated extends IEntityBase {

  /**
   * BasUomFk
   */
  BasUomFk?: number | null;

  /**
   * Description
   */
  Description?: string | null;

  /**
   * DescriptionInfo
   */
  DescriptionInfo?: IDescriptionInfo | null;

  /**
   * Id
   */
  Id: number;

  /**
   * IsDefault
   */
  IsDefault: boolean;

  /**
   * IsLive
   */
  IsLive: boolean;

  /**
   * Radiusinmeter
   */
  Radiusinmeter: number;

  /**
   * Sorting
   */
  Sorting: number;
}
