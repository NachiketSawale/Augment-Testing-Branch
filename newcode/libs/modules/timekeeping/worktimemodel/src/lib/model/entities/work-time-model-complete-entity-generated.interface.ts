/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { ITimeSymbol2WorkTimeModelEntity } from './time-symbol-2work-time-model-entity.interface';
import { IWorkTimeDerivationEntity } from './work-time-derivation-entity.interface';
import { IWorkTimeModelEntity } from './work-time-model-entity.interface';
import { IWorkTimeModelDayEntity } from './work-time-model-day-entity.interface';
import { IWorkTimeModelDtlEntity } from './work-time-model-dtl-entity.interface';


export interface IWorkTimeModelCompleteEntityGenerated {

/*
 * TimeSymbol2WorkTimeModelToDelete
 */
  TimeSymbol2WorkTimeModelToDelete?: ITimeSymbol2WorkTimeModelEntity[] | null;

/*
 * TimeSymbol2WorkTimeModelToSave
 */
  TimeSymbol2WorkTimeModelToSave?: ITimeSymbol2WorkTimeModelEntity[] | null;

/*
 * WorkTimeDerivationToDelete
 */
  WorkTimeDerivationToDelete?: IWorkTimeDerivationEntity[] | null;

/*
 * WorkTimeDerivationToSave
 */
  WorkTimeDerivationToSave?: IWorkTimeDerivationEntity[] | null;

/*
 * WorkTimeModel
 */
  WorkTimeModel?: IWorkTimeModelEntity | null;

/*
 * WorkTimeModelDayToDelete
 */
  WorkTimeModelDayToDelete?: IWorkTimeModelDayEntity[] | null;

/*
 * WorkTimeModelDayToSave
 */
  WorkTimeModelDayToSave?: IWorkTimeModelDayEntity[] | null;

/*
 * WorkTimeModelDtlToDelete
 */
  WorkTimeModelDtlToDelete?: IWorkTimeModelDtlEntity[] | null;

/*
 * WorkTimeModelDtlToSave
 */
  WorkTimeModelDtlToSave?: IWorkTimeModelDtlEntity[] | null;

/*
 * WorkTimeModelId
 */
  WorkTimeModelId?: number | null;

/*
 * WorkTimeModels
 */
  WorkTimeModels?: IWorkTimeModelEntity[] | null;
}
