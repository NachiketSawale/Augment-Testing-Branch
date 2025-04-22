/*
 * Copyright(c) RIB Software GmbH
 */

import { IFileSelectControlResult } from '@libs/platform/common';
import {
	IMenuItem,
	ItemType
} from '../../../../index';
import { IFileSelectOptions } from '../../fields/additional/file-select-options.interface';

/**
 *	A file select menu item
 * @group Menu List
 */
export interface IFileSelectMenuItem<TContext> extends IMenuItem<TContext> {

	type: ItemType.FileSelect,

	/**
	 * uploaded value
	 */
	value?: IFileSelectControlResult | IFileSelectControlResult[];

	/**
	 * Configurable options for file select menu item
	 */
	options?: IFileSelectOptions;
}