/*
 * Copyright(c) RIB Software GmbH
 */

import { IResizeSize } from './resize-size.interface';

/**
 * Represents the context of the size changed.
 */
export interface IResizeArgs {
	/**
	 * The last observed size.
	 */
	oldValue: IResizeSize;
	/**
	 * The current observed size.
	 */
	newValue: IResizeSize;
}