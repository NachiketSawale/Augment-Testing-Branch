/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */


import { ISearchPayload } from './search-payload.interface';


/**
 * Search Result for serverside search e.g. /filtered
 */
export interface ISearchAccess {
	currentSearchPayload(): ISearchPayload
}
