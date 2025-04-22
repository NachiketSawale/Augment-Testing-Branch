/*
 * Copyright(c) RIB Software GmbH
 */

import { IGridApi, IGridConfiguration } from '@libs/ui/common';
import { IEntityContainerLink } from './entity-container-link.model';
import { IEntityNavigation } from '@libs/platform/data-access';

/**
 * Provides references to the standard equipment inside a grid container.
 */
export interface IGridContainerLink<T extends object> extends IEntityContainerLink<T> {

	/**
	 * A reference to the grid config.
	 */
	gridConfig: IGridConfiguration<T>;

	/**
	 * The data in the grid
	 */
	gridData: T[] | undefined;

	/**
	 * Grid API
	 */
	readonly grid: IGridApi<T>;

	/**
	 * Provides access to the configuration used to navigate from this entity.
	 */
	readonly entityNavigation?: IEntityNavigation<T>;

	/**
	 * Method to show/hide the column search row in the grid
	 */
	columnSearch(): void;

	/**
	 * Method to show/hide the standard search panel in the grid
	 */
	searchPanel(): void

	/**
	 * Method to show/hide the grouping panel in the grid
	 */
	groupPanel(): void
}