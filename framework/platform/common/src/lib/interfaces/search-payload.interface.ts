/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */
import { IPinningContext } from './pinning-context.interface';
import { IIdentificationData } from '../model/identification-data.interface';

/**
 * Search Payload for serverside search e.g. /filtered
 */
export interface ISearchPayload {
	executionHints: boolean
	includeNonActiveItems: boolean
	pageNumber: number
	pageSize: number
	pattern: string
	pinningContext: IPinningContext[]
	projectContextId: number | null
	useCurrentClient: boolean
	filter: string
	isReadingDueToRefresh: boolean
	pKeys?: number[] | IIdentificationData[]
	furtherFilters?: { Token: string, Value: number | IIdentificationData | string }[] | null;
}
