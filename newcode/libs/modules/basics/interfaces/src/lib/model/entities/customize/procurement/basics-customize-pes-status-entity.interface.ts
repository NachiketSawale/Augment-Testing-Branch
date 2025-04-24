/*
 * Copyright(c) RIB Software GmbH
 */

import { IDescriptionInfo, IEntityBase, IEntityIdentification } from '@libs/platform/common';

export interface IBasicsCustomizePesStatusEntity extends IEntityBase, IEntityIdentification {
	DescriptionInfo?: IDescriptionInfo;
	Sorting: number;
	IsDefault: boolean;
	Icon: number;
	IsReadOnly: boolean;
	Isvirtual: boolean;
	Isinvoiced: boolean;
	Iscanceled: boolean;
	Isadvised: boolean;
	Isstock: boolean;
	IsLive: boolean;
	Isdelivered: boolean;
	Isprotected: boolean;
	AccessrightDescriptorFk: number;
	Code: string;
	IsRevenueRecognition: boolean;
	IsPosted: boolean;
	IsAccepted: boolean;
}
