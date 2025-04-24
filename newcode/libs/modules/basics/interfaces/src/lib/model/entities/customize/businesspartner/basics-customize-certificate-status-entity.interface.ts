/*
 * Copyright(c) RIB Software GmbH
 */

import { IDescriptionInfo, IEntityBase, IEntityIdentification } from '@libs/platform/common';

export interface IBasicsCustomizeCertificateStatusEntity extends IEntityBase, IEntityIdentification {
	DescriptionInfo?: IDescriptionInfo;
	Sorting: number;
	IsoptionalDownwards: boolean;
	IsoptionalUpwards: boolean;
	IsDefault: boolean;
	Icon: number;
	Isrequest: boolean;
	IsReadOnly: boolean;
	Isescalation: boolean;
	CertificatestatusFk: number;
	Increaseafterdays: number;
	RemindertextInfo?: IDescriptionInfo;
	IsLive: boolean;
	Code: string;
}
