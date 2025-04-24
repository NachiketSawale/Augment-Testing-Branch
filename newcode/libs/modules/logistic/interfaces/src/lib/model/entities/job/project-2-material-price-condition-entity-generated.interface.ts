/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase } from '@libs/platform/common';

export interface IProject2MaterialPriceConditionEntityGenerated extends IEntityBase {

  /**
   * Description
   */
  Description?: string | null;

  /**
   * Id
   */
  Id: number;

  /**
   * IsActivated
   */
  IsActivated: boolean;

  /**
   * IsPriceComponent
   */
  IsPriceComponent: boolean;

  /**
   * PriceConditionTypeFk
   */
  PriceConditionTypeFk: number;

  /**
   * ProjectMaterialFk
   */
  ProjectMaterialFk: number;

  /**
   * Total
   */
  Total: number;

  /**
   * TotalOc
   */
  TotalOc: number;

  /**
   * Value
   */
  Value: number;
}
