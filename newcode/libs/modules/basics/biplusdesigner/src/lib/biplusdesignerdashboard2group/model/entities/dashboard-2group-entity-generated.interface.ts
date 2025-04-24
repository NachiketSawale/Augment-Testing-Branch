/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase, IDescriptionInfo } from '@libs/platform/common';
import { IDashboardEntity } from '../../../biplusdesignerdashboard/model/entities/dashboard-entity.interface';
import { IDashboardGroupEntity } from '../../../biplusdesignerdashboard/model/entities/dashboard-group-entity.interface';

/**
 * Basicsbiplusdesigner Dashboard to Group Entity Details
 */
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
