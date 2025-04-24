/*
 * Copyright(c) RIB Software GmbH
 */

import { IDescriptionInfo, IEntityIdentification } from '@libs/platform/common';

export interface IProcurementConfigurationToBillingSchemaLookupEntity extends IEntityIdentification {
	DescriptionInfo: IDescriptionInfo;
	IsChained: boolean;
	IsChainedPes: boolean;
}
