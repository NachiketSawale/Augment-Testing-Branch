/*
 * Copyright(c) RIB Software GmbH
 */

import {
	IMenuItem,
	ItemType
} from '../../../../index';

/**
 * A toggle menu item.
 *
 * @group Menu List
 */
export interface ICheckMenuItem<TContext = void> extends IMenuItem<TContext> {

	type: ItemType.Check,

	/**
	 * value for check btn
	 */
	value?: boolean;
}
