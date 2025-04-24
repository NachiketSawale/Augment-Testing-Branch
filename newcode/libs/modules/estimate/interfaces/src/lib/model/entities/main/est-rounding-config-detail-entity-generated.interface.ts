/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase } from '@libs/platform/common';

export interface IEstRoundingConfigDetailEntityGenerated extends IEntityBase {

/*
 * ColumnId
 */
  ColumnId?: number | null;

/*
 * EstRoundingConfigFk
 */
  EstRoundingConfigFk?: number | null;

/*
 * Id
 */
  Id: number;

/*
 * IsWithoutRounding
 */
  IsWithoutRounding?: boolean | null;

/*
 * RoundTo
 */
  RoundTo?: number | null;

/*
 * RoundToFk
 */
  RoundToFk?: number | null;

/*
 * RoundingMethodFk
 */
  RoundingMethodFk?: number | null;

/*
 * Sorting
 */
  Sorting?: number | null;

/*
 * UiDisplayTo
 */
  UiDisplayTo?: number | null;
}
