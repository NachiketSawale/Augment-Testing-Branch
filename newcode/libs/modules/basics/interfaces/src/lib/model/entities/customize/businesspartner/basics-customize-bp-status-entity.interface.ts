/*
 * Copyright(c) RIB Software GmbH
 */

import { IDescriptionInfo, IEntityBase, IEntityIdentification } from '@libs/platform/common';

export interface IBasicsCustomizeBpStatusEntity extends IEntityBase, IEntityIdentification {
	DescriptionInfo?: IDescriptionInfo;
	Sorting: number;
	IsOptionalDownwards: boolean;
	IsOptionalUpwards: boolean;
	MessageInfo?: IDescriptionInfo;
	IsDefault: boolean;
	Icon: number;
	AccessrightDescriptorFk: number;
	AccessrightDescriptor02Fk: number;
	AccessrightDescriptor03Fk: number;
	AccessrightDescriptor04Fk: number;
	IsSapCreated: number;
	EditName: boolean;
	IsLive: boolean;
	IsReadOnly: boolean;
	IsApproved: boolean;
	Code: string;
}
