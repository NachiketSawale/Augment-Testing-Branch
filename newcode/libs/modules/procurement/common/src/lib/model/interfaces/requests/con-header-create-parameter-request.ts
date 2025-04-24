/*
 * Copyright(c) RIB Software GmbH
 */

import { IConHeaderEntity } from '@libs/procurement/interfaces';

export interface IConHeaderCreateParameterRequest {
	BusinessPartnerFk?: number | null;
	Code?: string | null;
	ConHeaders?: Array<IConHeaderEntity> | null;
	ConfigurationFk?: number | null;
	ContactFk?: number | null;
	DoesCopyHeaderTextFromPackage?: boolean | null;
	ProjectFk?: number | null;
	SubsidiaryFk?: number | null;
	SupplierFk?: number | null;
	/*
	subpackage id
	 */
	mainItemId?: number | null;
}
