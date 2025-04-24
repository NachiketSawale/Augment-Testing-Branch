/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */


import { IEntityBase } from '@libs/platform/common';

export interface ICompanyICCuEntity extends IEntityBase {

	CommentText?: string | null;
	CompanyFk?: number | null;
	CompanyReceivingFk?: number | null;
	ControllingUnitFk?: number | null;
	Id?: number | null;
	UserDefined1?: string | null;
	UserDefined2?: string | null;
	UserDefined3?: string | null;
	UserDefined4?: string | null;
	UserDefined5?: string | null;
}
