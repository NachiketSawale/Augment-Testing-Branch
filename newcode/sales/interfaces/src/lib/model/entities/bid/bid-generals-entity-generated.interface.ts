/*
 * Copyright(c) RIB Software GmbH
 */
import { IEntityBase } from '@libs/platform/common';
import { IBidHeaderEntity } from './bid-header-entity.interface';

export interface IBidGeneralsEntityGenerated extends IEntityBase {

  /**
   * BidHeaderEntity
   */
  BidHeaderEntity?: IBidHeaderEntity | null;

  /**
   * BidHeaderFk
   */
  BidHeaderFk: number;

  /**
   * CommentText
   */
  CommentText?: string | null;

  /**
   * ControllingUnitFk
   */
  ControllingUnitFk?: number | null;

  /**
   * GeneralsTypeFk
   */
  GeneralsTypeFk: number;

  /**
   * Id
   */
  Id: number;

  /**
   * TaxCodeFk
   */
  TaxCodeFk?: number | null;

  /**
   * Value
   */
  Value: number;

  /**
   * ValueType
   */
  ValueType: number;
}
