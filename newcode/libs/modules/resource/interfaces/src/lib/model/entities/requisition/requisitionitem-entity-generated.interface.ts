/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase } from '@libs/platform/common';

export interface IRequisitionitemEntityGenerated extends IEntityBase {

  /**
   * Description
   */
  Description?: string | null;

  /**
   * Id
   */
  Id: number;

  /**
   * MaterialCode
   */
  MaterialCode?: string | null;

  /**
   * MaterialFk
   */
  MaterialFk?: number | null;

  /**
   * ProjectFk
   */
  ProjectFk?: number | null;

  /**
   * Quantity
   */
  Quantity: number;

  /**
   * RequisitionFk
   */
  RequisitionFk: number;

  /**
   * ReservationId
   */
  ReservationId?: number | null;

  /**
   * StockFk
   */
  StockFk?: number | null;

  /**
   * UomFk
   */
  UomFk: number;

  /**
   * UserDefinedText01
   */
  UserDefinedText01?: string | null;

  /**
   * UserDefinedText02
   */
  UserDefinedText02?: string | null;

  /**
   * UserDefinedText03
   */
  UserDefinedText03?: string | null;

  /**
   * UserDefinedText04
   */
  UserDefinedText04?: string | null;

  /**
   * UserDefinedText05
   */
  UserDefinedText05?: string | null;
}
