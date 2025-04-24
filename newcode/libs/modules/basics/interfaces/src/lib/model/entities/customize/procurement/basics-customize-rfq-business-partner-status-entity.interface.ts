/*
 * Copyright(c) RIB Software GmbH
 */

import { IDescriptionInfo, IEntityBase, IEntityIdentification } from '@libs/platform/common';

export interface IBasicsCustomizeRfqBusinessPartnerStatusEntity extends IEntityBase, IEntityIdentification {
	DescriptionInfo?: IDescriptionInfo;
	Sorting: number;
	IsDefault: boolean;
	IsRequested: boolean;
	IsCanceled: boolean;
	IsQuoted: boolean;
	IsDenied: boolean;
	IsLive: boolean;
}
