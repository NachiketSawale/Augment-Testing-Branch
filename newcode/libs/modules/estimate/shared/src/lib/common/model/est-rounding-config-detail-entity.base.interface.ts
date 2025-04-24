/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase } from '@libs/platform/common';

export interface IEstRoundingConfigDetailBaseEntity extends IEntityBase {

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
  Id?: number | null;

/*
 * IsWithoutRounding
 */
  IsWithoutRounding?: boolean | null;

/*
 * RoundTo
 */
  RoundTo: number;

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
  UiDisplayTo: number;
}
