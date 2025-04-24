/*
 * Copyright(c) RIB Software GmbH
 */

import { IDescriptionInfo, IEntityBase } from '@libs/platform/common';

export interface IPropertyKeyTagEntityGenerated extends IEntityBase {

	/*
	 * DescriptionInfo
	 */
	DescriptionInfo?: IDescriptionInfo | null;

	/*
	 * Id
	 */
	Id: number;

	/*
	 * ModelImportPropertyKeyTag
	 */
	ModelImportPropertyKeyTag: boolean;

	/*
	 * PropertyKeyTagCategoryFk
	 */
	PropertyKeyTagCategoryFk: number;

	/*
	 * PublicApiPropertyKeyTag
	 */
	PublicApiPropertyKeyTag: boolean;

	/*
	 * RemarkInfo
	 */
	RemarkInfo?: IDescriptionInfo | null;

	/*
	 * UserPropertyKeyTag
	 */
	UserPropertyKeyTag: boolean;
}
