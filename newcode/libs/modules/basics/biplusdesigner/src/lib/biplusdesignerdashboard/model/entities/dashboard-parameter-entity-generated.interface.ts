/*
 * Copyright(c) RIB Software GmbH
 */

import { IDashboardEntity } from './dashboard-entity.interface';
import { IEntityBase, IDescriptionInfo } from '@libs/platform/common';

export interface IDashboardParameterEntityGenerated extends IEntityBase {
	/*
	 * BasDashboardFk
	 */
	BasDashboardFk?: number | null;

	/*
	 * DashboardEntity
	 */
	DashboardEntity?: IDashboardEntity | null;

	/*
	 * DataSource
	 */
	DataSource?: string | null;

	/*
	 * DataType
	 */
	DataType?: string | null;

	/*
	 * Default
	 */
	Default?: string | null;

	/*
	 * DescriptionInfo
	 */
	DescriptionInfo?: IDescriptionInfo | null;

	/*
	 * Id
	 */
	Id?: number | null;

	/*
	 * IsVisible
	 */
	IsVisible?: boolean | null;

	/*
	 * Name
	 */
	Name?: string | null;

	/*
	 * Sorting
	 */
	Sorting?: number | null;

	/*
	 * SysContext
	 */
	SysContext?: number | null;
}
