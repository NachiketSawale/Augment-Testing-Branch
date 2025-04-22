/*
 * Copyright(c) RIB Software GmbH
 */

import { IResizeHandler } from './resize-handler.interface';

/**
 * Represents the options of size observer.
 */
export interface IResizeOptions extends ResizeObserverOptions {
	/**
	 * Time to wait for the size to stabilize(milliseconds).
	 */
	debounce?: number;

	/**
	 * The handler of size changed.
	 */
	handler: IResizeHandler;
}