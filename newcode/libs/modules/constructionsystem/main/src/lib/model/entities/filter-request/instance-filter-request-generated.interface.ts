/*
 * Copyright(c) RIB Software GmbH
 */

import { IPinningContext } from '@libs/platform/common';
import { IFilterStructures } from './instance-filter-structures.interface';
import { ITokenValueFilter } from './instance-token-value-filter.interface';

export interface IInstanceFilterRequestGenerated {
	/**
	 * CustomFurtherFilter
	 */
	CustomFurtherFilter?: ITokenValueFilter[] | null;

	/**
	 * EnhancedFilterDef
	 */
	EnhancedFilterDef?: string | null;

	/**
	 * ExecutionHints
	 */
	ExecutionHints?: boolean | null;

	/**
	 * FurtherFilters
	 */
	FurtherFilters?: number[] | null;

	/**
	 * HasPinningContext
	 */
	HasPinningContext?: boolean;

	/**
	 * IncludeNonActiveItems
	 */
	IncludeNonActiveItems?: boolean | null;

	/**
	 * IncludeResultIds
	 */
	IncludeResultIds?: boolean | null;

	/**
	 * InterfaceVersion
	 */
	InterfaceVersion?: string | null;

	/**
	 * IsEnhancedFilter
	 */
	IsEnhancedFilter?: boolean | null;

	/**
	 * OrderBy
	 */
	OrderBy?: number[] | null;

	/**
	 * PKeys
	 */
	PKeys?: number[] | null;

	/**
	 * PageNumber
	 */
	PageNumber?: number | null;

	/**
	 * PageSize
	 */
	PageSize?: number | null;

	/**
	 * Pattern
	 */
	Pattern?: string | null;

	/**
	 * PinnedEnhancedFilter
	 */
	PinnedEnhancedFilter?: string[] | null;

	/**
	 * PinningContext
	 */
	PinningContext?: IPinningContext[] | null;

	/**
	 * ProjectContextId
	 */
	ProjectContextId?: number | null;

	/**
	 * StructuresFilters
	 */
	StructuresFilters?: IFilterStructures | null;

	/**
	 * UseCurrentClient
	 */
	UseCurrentClient?: boolean | null;

	/**
	 * UseCurrentProfitCenter
	 */
	UseCurrentProfitCenter?: boolean | null;
}
