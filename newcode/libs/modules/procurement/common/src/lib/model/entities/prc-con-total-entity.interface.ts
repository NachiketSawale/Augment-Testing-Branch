/*
 * Copyright(c) RIB Software GmbH
 */

import {IEntityBase, IEntityIdentification} from '@libs/platform/common';

export interface IConTotalEntity extends IEntityBase, IEntityIdentification {
  CommentText?: string;
  Gross?: number;
  GrossOc?: number;
  HeaderFk: number;
  TotalKindFk?: number;
  TotalTypeFk: number;
  ValueNet: number;
  ValueNetOc: number;
  ValueTax: number;
  ValueTaxOc: number;
}
