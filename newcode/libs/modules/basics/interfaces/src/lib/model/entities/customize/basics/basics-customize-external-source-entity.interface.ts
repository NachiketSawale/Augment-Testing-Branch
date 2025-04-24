/*
 * Copyright(c) RIB Software GmbH
 */

import { IDescriptionInfo, IEntityBase, IEntityIdentification } from '@libs/platform/common';

export interface IBasicsCustomizeExternalSourceEntity extends IEntityBase, IEntityIdentification {
	ExternalsourcetypeFk: number;
	ExternalconfigFk: number;
	DescriptionInfo?: IDescriptionInfo;
	IsDefault: boolean;
	Sorting: number;
	IsLive: boolean;
}
