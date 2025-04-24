/*
 * Copyright(c) RIB Software GmbH
 */

import {Type} from '@angular/core';

/**
 * Material item options
 */
export interface IMaterialItemOptions {
	/**
	 * Can material selectable
	 */
	selectable?: boolean;
	/**
	 * If show day work rate
	 */
	showDayworkRate?: boolean;
	/**
	 * item cart in material item
	 */
	itemCartComponent?: Type<unknown>;
	/**
	 * item quantity in material item
	 */
	itemQuantityComponent?: Type<unknown>;
	/**
	 * item delivery options in material item
	 */
	itemDeliveryOptionsComponent?: Type<unknown>;
}