/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase, IDescriptionInfo } from '@libs/platform/common';

export interface IMaterialGroupCharEntityGenerated extends IEntityBase {
	/**
	 * Hasfixedvalues
	 */
	Hasfixedvalues: boolean;

	/**
	 * Id
	 */
	Id: number;

	/**
	 * MaterialGroupFk
	 */
	MaterialGroupFk: number;

	/**
	 * PropertyInfo
	 */
	PropertyInfo?: IDescriptionInfo | null;
}
