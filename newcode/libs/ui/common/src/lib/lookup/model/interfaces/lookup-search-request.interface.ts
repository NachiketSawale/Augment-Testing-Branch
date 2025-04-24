/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IIdentificationData } from '@libs/platform/common';

/**
 * Search request interface
 */
export interface ILookupSearchRequest {
	/**
	 * search text
	 */
	searchText: string;
	/**
	 * entity fields to search
	 */
	searchFields: string[];
	/**
	 * filter key, used in server side to identity different lookup instance
	 */
	filterKey?: string;
	/**
	 * filter string, the LINQ filter string, obsolete, should use filter key instead
	 */
	filterString?: string;
	/**
	 * filter parameters
	 */
	additionalParameters?: unknown;
	/**
	 * Search form entity.
	 */
	formEntity?: unknown;
	/**
	 * tree view filter
	 */
	treeState?: {
		startId?: number;
		depth?: number;
	};
	/**
	 * data page context
	 */
	pageState?: {
		pageNumber: number;
		pageSize: number;
	};
	/**
	 * filter by multiple entity ids
	 */
	requestIds?: IIdentificationData[];
	/**
	 * Require Paging
	 */
	requirePaging?: boolean;
	/**
	 * Ignore permission
	 */
	ignoreParentPermission?: boolean;
	/**
	 * Indicate that backend will do filtering by parameter object rather than filter string
	 */
	filterByParameter?: boolean;
}