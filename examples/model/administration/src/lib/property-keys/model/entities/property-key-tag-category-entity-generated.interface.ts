/*
 * Copyright(c) RIB Software GmbH
 */

import { IPropertyKeyTagCategoryEntity } from './property-key-tag-category-entity.interface';
import { IDescriptionInfo, IEntityBase } from '@libs/platform/common';

export interface IPropertyKeyTagCategoryEntityGenerated extends IEntityBase {

	/*
	 * DescriptionInfo
	 */
	DescriptionInfo?: IDescriptionInfo | null;

	/*
	 * Id
	 */
	Id: number;

	/*
	 * PropertyKeyTagChildCategoryEntities
	 */
	PropertyKeyTagChildCategoryEntities?: IPropertyKeyTagCategoryEntity[] | null;

	/*
	 * PropertyKeyTagParentCategoryEntity
	 */
	PropertyKeyTagParentCategoryEntity?: IPropertyKeyTagCategoryEntity | null;

	/*
	 * PropertyKeyTagParentCategoryFk
	 */
	PropertyKeyTagParentCategoryFk?: number | null;

	/*
	 * RemarkInfo
	 */
	RemarkInfo?: IDescriptionInfo | null;
}
