/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase } from '@libs/platform/common';

export interface ICosChgOption2InsEntityGenerated extends IEntityBase {
	/**
	 * Id
	 */
	Id: number;

	/**
	 * InsHeaderFk
	 */
	InsHeaderFk: number;

	/**
	 * InstanceFk
	 */
	InstanceFk: number;

	/**
	 * IsChange
	 */
	IsChange: boolean;

	/**
	 * IsCopyLineItems
	 */
	IsCopyLineItems: boolean;

	/**
	 * IsMergeLineItems
	 */
	IsMergeLineItems: boolean;
}
