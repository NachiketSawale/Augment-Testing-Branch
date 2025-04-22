/*
 * Copyright(c) RIB Software GmbH
 */

import { InjectionToken, ProviderToken } from '@angular/core';
import { ColumnDef, IGridTreeConfiguration } from '@libs/ui/common';
import { IEntityList, IEntitySelection } from '@libs/platform/data-access';

/**
 * The injection token of split grid container config
 */
export const SplitGridConfigurationToken = new InjectionToken<ISplitGridConfiguration<object, object>>('split-grid-config');

/**
 * Split grid container configuration
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export interface ISplitGridConfiguration<T extends object, TP extends object> {
	/**
	 * The parent grid configuration
	 */
	parent: ISplitParentGridConfiguration<TP>;

	/**
	 * The search service token for the split grid container.
	 */
	searchServiceToken?: ProviderToken<ISplitGridContainerSearchService>;
}

/**
 * The interface for parent grid data service of split grid container
 */
export type ISplitGridParentService<T extends object> = IEntitySelection<T> & IEntityList<T>;

/**
 * The parent grid configuration interface
 */
export interface ISplitParentGridConfiguration<T extends object> {
	/**
	 * The parent grid uuid
	 */
	readonly uuid: string;

	/**
	 * The parent grid columns
	 */
	readonly columns: ColumnDef<T>[];

	/**
	 * The provider token of data service for parent grid
	 */
	readonly dataServiceToken?: ProviderToken<ISplitGridParentService<T>>;

	/**
	 * data service instance for parent grid
	 */
	readonly dataService?: ISplitGridParentService<T>;

	/**
	 * Stores configuration options for the tree display of parent grid.
	 */
	readonly treeConfiguration?: IGridTreeConfiguration<T>;
}

/**
 * Interface representing the search service for a split grid container.
 */
export interface ISplitGridContainerSearchService {
	/**
	 * The search text used for filtering the grid.
	 */
	searchText: string;

	/**
	 * Performs a search with the given text.
	 * @param text - The text to search for.
	 */
	search(): Promise<void>;
}
