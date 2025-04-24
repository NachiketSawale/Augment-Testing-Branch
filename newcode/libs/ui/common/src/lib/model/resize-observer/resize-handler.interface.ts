/*
 * Copyright(c) RIB Software GmbH
 */

import { IResizeArgs } from './resize-args.interface';

/**
 * Represents the handler of size changed.
 */
export interface IResizeHandler {
	/**
	 * The callback of element size changed.
	 */
	execute: (args: IResizeArgs) => void;
}