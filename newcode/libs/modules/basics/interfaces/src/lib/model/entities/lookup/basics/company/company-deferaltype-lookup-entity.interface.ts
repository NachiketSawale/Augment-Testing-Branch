/*
 * Copyright(c) RIB Software GmbH
 */

import { IDescriptionInfo, IEntityIdentification } from '@libs/platform/common';

export interface ICompanyDeferaltypeLookupEntity extends IEntityIdentification {
	DescriptionInfo?: IDescriptionInfo;
	IsStartDateMandatory: boolean;
	BasCompanyFk: number;
	IsDefault: boolean;
}
