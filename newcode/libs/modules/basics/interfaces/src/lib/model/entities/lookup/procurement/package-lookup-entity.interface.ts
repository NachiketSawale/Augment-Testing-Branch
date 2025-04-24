/*
 * Copyright(c) RIB Software GmbH
 */

import {IEntityIdentification} from '@libs/platform/common';

export interface IProcurementPackageLookupEntity extends IEntityIdentification {
	Duration?: string | null;
	Code: string;
	Description?: string | null;
	ProjectFk?: number | null;
	TaxCodeFk: number;
	PackageStatusFk?: number | null;
	PackageTypeFk?: number | null;
	ClerkPrcFk?: number | null;
	ClerkReqFk?: number | null;
	StructureFk?: number | null;
	BasCompanyFk?: number | null;
	StrategyFk?: number | null;
	ConfigurationFk?: number | null;
	MdcControllingUnitFk?: number | null;
	PrcPackageConfigurationFk?: number | null;
	IsLive: boolean;
	SearchPattern?: string | null;
	PlannedStart?: Date | null;
	PlannedEnd?: Date | null;
	ActualStart?: Date | null;
	ActualEnd?: Date | null;
	BusinessPartnerFk?: number | null;
	TextInfo?: string | null;
	Remark?: string | null;
	Remark2?: string | null;
	Remark3?: string | null;
}