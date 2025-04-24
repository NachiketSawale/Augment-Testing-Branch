/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IEntityIdentification } from '@libs/platform/common';

export interface IProjectStock2PrjStockLookupEntityGenerated extends IEntityIdentification{
	ProjectFk: number;
	Code: string;
	Description: string;
	IsDefault: boolean;
	IsLocationMandatory: boolean;
	IsProvisionAllowed: boolean;
	CompanyFk: number;
	ControllingUnitFk?: number;
	IsInterCompany: boolean;
	ProjectContextFk?: number;
	CuCompanyFk?: number;
	IsProcurement: boolean;
	IsDispatching: boolean;
	IsWorkspace: boolean;
	IsResourceRequisition: boolean;
	IsApprovedMaterial: boolean;
}