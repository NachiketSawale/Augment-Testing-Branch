/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase } from '@libs/platform/common';

export interface IHeaderPparamEntityGenerated extends IEntityBase {

  /**
   * Code
   */
  Code?: string | null;

  /**
   * CommentText
   */
  CommentText?: string | null;

  /**
   * ContextFk
   */
  ContextFk: number;

  /**
   * Formula
   */
  Formula?: string | null;

  /**
   * Id
   */
  Id: number;

  /**
   * PriceConditionTypeFk
   */
  PriceConditionTypeFk: number;

  /**
   * Type
   */
  Type: 'Package' | 'Requisition' | 'Quote' | 'Contract' | 'Pes' | 'Project' | 'Bid' | 'Order' | 'Wip' | 'Bill';

  /**
   * Value
   */
  Value: number;
}
