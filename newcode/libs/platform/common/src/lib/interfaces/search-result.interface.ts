/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */
import { IFilterResult } from './filter-result.interface';

/**
 * Search Result for serverside search e.g. /filtered
 */
export interface ISearchResult<TDto> {
	FilterResult: IFilterResult
	dtos: TDto[]
}
