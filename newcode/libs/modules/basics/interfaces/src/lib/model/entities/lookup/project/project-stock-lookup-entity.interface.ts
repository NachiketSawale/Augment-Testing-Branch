/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityIdentification } from '@libs/platform/common';

export interface IProjectStockLookupEntity extends IEntityIdentification {
	Code: string;
	Description: string;
	CompanyFk: number;
	ProjectFk: number;
	IsProcurement: boolean;
	IsProvisionAllowed: boolean;
	IsLocationMandatory: boolean;
}
