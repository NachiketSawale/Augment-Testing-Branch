/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase, IDescriptionInfo } from '@libs/platform/common';

export interface IMaterialCatalogTypeEntityGenerated extends IEntityBase {

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
   * IsFrameWork
   */
  IsFrameWork: boolean;

  /**
   * IsSupplier
   */
  IsSupplier: boolean;

  /**
   * Location
   */
  Location?: string | null;

  /**
   * Sorting
   */
  Sorting: number;
}
