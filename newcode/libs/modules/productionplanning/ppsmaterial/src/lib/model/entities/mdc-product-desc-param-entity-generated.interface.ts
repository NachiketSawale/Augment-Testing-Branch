/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase, IDescriptionInfo } from '@libs/platform/common';

export interface IMdcProductDescParamEntityGenerated extends IEntityBase {

  /**
   * DescriptionInfo
   */
  DescriptionInfo?: IDescriptionInfo | null;

  /**
   * Id
   */
  Id: number;

  /**
   * ProductDescriptionFk
   */
  ProductDescriptionFk: number;

  /**
   * Quantity
   */
  Quantity: number;

  /**
   * Sorting
   */
  Sorting: number;

  /**
   * UomFk
   */
  UomFk: number;

  /**
   * VariableName
   */
  VariableName: string;
}
