/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase, IDescriptionInfo } from '@libs/platform/common';
import { IModuleEntity } from '../../../modules/model/entities/module-entity.interface';

export interface IModuleTabEntityGenerated extends IEntityBase {
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
	 * Id
	 */
	Id?: number | null;

	/*
	 * IsVisible
	 */
	IsVisible?: boolean | null;

	/*
	 * ModuleEntity
	 */
	ModuleEntity?: IModuleEntity | null;

	/*
	 * ModuleFk
	 */
	ModuleFk?: number | null;

	/*
	 * Sorting
	 */
	Sorting?: number | null;

	/*
	 * Visibility
	 */
	Visibility?: number | null;
}
