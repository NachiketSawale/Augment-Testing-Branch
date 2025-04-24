/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase } from '@libs/platform/common';
import { IProjectBoqEntity } from './project-boq-entity.interface';
import { IBoqHeaderEntity, IBoqItemEntity } from '@libs/boq/interfaces';

export interface IProjectBoqCompositeEntityGenerated extends IEntityBase {

	/*
	 * Boq
	 */
	Boq?: IProjectBoqEntity | null;

	/*
	 * BoqHeader
	 */
	BoqHeader: IBoqHeaderEntity;

	/*
	 * BoqRootItem
	 */
	BoqRootItem: IBoqItemEntity;

	/*
	 * Id
	 */
	readonly Id: number;

	/*
	 * IsBold
	 */
	IsBold?: boolean | null;

	/*
	 * IsMarked
	 */
	IsMarked?: boolean | null;

	/*
	 * PermissionObjectInfo
	 */
	PermissionObjectInfo?: string | null;
}
