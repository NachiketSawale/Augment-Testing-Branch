/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase } from '@libs/platform/common';

export interface ISalesSharedGeneralsEntityGenerated extends IEntityBase {

/*
 * CommentText
 */
  CommentText?: string | null;

/*
 * ControllingUnitFk
 */
  ControllingUnitFk?: number | null;

/*
 * GeneralsTypeFk
 */
  GeneralsTypeFk?: number | null;

/*
 * Id
 */
  Id?: number | null;

/*
 * HeaderFk
 */
  HeaderFk?: number | null;

/*
 * TaxCodeFk
 */
  TaxCodeFk?: number | null;

/*
 * Value
 */
  Value?: number | null;

/*
 * ValueType
 */
  ValueType?: number | null;
}
