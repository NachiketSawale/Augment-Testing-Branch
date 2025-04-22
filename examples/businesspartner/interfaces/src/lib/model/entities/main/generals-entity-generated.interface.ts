/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase } from '@libs/platform/common';

export interface IGeneralsEntityGenerated extends IEntityBase {

  /**
   * BusinessPartnerFk
   */
  BusinessPartnerFk: number;

  /**
   * CommentText
   */
  CommentText?: string | null;

  /**
   * ContextFk
   */
  ContextFk: number;

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
