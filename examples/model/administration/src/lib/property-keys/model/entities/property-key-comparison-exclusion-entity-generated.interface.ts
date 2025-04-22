/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase } from '@libs/platform/common';

export interface IPropertyKeyComparisonExclusionEntityGenerated extends IEntityBase {

	/*
	 * CompanyFk
	 */
	CompanyFk: number;

	/*
	 * Id
	 */
	Id: number;

	/*
	 * ProjectFk
	 */
	ProjectFk?: number | null;

	/*
	 * PropertyKeyFk
	 */
	PropertyKeyFk: number;
}
