/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase } from '@libs/platform/common';
import { IBasicsCustomizePriceConditionTypeEntity } from '../customize';

export interface IMaterialPriceConditionEntityGenerated extends IEntityBase {

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
   * MdcMaterialFk
   */
  MdcMaterialFk: number;

  /**
   * PrcPriceConditionTypeFk
   */
  PrcPriceConditionTypeFk: number;

  /**
   * PriceConditionType
   */
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
