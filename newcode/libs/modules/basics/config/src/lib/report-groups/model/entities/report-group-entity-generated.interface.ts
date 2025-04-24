/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase, IDescriptionInfo } from '@libs/platform/common';
import { IModuleEntity } from '../../../modules/model/entities/module-entity.interface';

export interface IReportGroupEntityGenerated extends IEntityBase {
	/*
	 * AccessRightDescriptor
	 */
	AccessRightDescriptor?: string | null;

	/*
	 * AccessRightDescriptorFk
	 */
	AccessRightDescriptorFk?: number | null;

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
	Id?: number | null;

	/*
	 * Isvisible
	 */
	Isvisible?: boolean | null;

	/*
	 * ModuleEntity
	 */
	ModuleEntity?: IModuleEntity | null;

	/*
	 * ModuleFk
	 */
	ModuleFk?: number | null;

	/*
	 * Report2GroupEntities
	 */
	// Report2GroupEntities?: IReport2GroupEntity[] | null;

	/*
	 * Sorting
	 */
	Sorting?: number | null;
}
