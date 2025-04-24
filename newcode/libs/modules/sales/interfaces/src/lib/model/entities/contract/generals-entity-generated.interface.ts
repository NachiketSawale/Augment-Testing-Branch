/*
 * Copyright(c) RIB Software GmbH
 */

import { IOrdHeaderEntity } from './ord-header-entity.interface';
import { IEntityBase } from '@libs/platform/common';

export interface IGeneralsEntityGenerated extends IEntityBase {

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
  GeneralsTypeFk?: number | null;

  /**
   * Id
   */
  Id: number;

  /**
   * OrdHeaderEntity
   */
  OrdHeaderEntity?: IOrdHeaderEntity | null;

  /**
   * OrdHeaderFk
   */
  OrdHeaderFk: number;

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
