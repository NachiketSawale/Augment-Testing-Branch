/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase } from '@libs/platform/common';
import { ICompanyEntity } from './company-entity.interface';

export interface ICompany2PrjGroupEntity extends IEntityBase {
	CommentText?: string | null;
	CompanyEntity?: ICompanyEntity | null;
	CompanyFk?: number | null;
	GroupFk?: number | null;
	Id?: number | null;
	IsActive?: boolean | null;
	ProjectGroupParentFk?: number | null;
}
