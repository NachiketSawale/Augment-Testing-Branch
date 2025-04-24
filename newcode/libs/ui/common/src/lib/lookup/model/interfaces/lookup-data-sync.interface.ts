/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

/**
 * Lookup synchronize extension, dealing with synchronize data operations
 * One use case is to support fast input of lookup editor in a grid
 */
export interface ILookupDataSync<TItem> {
	getListSync(): TItem[];
}