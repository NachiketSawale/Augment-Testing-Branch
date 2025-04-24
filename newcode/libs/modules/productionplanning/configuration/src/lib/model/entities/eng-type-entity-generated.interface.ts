/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IDescriptionInfo, IEntityBase } from '@libs/platform/common';

export interface IEngTypeEntityGenerated extends IEntityBase {

	/*
	 * DescriptionInfo
	 */
	DescriptionInfo?: IDescriptionInfo | null;

	/*
	 * Icon
	 */
	Icon?: number | null;

	/*
	 * Id
	 */
	Id: number;

	/*
	 * IsDefault
	 */
	IsDefault?: boolean | null;

	/*
	 * IsLive
	 */
	IsLive?: boolean | null;

	/*
	 * RubricCategoryFk
	 */
	RubricCategoryFk?: number | null;

	/*
	 * Sorting
	 */
	Sorting?: number | null;
}
