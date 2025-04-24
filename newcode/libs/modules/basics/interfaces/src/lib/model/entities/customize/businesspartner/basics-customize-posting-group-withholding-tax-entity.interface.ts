/*
 * Copyright(c) RIB Software GmbH
 */

import { IDescriptionInfo, IEntityBase, IEntityIdentification } from '@libs/platform/common';

export interface IBasicsCustomizePostingGroupWithholdingTaxEntity extends IEntityBase, IEntityIdentification {
	SubledgerContextFk: number;
	DescriptionInfo?: IDescriptionInfo;
	Sorting: number;
	IsDefault: boolean;
	GroupFinance: string;
	IsLive: boolean;
}
