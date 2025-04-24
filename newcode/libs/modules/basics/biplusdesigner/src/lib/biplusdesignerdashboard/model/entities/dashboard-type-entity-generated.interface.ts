/*
 * Copyright(c) RIB Software GmbH
 */

import { IDashboardEntity } from './dashboard-entity.interface';
import { IEntityBase, IDescriptionInfo } from '@libs/platform/common';

export interface IDashboardTypeEntityGenerated extends IEntityBase {
	/*
	 * DashboardEntities
	 */
	DashboardEntities?: IDashboardEntity[] | null;

	/*
	 * DescriptionInfo
	 */
	DescriptionInfo?: IDescriptionInfo | null;

	/*
	 * Id
	 */
	Id?: number | null;

	/*
	 * IsDefault
	 */
	IsDefault?: boolean | null;

	/*
	 * IsLive
	 */
	IsLive?: boolean | null;

	/*
	 * Sorting
	 */
	Sorting?: number | null;
}
