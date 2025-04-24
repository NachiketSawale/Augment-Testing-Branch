/*
 * Copyright(c) RIB Software GmbH
 */

import { IDashboardEntity } from './dashboard-entity.interface';
import { IDashboardGroupEntity } from './dashboard-group-entity.interface';
import { IEntityBase, IDescriptionInfo } from '@libs/platform/common';

export interface IDashboard2GroupEntityGenerated extends IEntityBase {
	/*
	 * AccessRightDescriptor
	 */
	AccessRightDescriptor?: string | null;

	/*
	 * BasDashboardFk
	 */
	BasDashboardFk?: number | null;

	/*
	 * BasDashboardGroupFk
	 */
	BasDashboardGroupFk?: number | null;

	/*
	 * DashboardEntity
	 */
	DashboardEntity?: IDashboardEntity | null;

	/*
	 * DashboardGroupEntity
	 */
	DashboardGroupEntity?: IDashboardGroupEntity | null;

	/*
	 * DescriptionInfo
	 */
	DescriptionInfo?: IDescriptionInfo | null;

	/*
	 * FrmAccessRightDescriptorFk
	 */
	FrmAccessRightDescriptorFk?: number | null;

	/*
	 * Id
	 */
	Id?: number | null;

	/*
	 * IsVisible
	 */
	IsVisible?: boolean | null;

	/*
	 * Sorting
	 */
	Sorting?: number | null;

	/*
	 * Visibility
	 */
	Visibility?: number | null;
}
