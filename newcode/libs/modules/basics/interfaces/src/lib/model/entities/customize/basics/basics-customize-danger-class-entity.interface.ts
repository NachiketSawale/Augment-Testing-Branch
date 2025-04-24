/*
 * Copyright(c) RIB Software GmbH
 */

import { IDescriptionInfo, IEntityBase, IEntityIdentification } from '@libs/platform/common';

export interface IBasicsCustomizeDangerClassEntity extends IEntityBase, IEntityIdentification {
	Code: string;
	DescriptionInfo?: IDescriptionInfo;
	RegulationNameInfo?: IDescriptionInfo;
	DangerCategoryInfo?: IDescriptionInfo;
	HazardLabelInfo?: IDescriptionInfo;
	PackageGroupInfo?: IDescriptionInfo;
	TunnelRestrictionCodeInfo?: IDescriptionInfo;
	DangerNameInfo?: IDescriptionInfo;
	UomCapacityFk: number;
	RiskFactor: number;
	PackageTypeFk: number;
	UserDefText01: string;
	UserDefText02: string;
	UserDefText03: string;
	UserDefText04: string;
	UserDefText05: string;
	UserDefInt01: number;
	UserDefInt02: number;
	UserDefInt03: number;
	UserDefInt04: number;
	UserDefInt05: number;
}
