/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase, IEntityIdentification } from '@libs/platform/common';

export interface IProjectMainBusinessPartnerSiteEntityGenerated extends IEntityBase, IEntityIdentification {
	Project2BusinessPartnerFk: number;
	ProjectFk: number,
	BusinessPartnerFk: number;
	SubsidiaryFk: number;
	LocationFk: number | null;
	AssetMasterFk: number | null;
	Comment: string;
	Remark: string;
}