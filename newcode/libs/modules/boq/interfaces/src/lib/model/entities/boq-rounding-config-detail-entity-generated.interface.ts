/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase } from '@libs/platform/common';
import { IBoqRoundingConfigEntity } from './boq-rounding-config-entity.interface';

export interface IBoqRoundingConfigDetailEntityGenerated extends IEntityBase {

/*
 * BasRoundToFk
 */
  BasRoundToFk?: number | null;

/*
 * BasRoundingMethodFk
 */
  BasRoundingMethodFk?: number | null;

/*
 * BoqRoundingConfigFk
 */
  BoqRoundingConfigFk: number;

/*
 * BoqRoundingconfigEntity
 */
  BoqRoundingconfigEntity?: IBoqRoundingConfigEntity | null;

/*
 * ColumnId
 */
  ColumnId: number;

/*
 * Id
 */
  Id: number;

/*
 * IsWithoutRounding
 */
  IsWithoutRounding: boolean;

/*
 * RoundTo
 */
  RoundTo: number;

/*
 * Sorting
 */
  Sorting: number;

/*
 * UiDisplayTo
 */
  UiDisplayTo: number;
}
