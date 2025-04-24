/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */


import { IEntityBase } from '@libs/platform/common';
import { ICompanyEntity } from './company-entity.interface';

export interface ICompanyRoleBas2FrmEntity extends IEntityBase {
	AccessRoleFk?: number | null;
	ClerkRoleFk?: number | null;
	CommentText?: string | null;
	CompanyEntity?: ICompanyEntity | null;
	CompanyFk?: number | null;
	Id?: number | null;
}
