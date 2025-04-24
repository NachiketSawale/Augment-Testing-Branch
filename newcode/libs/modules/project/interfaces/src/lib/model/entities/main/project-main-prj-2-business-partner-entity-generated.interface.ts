/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase, IEntityIdentification } from '@libs/platform/common';

export interface IProjectMainPrj2BusinessPartnerGenerated extends IEntityBase, IEntityIdentification {
	BusinessPartnerFk: number;
	SubsidiaryFk: number;
	RoleFk: number;
	ProjectFk: number;
	IsLive: boolean;
	Remark: string;
}