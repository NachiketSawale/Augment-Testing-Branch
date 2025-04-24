/*
 * Copyright(c) RIB Software GmbH
 */

import { IDescriptionInfo, IEntityBase, IEntityIdentification } from '@libs/platform/common';

export interface IBasicsAssetMasterEntity extends IEntityBase, IEntityIdentification {
	IsLive: boolean;
	Code: string;
	UserDefined1: string;
	UserDefined2: string;
	UserDefined3: string;
	UserDefined4: string;
	UserDefined5: string;
	DescriptionInfo: IDescriptionInfo;
	AddressFk?: number | null;
	HasChildren: boolean;
	AssetMasterChildren: IBasicsAssetMasterEntity[];
	AssetMasterParentFk?: number | null;
	AllowAssignment: boolean;
}
