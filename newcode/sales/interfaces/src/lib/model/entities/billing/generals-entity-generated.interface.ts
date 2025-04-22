/*
 * Copyright(c) RIB Software GmbH
 */

import { IBilHeaderEntity } from './bil-header-entity.interface';
import { IEntityBase } from '@libs/platform/common';

export interface IGeneralsEntityGenerated extends IEntityBase {

  /**
   * BilHeaderFk
   */
  BilHeaderFk: number;

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
   * HeaderEntity
   */
  HeaderEntity?: IBilHeaderEntity | null;

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
