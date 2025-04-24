/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { ICheckListGroupTemplateEntity } from './check-list-group-template-entity.interface';
import { IDescriptionInfo, IEntityBase } from '@libs/platform/common';

export interface ICheckListGroupTemplateEntityGenerated extends IEntityBase {
	/*
	 * BasRubricCategoryFk
	 */
	BasRubricCategoryFk?: number | null;

	/*
	 * ChildItems
	 */
	ChildItems?: ICheckListGroupTemplateEntity[] | null;

	/*
	 * Code
	 */
	Code?: string | null;

	/*
	 * CommentText
	 */
	CommentText?: string | null;

	/*
	 * DescriptionInfo
	 */
	DescriptionInfo?: IDescriptionInfo | null;

	/*
	 * HasChildren
	 */
	HasChildren?: boolean | null;

	/*
	 * HsqCheckListGroupFk
	 */
	HsqCheckListGroupFk?: number | null;

	/*
	 * HsqCheckListTypeFk
	 */
	HsqCheckListTypeFk?: number | null;

	/*
	 * HsqContextFk
	 */
	HsqContextFk?: number | null;

	/*
	 * Id
	 */
	Id?: number | null;

	/*
	 * IsGroup
	 */
	IsGroup?: boolean | null;

	/*
	 * PrcStructureFk
	 */
	PrcStructureFk?: number | null;

	/*
	 * PsdActivityTemplateFk
	 */
	PsdActivityTemplateFk?: number | null;
}
