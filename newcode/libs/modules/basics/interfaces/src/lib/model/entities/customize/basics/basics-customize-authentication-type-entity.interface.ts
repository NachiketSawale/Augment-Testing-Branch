/*
 * Copyright(c) RIB Software GmbH
 */

import { IDescriptionInfo, IEntityBase, IEntityIdentification } from '@libs/platform/common';

export interface IBasicsCustomizeAuthenticationTypeEntity extends IEntityBase, IEntityIdentification {
	DescriptionInfo?: IDescriptionInfo;
	IsDefault: boolean;
	Sorting: number;
	IsLive: boolean;
}
