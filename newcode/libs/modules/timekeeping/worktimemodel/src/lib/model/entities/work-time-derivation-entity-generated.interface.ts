/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IWorkTimeModelEntity } from './work-time-model-entity.interface';
import { IEntityBase } from '@libs/platform/common';


export interface IWorkTimeDerivationEntityGenerated extends IEntityBase {

/*
 * FromQuantity
 */
  FromQuantity?: number | null;

/*
 * FromTime
 */
  FromTime?: string | null;

/*
 * Id
 */
  Id : number ;

/*
 * TimeSymbolDerivedFk
 */
  TimeSymbolDerivedFk?: number | null;

/*
 * TimeSymbolFk
 */
  TimeSymbolFk?: number | null;

/*
 * ToQuantity
 */
  ToQuantity?: number | null;

/*
 * ToTime
 */
  ToTime?: string | null;

/*
 * WeekDayIndex
 */
  WeekDayIndex?: number | null;

/*
 * WorkingTimeModelEntity
 */
  WorkingTimeModelEntity?: IWorkTimeModelEntity | null;

/*
 * WorkingTimeModelFk
 */
  WorkingTimeModelFk?: number | null;
}
