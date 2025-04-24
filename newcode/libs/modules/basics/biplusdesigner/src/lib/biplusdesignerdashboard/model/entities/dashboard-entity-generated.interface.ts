/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase, IDescriptionInfo } from '@libs/platform/common';
import { IDashboard2GroupEntity } from './dashboard-2group-entity.interface';
import { IDashboardParameterEntity } from './dashboard-parameter-entity.interface';
import { IDashboardTypeEntity } from './dashboard-type-entity.interface';

export interface IDashboardEntityGenerated extends IEntityBase {
	/*
	 * BasDashboardTypeFk
	 */
	BasDashboardTypeFk?: number | null;

	/*
	 * Dashboard2GroupEntities
	 */
	Dashboard2GroupEntities?: IDashboard2GroupEntity[] | null;

	/*
	 * DashboardParameterEntities
	 */
	DashboardParameterEntities?: IDashboardParameterEntity[] | null;

	/*
	 * DashboardTypeEntity
	 */
	DashboardTypeEntity?: IDashboardTypeEntity | null;

	/*
	 * DescriptionInfo
	 */
	DescriptionInfo?: IDescriptionInfo | null;

	/*
	 * ExternalId
	 */
	ExternalId?: string | null;

	/*
	 * ExternalName
	 */
	ExternalName?: string | null;

	/*
	 * HasTranslation
	 */
	HasTranslation?: boolean | null;

	/*
	 * Id
	 */
	Id?: number | null;

	/*
	 * IsActive
	 */
	IsActive?: boolean | null;

	/*
	 * IsAvailable
	 */
	IsAvailable?: boolean | null;

	/*
	 * IsVisible
	 */
	IsVisible?: boolean | null;

	/*
	 * NameInfo
	 */
	NameInfo?: IDescriptionInfo | null;

	/*
	 * Sorting
	 */
	Sorting?: number | null;
}
