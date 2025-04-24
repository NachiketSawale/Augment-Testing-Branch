/*
 * Copyright(c) RIB Software GmbH
 */

import { Translatable } from '@libs/platform/common';

/**
 * Common menu tab interface.
 */
export interface IMenuTabParam {
	id: number;
	title: Translatable;
	isActive?: boolean;
}
