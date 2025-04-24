/*
 * Copyright(c) RIB Software GmbH
 */

import { IHsqCheckListEntity } from './hsq-check-list-entity.interface';
import { IEntityBase } from '@libs/platform/common';

export interface IHsqCheckList2LocationEntityGenerated extends IEntityBase {
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

	/**
	 * PrjLocationFk
	 */
	PrjLocationFk: number;
}
