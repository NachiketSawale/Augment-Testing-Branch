/*
 * Copyright(c) RIB Software GmbH
 */

import { IHsqCheckListEntity } from './hsq-check-list-entity.interface';

export interface IDdTempIdsEntityGenerated {
	/**
	 * HsqCheckListEntity
	 */
	HsqCheckListEntity?: IHsqCheckListEntity | null;

	/**
	 * Id
	 */
	Id: number;

	/**
	 * Key1
	 */
	Key1?: number | null;

	/**
	 * Key2
	 */
	Key2?: number | null;

	/**
	 * Key3
	 */
	Key3?: number | null;

	/**
	 * RequestId
	 */
	RequestId: string;
}
