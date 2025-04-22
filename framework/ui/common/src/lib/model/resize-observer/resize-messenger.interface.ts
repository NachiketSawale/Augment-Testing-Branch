/*
 * Copyright(c) RIB Software GmbH
 */

import { IResizeArgs } from './resize-args.interface';

/**
 * Represents a message manager of the size changed.
 */
export interface IResizeMessenger {
	/**
	 * Register the handler of size changed.
	 * @param handler
	 */
	register(handler: (args: IResizeArgs) => void): void;

	/**
	 * Unregister the handler of size changed.
	 * @param handler
	 */
	unregister(handler: (args: IResizeArgs) => void): void;
}