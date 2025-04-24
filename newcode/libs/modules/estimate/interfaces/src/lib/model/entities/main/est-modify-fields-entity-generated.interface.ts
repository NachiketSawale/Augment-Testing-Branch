/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase } from '@libs/platform/common';

export interface IEstModifyFieldsEntityGenerated extends IEntityBase {

/*
 * ColumnId
 */
  ColumnId?: number | null;

/*
 * Description
 */
  Description?: string | null;

/*
 * DomainType
 */
  DomainType?: string | null;

/*
 * Id
 */
  Id: number;

/*
 * IsChange
 */
  IsChange?: boolean | null;

/*
 * IsDynamic
 */
  IsDynamic?: boolean | null;

/*
 * ReplaceValue
 */
  ReplaceValue?: string | null;

/*
 * Sorting
 */
  Sorting?: number | null;
}
