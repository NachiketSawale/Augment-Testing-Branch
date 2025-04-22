/*
 * Copyright(c) RIB Software GmbH
 */

import { IComparePrintBase } from './compare-print-base.interface';
import { ICompareBoqRangeEntity, ICompareBoqSetting } from '../boq/compare-boq-setting.interface';
import { ICompositeBoqEntity } from '../boq/composite-boq-entity.interface';
import { IComparePrintBoqProfile } from './compare-print-boq-profile.interface';

export type IComparePrintBoq = ICompareBoqSetting & IComparePrintBase<ICompositeBoqEntity> & {
	boq: IComparePrintBoqProfile;
	ranges: ICompareBoqRangeEntity[];
}