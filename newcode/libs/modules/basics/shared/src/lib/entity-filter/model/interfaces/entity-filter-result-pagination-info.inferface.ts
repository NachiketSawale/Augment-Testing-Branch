/*
 * Copyright(c) RIB Software GmbH
 */

import { InjectionToken } from '@angular/core';

/**
 * Interface of entity filter result pagination info
 */
export interface IEntityFilterResultPaginationInfo {
	PageNumber: number;
	PageSize: number;
	EntitiesFound: number;
	HasMoreEntities?: boolean;
	PageSizeList: number[]
}

/**
 *  Token of pagination info
 */
export const ENTITY_FILTER_RESULT_PAGINATION_INFO = new InjectionToken<IEntityFilterResultPaginationInfo>('ENTITY_FILTER_RESULT_PAGINATION_INFO');