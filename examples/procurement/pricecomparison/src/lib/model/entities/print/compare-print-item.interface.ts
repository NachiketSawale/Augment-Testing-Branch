/*
 * Copyright(c) RIB Software GmbH
 */

import { IComparePrintBase } from './compare-print-base.interface';
import { ICompareItemSetting } from '../item/compare-item-setting.interface';
import { ICompositeItemEntity } from '../item/composite-item-entity.interface';
import { IComparePrintItemProfile } from './compare-print-item-profile.interface';

export type IComparePrintItem = ICompareItemSetting & IComparePrintBase<ICompositeItemEntity> & {
	item: IComparePrintItemProfile
}