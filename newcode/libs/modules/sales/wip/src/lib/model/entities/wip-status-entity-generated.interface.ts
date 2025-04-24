/*
 * Copyright(c) RIB Software GmbH
 */

import { IWipHeaderEntity } from './wip-header-entity.interface';
import { IWipStatusHistoryEntity } from './wip-status-history-entity.interface';
import { IDescriptionInfo, IEntityBase } from '@libs/platform/common';

export interface IWipStatusEntityGenerated extends IEntityBase {

	/**
	 * AccessRightDescriptorFk
	 */
	AccessRightDescriptorFk?: number | null;

	/**
	 * DescriptionInfo
	 */
	DescriptionInfo?: IDescriptionInfo | null;

	/**
	 * Icon
	 */
	Icon: number;

	/**
	 * Id
	 */
	Id: number;

	/**
	 * IsAccepted
	 */
	IsAccepted: boolean;

	/**
	 * IsAccrued
	 */
	IsAccrued: boolean;

	/**
	 * IsCanceled
	 */
	IsCanceled: boolean;

	/**
	 * IsDefault
	 */
	IsDefault: boolean;

	/**
	 * IsLive
	 */
	IsLive: boolean;

	/**
	 * IsOrdered
	 */
	IsOrdered: boolean;

	/**
	 * IsProtected
	 */
	IsProtected: boolean;

	/**
	 * IsReadOnly
	 */
	IsReadOnly: boolean;

	/**
	 * RubricCategoryFk
	 */
	RubricCategoryFk: number;

	/**
	 * Sorting
	 */
	Sorting: number;

	/**
	 * WipHeaderEntities
	 */
	WipHeaderEntities?: IWipHeaderEntity[] | null;

	/**
	 * WipStatushistoryEntities_WipStatusNewFk
	 */
	WipStatushistoryEntities_WipStatusNewFk?: IWipStatusHistoryEntity[] | null;

	/**
	 * WipStatushistoryEntities_WipStatusOldFk
	 */
	WipStatushistoryEntities_WipStatusOldFk?: IWipStatusHistoryEntity[] | null;
}
