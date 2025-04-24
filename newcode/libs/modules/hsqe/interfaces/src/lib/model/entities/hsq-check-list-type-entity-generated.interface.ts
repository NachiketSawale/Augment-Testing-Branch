/*
 * Copyright(c) RIB Software GmbH
 */

import { IHsqCheckListEntity } from './hsq-check-list-entity.interface';
import { IDescriptionInfo, IEntityBase } from '@libs/platform/common';

export interface IHsqCheckListTypeEntityGenerated extends IEntityBase {
	/**
	 * BasRubricCategoryFk
	 */
	BasRubricCategoryFk: number;

	/**
	 * DescriptionInfo
	 */
	DescriptionInfo?: IDescriptionInfo | null;

	/**
	 * HsqCheckListEntities
	 */
	HsqCheckListEntities?: IHsqCheckListEntity[] | null;

	/**
	 * Id
	 */
	Id: number;

	/**
	 * IsDefault
	 */
	IsDefault: boolean;

	/**
	 * IsLive
	 */
	IsLive: boolean;

	/**
	 * Sorting
	 */
	Sorting: number;
}
