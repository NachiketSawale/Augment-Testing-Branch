/*
 * Copyright(c) RIB Software GmbH
 */

import { IDescriptionInfo, IEntityBase, IEntityIdentification } from '@libs/platform/common';

export interface IBasicsCustomizeTransportPackageStatusEntity extends IEntityBase, IEntityIdentification {
	Code: string;
	DescriptionInfo?: IDescriptionInfo;
	Sorting: number;
	Icon: number;
	Backgroundcolor: number;
	Fontcolor: number;
	Isinpackaging: boolean;
	Istransportable: boolean;
	Isdeletable: boolean;
	IsDefault: boolean;
	Userflag1: boolean;
	Userflag2: boolean;
	RubricCategoryFk: number;
	IsLive: boolean;
	Isdelivered: boolean;
}
