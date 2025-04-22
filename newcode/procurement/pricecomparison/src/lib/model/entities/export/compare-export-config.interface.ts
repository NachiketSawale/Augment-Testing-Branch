/*
 * Copyright(c) RIB Software GmbH
 */

import { ICompareRowEntity } from '../compare-row-entity.interface';

export interface ICompareExportConfig {
	required: {
		quoteFields: string[],
		compareFields: string[],
		additionalFields: ICompareRowEntity[],
	},
	hide: {
		quoteFields: string[],
		compareFields: string[],
		columns: string[]
	},
	formula: {
		excludeRows: string[],
		excludeColumns: string[]
	}
}