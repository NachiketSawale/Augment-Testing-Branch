/*
 * Copyright(c) RIB Software GmbH
 */

import { IDescriptionInfo, IEntityBase, IEntityIdentification } from '@libs/platform/common';

export interface IBasicsCustomizePlantCertificateStatusEntity extends IEntityBase, IEntityIdentification {
	DescriptionInfo?: IDescriptionInfo;
	IsDraft: boolean;
	IsApproved: boolean;
	IsCanceled: boolean;
	IsReadOnly: boolean;
	IsDefault: boolean;
	IsLive: boolean;
	Sorting: number;
	Icon: number;
	Code: string;
}
