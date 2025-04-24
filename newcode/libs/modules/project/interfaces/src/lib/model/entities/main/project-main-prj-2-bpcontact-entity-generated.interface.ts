/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */


import { IEntityBase, IEntityIdentification } from '@libs/platform/common';

export interface IProjectMainPrj2BPContactEntityGenerated extends IEntityBase, IEntityIdentification {
	Project2BusinessPartnerFk: number;
	BusinessPartnerFk: number;
	ContactFk: number;
	ProjectContactRoleTypeFk: number;
	IsLive: boolean;
	Remark: string;
}