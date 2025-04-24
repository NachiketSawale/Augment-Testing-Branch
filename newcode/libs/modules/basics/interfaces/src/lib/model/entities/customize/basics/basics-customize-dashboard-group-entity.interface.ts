/*
 * Copyright(c) RIB Software GmbH
 */

import { IDescriptionInfo, IEntityBase, IEntityIdentification } from '@libs/platform/common';

export interface IBasicsCustomizeDashboardGroupEntity extends IEntityBase, IEntityIdentification {
	DescriptionInfo?: IDescriptionInfo;
	AccessrightDescriptorFk: number;
	Icon: number;
	Sorting: number;
	IsVisible: boolean;
	Visibility: number;
	IsLive: boolean;
	IsDefault: boolean;
	NameInfo?: IDescriptionInfo;
}
