/*
 * Copyright(c) RIB Software GmbH
 */

import { IDescriptionInfo, IEntityBase, IEntityIdentification } from '@libs/platform/common';

export interface IBasicsCustomizeRfqStatusEntity extends IEntityBase, IEntityIdentification {
	DescriptionInfo?: IDescriptionInfo;
	Sorting: number;
	IsDefault: boolean;
	Icon: number;
	Isadvertised: boolean;
	Isquoted: boolean;
	Isordered: boolean;
	IsReadOnly: boolean;
	Iscanceled: boolean;
	Isvirtual: boolean;
	IsLive: boolean;
	AccessrightDescriptorFk: number;
	Code: string;
	IsBaselineUpdateInvalid: boolean;
}
