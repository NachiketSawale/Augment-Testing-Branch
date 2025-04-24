/*
 * Copyright(c) RIB Software GmbH
 */

import { IHsqCheckListEntity } from './hsq-check-list-entity.interface';
import { IDescriptionInfo, IEntityBase } from '@libs/platform/common';

export interface IHsqCheckList2FormEntityGenerated extends IEntityBase {
	/**
	 * BasFormDataFk
	 */
	BasFormDataFk: number;

	/**
	 * Code
	 */
	Code: string;

	/**
	 * DescriptionInfo
	 */
	DescriptionInfo?: IDescriptionInfo | null;

	/**
	 * FormFk
	 */
	FormFk: number;

	/**
	 * HsqCheckListEntity
	 */
	HsqCheckListEntity?: IHsqCheckListEntity | null;

	/**
	 * HsqCheckListFk
	 */
	HsqCheckListFk: number;

	/**
	 * Id
	 */
	Id: number;
}
