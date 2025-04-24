/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase } from '@libs/platform/common';

export interface IPrcGeneralsEntityGenerated extends IEntityBase {

  /**
   * CommentText
   */
  CommentText?: string | null;

  /**
   * ControllingUnitFk
   */
  ControllingUnitFk?: number | null;

  /**
   * Id
   */
  Id: number;

  /**
   * IsCost
   */
  IsCost: boolean;

  /**
   * PrcGeneralstypeFk
   */
  PrcGeneralstypeFk: number;

  /**
   * PrcHeaderFk
   */
  PrcHeaderFk: number;

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
