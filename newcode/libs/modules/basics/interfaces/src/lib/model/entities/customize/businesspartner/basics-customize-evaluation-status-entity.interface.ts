/*
 * Copyright(c) RIB Software GmbH
 */

import { IDescriptionInfo, IEntityBase, IEntityIdentification } from '@libs/platform/common';

export interface IBasicsCustomizeEvaluationStatusEntity extends IEntityBase, IEntityIdentification {
	DescriptionInfo?: IDescriptionInfo;
	Sorting: number;
	Icon: number;
	IsLive: boolean;
	IsDefault: boolean;
	Readonly: boolean;
	DenyDelete: boolean;
	AccessrightDescriptorFk: number;
	Code: string;
	NotToCount: boolean;
}
