/*
 * Copyright(c) RIB Software GmbH
 */

import { IDescriptionInfo, IEntityBase, IEntityIdentification } from '@libs/platform/common';

export interface IBasicsCustomizeTimekeepingEmployeeCertificateStatusEntity extends IEntityBase, IEntityIdentification {
	Icon: number;
	IsDefault: boolean;
	IsDraft: boolean;
	IsApproved: boolean;
	IsCanceled: boolean;
	IsReadOnly: boolean;
	IsLive: boolean;
	Sorting: number;
	DescriptionInfo?: IDescriptionInfo;
}
