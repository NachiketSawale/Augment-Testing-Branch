/*
 * Copyright(c) RIB Software GmbH
 */


import { ICompositeBaseEntity } from '../composite-base-entity.interface';
import { ICompareSettingBase } from '../compare-setting-base.interface';
import { IComparePrintPageLayout, IComparePrintReport } from './compare-print-generic-profile.interface';
import { IComparePrintProfileEntity } from './compare-print-profile-entity.interface';

export type  IComparePrintBase<T extends ICompositeBaseEntity<T>> = ICompareSettingBase<T> & {
	pageLayout: IComparePrintPageLayout;
	report: IComparePrintReport;
	loadModeValue?: string;
	genericProfileSelectedValue?: number;
	rfqProfileSelectedValue?: number;
	genericProfiles: IComparePrintProfileEntity[];
	rfqProfiles: IComparePrintProfileEntity[];
}