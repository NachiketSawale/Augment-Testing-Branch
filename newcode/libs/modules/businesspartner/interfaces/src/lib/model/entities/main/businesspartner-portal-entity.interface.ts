/*
 * Copyright(c) RIB Software GmbH
 */

import {IEntityIdentification} from '@libs/platform/common';

export interface IBusinessPartnerPortalEntity extends IEntityIdentification{
	BusinessPartnerName1?: string | null;
	BusinessPartnerName2?: string | null;
	Email?: string | null;
	MatchCode?: string | null;
	Street?: string | null;
	ZipCode?: string | null;
	City?: string | null;
	County?: string | null;
	SubsidiaryFk?: number | null;
	SupplierId?: number | null;
	CountryFk?: number | null;
	Userdefined1?: string | null;
	BpdStatusFk: number;
	BpdStatus2Fk?: number | null;
	Code?: string | null;
}
