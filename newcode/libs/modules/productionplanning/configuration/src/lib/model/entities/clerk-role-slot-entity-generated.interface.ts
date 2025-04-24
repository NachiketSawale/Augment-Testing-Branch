/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IDescriptionInfo, IEntityBase } from '@libs/platform/common';

export interface IClerkRoleSlotEntityGenerated extends IEntityBase {

	/*
	 * ClerkRoleFk
	 */
	ClerkRoleFk?: number | null;

	/*
	 * ColumnTitle
	 */
	ColumnTitle?: IDescriptionInfo | null;

	/*
	 * Id
	 */
	Id: number;

	/*
	 * IsForEngTask
	 */
	IsForEngTask?: boolean | null;

	/*
	 * IsReadOnly
	 */
	IsReadOnly?: boolean | null;

	/*
	 * PpsEntityFk
	 */
	PpsEntityFk?: number | null;

	/*
	 * PpsEntityRefFk
	 */
	PpsEntityRefFk?: number | null;
}
