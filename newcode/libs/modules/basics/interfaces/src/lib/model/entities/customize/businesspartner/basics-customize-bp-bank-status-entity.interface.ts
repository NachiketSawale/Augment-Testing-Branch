/*
 * Copyright(c) RIB Software GmbH
 */

import { IDescriptionInfo, IEntityBase, IEntityIdentification } from '@libs/platform/common';

export interface IBasicsCustomizeBpBankStatusEntity extends IEntityBase, IEntityIdentification {
	DescriptionInfo?: IDescriptionInfo;
	Sorting: number;
	IsDefault: boolean;
	Icon: number;
	IsLive: boolean;
	IsReadOnly: boolean;
	IsApproved: boolean;
	IsDisabled: boolean;
	Code: string;
}
