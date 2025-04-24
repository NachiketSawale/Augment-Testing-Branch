/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase } from '@libs/platform/common';

export interface ILogisticPlantPriceEntityGenerated extends IEntityBase {

  /**
   * CommentText
   */
  CommentText?: string | null;

  /**
   * CompanyFk
   */
  CompanyFk?: number | null;

  /**
   * Id
   */
  Id: number;

  /**
   * IsManual
   */
  IsManual: boolean;

  /**
   * PlantFk
   */
  PlantFk: number;

  /**
   * PriceConditionFk
   */
  PriceConditionFk: number;

  /**
   * PricePortion1
   */
  PricePortion1: number;

  /**
   * PricePortion2
   */
  PricePortion2: number;

  /**
   * PricePortion3
   */
  PricePortion3: number;

  /**
   * PricePortion4
   */
  PricePortion4: number;

  /**
   * PricePortion5
   */
  PricePortion5: number;

  /**
   * PricePortion6
   */
  PricePortion6: number;

  /**
   * UomFk
   */
  UomFk: number;

  /**
   * ValidFrom
   */
  ValidFrom?: string | null;

  /**
   * ValidTo
   */
  ValidTo?: string | null;

  /**
   * WorkOperationTypeFk
   */
  WorkOperationTypeFk: number;
}
