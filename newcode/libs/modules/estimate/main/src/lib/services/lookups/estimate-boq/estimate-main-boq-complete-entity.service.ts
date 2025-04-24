/*
 * Copyright(c) RIB Software GmbH
 */
import { IBoqHeaderEntity, IBoqItemEntity } from '@libs/boq/interfaces';
import { IProjectBoqEntity } from '@libs/boq/project';

export interface EstimateMainBoqCompleteEntity {
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