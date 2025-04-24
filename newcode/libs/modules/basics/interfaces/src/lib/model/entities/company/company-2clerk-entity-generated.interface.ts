/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase } from '@libs/platform/common';

export interface ICompany2ClerkEntityGenerated extends IEntityBase {
	/*
 * ActionFk
 */
	ClerkFk?: number | null;

	/*
 * ActionFk
 */
	CompanyFk?: number | null;

	/*
 * ActionFk
 */
	Id?: number | null;

	/*
 * ActionFk
 */
	ValidFrom?: string | null;

	/*
 * ActionFk
 */
	ValidTo?: string | null;
}
