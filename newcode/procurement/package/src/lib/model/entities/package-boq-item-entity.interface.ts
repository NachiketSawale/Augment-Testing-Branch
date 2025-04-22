/*
 * Copyright(c) RIB Software GmbH
 */

import {IBoqItemEntity} from '@libs/boq/interfaces';
import {IDescriptionInfo, IEntityBase} from '@libs/platform/common';

export interface IPackageBoqItemEntity extends IBoqItemEntity {
	// override fields
	/*
 	 * BoqItemBasisParent
 	 */
	BoqItemBasisParent?: IPackageBoqItemEntity | null;

	/*
	 * BoqItemChildren
	 */
	BoqItemChildren?: IPackageBoqItemEntity[] | null;


	/*
	 * BoqItemEntities_BoqItemQtnBoqFk_BoqItemQtnItemFk
	 */
	BoqItemEntities_BoqItemQtnBoqFk_BoqItemQtnItemFk?: IPackageBoqItemEntity[] | null;

	/*
	 * BoqItemEntity_BoqItemQtnBoqFk_BoqItemQtnItemFk
	 */
	BoqItemEntity_BoqItemQtnBoqFk_BoqItemQtnItemFk?: IPackageBoqItemEntity | null;

	/*
	 * BoqItemParent
	 */
	BoqItemParent?: IPackageBoqItemEntity | null;

	/*
	 * BoqItemReferenceParent
	 */
	BoqItemReferenceParent?: IPackageBoqItemEntity | null;

	/*
	 * BoqItems
	 */
	BoqItems?: IPackageBoqItemEntity[] | null;

	/*
	 * WicChildren
	 */
	WicChildren?: IPackageBoqItemEntity[] | null;

	/*
	 * WicParent
	 */
	WicParent?: IPackageBoqItemEntity | null;

	// This index signature shall help to be able to access the properties of IBoqItemEntity via an index like "boqItem["propertyName"]"
	[key: string]: string | number | boolean | Date | IPackageBoqItemEntity | IDescriptionInfo | IEntityBase | Array<IEntityBase> | null | undefined | (() => boolean);

	// -------------- additional fields for dialog -----------------
	isSelect: boolean;

	BudgetPercent: number | null;

	weight: number;
}