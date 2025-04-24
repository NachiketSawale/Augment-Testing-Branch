/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase } from '@libs/platform/common';


export interface ILogisticJobMaterialCatalogPriceEntityGenerated extends IEntityBase {

  /**
   * CommentText
   */
  CommentText?: string | null;

  /**
   * Id
   */
  Id: number;

  /**
   * JobFk
   */
  JobFk: number;

  /**
   * JobPerformingFk
   */
  JobPerformingFk?: number | null;

  /**
   * MaterialCatalogFk
   */
  MaterialCatalogFk?: number | null;

  /**
   * MaterialPriceListFk
   */
  MaterialPriceListFk: number;

  /**
   * MaterialPriceVersionFk
   */
  MaterialPriceVersionFk: number;
}
