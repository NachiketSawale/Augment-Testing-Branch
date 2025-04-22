/*
 * Copyright(c) RIB Software GmbH
 */

import { IPinningContext } from '@libs/platform/common';
import { IEntitySelection } from './entity-selection.interface';

/**
 * Provides support for entity navigation.
 */
export interface IEntityNavigation<T extends object> {

	/**
	 * Prepares the context that will be used to load entities once navigation ends.
	 * @returns The context that will be used to load entities once navigation ends.
	 */
	preparePinningContext: (dataService: IEntitySelection<T>) => IPinningContext[];
}