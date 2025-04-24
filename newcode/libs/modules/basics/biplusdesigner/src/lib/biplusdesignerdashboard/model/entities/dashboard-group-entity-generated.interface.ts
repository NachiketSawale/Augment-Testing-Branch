/*
 * Copyright(c) RIB Software GmbH
 */

import { IDashboard2GroupEntity } from './dashboard-2group-entity.interface';
import { IEntityBase, IDescriptionInfo } from '@libs/platform/common';

export interface IDashboardGroupEntityGenerated extends IEntityBase {
	/*
	 * Dashboard2GroupEntities
	 */
	Dashboard2GroupEntities?: IDashboard2GroupEntity[] | null;

	/*
	 * DescriptionInfo
	 */
	DescriptionInfo?: IDescriptionInfo | null;

	/*
	 * FrmAccessRightDescriptorFk
	 */
	FrmAccessRightDescriptorFk?: number | null;

	/*
	 * Icon
	 */
	Icon?: number | null;

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
