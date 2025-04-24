/*
 * Copyright(c) RIB Software GmbH
 */

import { ICompareSettingBase } from '../compare-setting-base.interface';
import { ICompositeBoqEntity } from './composite-boq-entity.interface';
import { ISimpleCheckableRowEntity } from '../simple-checkable-row-entity.interface';

export interface ICompareBoqRangeEntity {
	Id:string;
	Reference: string;
	Brief?: string;
	BoqHeaderFkFrom?: number;
	BoqHeaderFkTo?: number;
}

export interface ICompareBoqSetting extends ICompareSettingBase<ICompositeBoqEntity> {
	structures: ISimpleCheckableRowEntity[];
	itemTypes: ISimpleCheckableRowEntity[];
	itemTypes2: ISimpleCheckableRowEntity[];
	isPercentageLevels: boolean;
	isHideZeroValueLines: boolean;
	isCalculateAsPerAdjustedQuantity: boolean;
}