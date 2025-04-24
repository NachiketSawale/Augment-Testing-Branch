/*
 * Copyright(c) RIB Software GmbH
 */

import { IBasicsCustomizePriceConditionTypeEntity } from '@libs/basics/interfaces';
import { IEntityBase } from '@libs/platform/common';

export interface IPrcItemPriceConditionEntityGenerated extends IEntityBase {

  /**
   * Code
   */
  Code?: string | null;

  /**
   * Date
   */
  Date?: string | null;

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
   * MainItemId
   */
  MainItemId: number;

  /**
   * PrcItemFk
   */
  PrcItemFk: number;

  /**
   * PrcPriceConditionTypeFk
   */
  PrcPriceConditionTypeFk: number;

  /**
   * PriceConditionType
   */
  // PriceConditionType?: IIPriceConditionTypeEntity | null;
  PriceConditionType?: IBasicsCustomizePriceConditionTypeEntity | null;

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
