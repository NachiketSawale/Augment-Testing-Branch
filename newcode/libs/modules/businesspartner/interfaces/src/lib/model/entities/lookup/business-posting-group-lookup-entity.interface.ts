/*
 * Copyright(c) RIB Software GmbH
 */

import { IDescriptionInfo, IEntityIdentification } from '@libs/platform/common';

export interface IBusinessPostingGroupLookupEntity extends IEntityIdentification {
	DescriptionInfo: IDescriptionInfo;
}
