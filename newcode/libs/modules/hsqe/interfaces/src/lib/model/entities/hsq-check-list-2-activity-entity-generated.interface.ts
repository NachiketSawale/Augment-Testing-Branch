/*
 * Copyright(c) RIB Software GmbH
 */

import { IHsqCheckListEntity } from './hsq-check-list-entity.interface';
import { IEntityBase } from '@libs/platform/common';

export interface IHsqCheckList2ActivityEntityGenerated extends IEntityBase {
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
	 * PsdActivityFk
	 */
	PsdActivityFk: number;

	/**
	 * PsdScheduleFk
	 */
	PsdScheduleFk: number;
}
