/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase } from '@libs/platform/common';
import { ICompanyEntity } from './company-entity.interface';

export interface ICompany2BasClerkEntityGenerated extends IEntityBase {
	/*
 * ClerkFk
 */
	ClerkFk?: number | null;

	/*
 * ClerkRoleFk
 */
	ClerkRoleFk?: number | null;

	/*
 * CommentText
 */
	CommentText?: string | null;

	/*
 * CompanyEntity
 */
	CompanyEntity?: ICompanyEntity | null;

	/*
 * CompanyFk
 */
	CompanyFk?: number | null;

	/*
 * Id
 */
	Id?: number | null;

	/*
 * ValidFrom
 */
	ValidFrom?: string | null;

	/*
 * ValidTo
 */
	ValidTo?: string | null;
}
