/**
 * Copyright(c) RIB Software GmbH
 */

import { IGridConfiguration } from '../../../grid';
import { IAdditionalGridFormOptions } from './additional-grid-form-options.interface';

/**
 * Declares additional options that are specific to grid control.
 *
 * @group Fields API
 */
export interface IAdditionalGridOptions extends IAdditionalGridFormOptions  {
	/**
	 * Specifies grid configuration
	 */
	configuration: IGridConfiguration<object>;

	/**
	 * Height of the grid (default 150)
	 */
	height?: number;
}