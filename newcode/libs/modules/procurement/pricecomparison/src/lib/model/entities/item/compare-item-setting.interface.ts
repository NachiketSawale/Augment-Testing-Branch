/*
 * Copyright(c) RIB Software GmbH
 */

import { ICompareSettingBase } from '../compare-setting-base.interface';
import { ICompositeItemEntity } from './composite-item-entity.interface';
import { ISimpleCheckableRowEntity } from '../simple-checkable-row-entity.interface';

export interface ICompareItemSetting extends ICompareSettingBase<ICompositeItemEntity> {
	itemTypes: ISimpleCheckableRowEntity[];
	itemTypes2: ISimpleCheckableRowEntity[];
}