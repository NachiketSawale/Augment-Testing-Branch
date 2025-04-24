/**
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { ISearchPayload } from '@libs/platform/common';
import { IFilterInfo } from './filter-info.interface';

/**
 * Defines a set of properties related to search operations
 */
export interface ISimpleSearchOption {
	filterInfo: IFilterInfo;
	filterRequest: ISearchPayload;
	showRecordsInfo: boolean;
}
