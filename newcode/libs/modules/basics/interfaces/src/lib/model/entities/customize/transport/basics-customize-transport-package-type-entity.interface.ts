/*
 * Copyright(c) RIB Software GmbH
 */

import { IDescriptionInfo, IEntityBase, IEntityIdentification } from '@libs/platform/common';

export interface IBasicsCustomizeTransportPackageTypeEntity extends IEntityBase, IEntityIdentification {
	DescriptionInfo?: IDescriptionInfo;
	RubricCategoryFk: number;
	Icon: number;
	IsDefault: boolean;
	Sorting: number;
	IsLive: boolean;
	AccessrightDescriptorFk: number;
	UomDefaultFk: number;
}
