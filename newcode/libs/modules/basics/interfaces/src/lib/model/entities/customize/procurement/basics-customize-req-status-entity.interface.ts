/*
 * Copyright(c) RIB Software GmbH
 */

import { IDescriptionInfo, IEntityBase, IEntityIdentification } from '@libs/platform/common';

export interface IBasicsCustomizeReqStatusEntity extends IEntityBase, IEntityIdentification {
	DescriptionInfo?: IDescriptionInfo;
	Sorting: number;
	IsDefault: boolean;
	Icon: number;
	Isaccepted: boolean;
	IsReadOnly: boolean;
	Iscanceled: boolean;
	Isvirtual: boolean;
	Ispublished: boolean;
	Isquoted: boolean;
	Isordered: boolean;
	IsoptionalUpwards: boolean;
	IsoptionalDownwards: boolean;
	Isrevised: boolean;
	IsLive: boolean;
	AccessrightDescriptorFk: number;
	Code: string;
	IsBaselineUpdateInvalid: boolean;
}
