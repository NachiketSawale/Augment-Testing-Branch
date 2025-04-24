/*
 * Copyright(c) RIB Software GmbH
 */

import { IDescriptionInfo, IEntityBase, IEntityIdentification } from '@libs/platform/common';

export interface IBasicsCustomizeBlockingReasonEntity extends IEntityBase, IEntityIdentification {
	DescriptionInfo?: IDescriptionInfo;
	Sorting: number;
	Reference: string;
	UserDefined01: string;
	UserDefined02: string;
	UserDefined03: string;
	IsDefault: boolean;
	IsLive: boolean;
}
