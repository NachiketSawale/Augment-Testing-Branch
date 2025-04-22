/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase } from '@libs/platform/common';
import { IWipHeaderEntity } from './wip-header-entity.interface';
import { IWipStatusEntity } from './wip-status-entity.interface';

export interface IWipStatusHistoryEntityGenerated extends IEntityBase {

	/**
	 * Id
	 */
	Id: number;

	/**
	 * Remark
	 */
	Remark?: string | null;

	/**
	 * WipHeaderEntity
	 */
	WipHeaderEntity?: IWipHeaderEntity | null;

	/**
	 * WipHeaderFk
	 */
	WipHeaderFk: number;

	/**
	 * WipStatusEntity_WipStatusNewFk
	 */
	WipStatusEntity_WipStatusNewFk?: IWipStatusEntity | null;

	/**
	 * WipStatusEntity_WipStatusOldFk
	 */
	WipStatusEntity_WipStatusOldFk?: IWipStatusEntity | null;

	/**
	 * WipStatusNewFk
	 */
	WipStatusNewFk: number;

	/**
	 * WipStatusOldFk
	 */
	WipStatusOldFk: number;
}
