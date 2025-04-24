/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase } from '@libs/platform/common';

export interface IBil2WipEntityGenerated extends IEntityBase {

	/**
	 * BilHeaderFk
	 */
	BilHeaderFk: number;

	/**
	 * Id
	 */
	Id: number;

	/**
	 * WipHeaderFk
	 */
	WipHeaderFk: number;
}
