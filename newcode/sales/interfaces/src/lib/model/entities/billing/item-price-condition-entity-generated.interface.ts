/*
 * Copyright(c) RIB Software GmbH
 */

import { IItemEntity } from './item-entity.interface';
import { IEntityBase } from '@libs/platform/common';

export interface IItemPriceConditionEntityGenerated extends IEntityBase {

  /**
   * Code
   */
  Code?: string | null;

  /**
   * Date
   */
  Date?: Date | string | null;

  /**
   * Description
   */
  Description?: string | null;

  /**
   * Formula
   */
  Formula?: string | null;

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
   * ItemEntity
   */
  ItemEntity?: IItemEntity | null;

  /**
   * ItemFk
   */
  ItemFk: number;

  /**
   * MainItemId
   */
  MainItemId: number;

  /**
   * PrcPriceConditionTypeFk
   */
  PrcPriceConditionTypeFk: number;

  /**
   * PriceConditionType
   */
  //PriceConditionType?: IIPriceConditionTypeEntity | null;

  /**
   * Total
   */
  Total: number;

  /**
   * TotalOc
   */
  TotalOc: number;

  /**
   * Userdefined1
   */
  Userdefined1?: string | null;

  /**
   * Userdefined2
   */
  Userdefined2?: string | null;

  /**
   * Userdefined3
   */
  Userdefined3?: string | null;

  /**
   * Userdefined4
   */
  Userdefined4?: string | null;

  /**
   * Userdefined5
   */
  Userdefined5?: string | null;

  /**
   * Value
   */
  Value: number;
}
