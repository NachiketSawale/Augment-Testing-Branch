/*
 * Copyright(c) RIB Software GmbH
 */

import { IDescriptionInfo, IEntityBase, IEntityIdentification } from '@libs/platform/common';

export interface IBasicsCustomizeRfqRejectionReasonEntity extends IEntityBase, IEntityIdentification {
	DescriptionInfo?: IDescriptionInfo;
	TextModuleFk: number;
	Sorting: number;
	IsDefault: boolean;
	IsLive: boolean;
}
