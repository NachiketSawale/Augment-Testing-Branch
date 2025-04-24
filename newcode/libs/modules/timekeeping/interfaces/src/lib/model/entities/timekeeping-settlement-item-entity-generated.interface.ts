/*
 * Copyright(c) RIB Software GmbH
 */

import { ITimekeepingSettlementEntity } from './timekeeping-settlement-entity.interface';
import { IEntityBase } from '@libs/platform/common';

export interface ITimekeepingSettlementItemEntityGenerated extends IEntityBase {

  /**
   * ControllingUnitFk
   */
  ControllingUnitFk?: number | null;

  /**
   * ControllingUnitRevenueFk
   */
  ControllingUnitRevenueFk?: number | null;

  /**
   * Id
   */
  Id: number;

  /**
   * Price
   */
  Price: number;

  /**
   * Quantity
   */
  Quantity: number;

  /**
   * SettledFrom
   */
  SettledFrom?: Date | string | null;

  /**
   * SettledTo
   */
  SettledTo?: Date | string | null;

  /**
   * SettlementEntity
   */
  SettlementEntity?: ITimekeepingSettlementEntity | null;

  /**
   * SettlementFk
   */
  SettlementFk: number;

  /**
   * TaxCodeFk
   */
  TaxCodeFk?: number | null;

  /**
   * UomFk
   */
  UomFk: number;
}
