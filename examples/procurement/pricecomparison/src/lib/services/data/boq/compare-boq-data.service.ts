/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { ProcurementPricecomparisonCompareBoqDataBaseService } from './compare-boq-data-base.service';
import { CompareBoqTreeBuilder } from '../../../model/entities/boq/compare-boq-tree-builder.class';
import { CompareBoqColumnBuilder } from '../../../model/entities/boq/compare-boq-column-builder.class';
import { CompareBoqDataCache } from '../../../model/entities/boq/compare-boq-data-cache.class';

@Injectable({
	providedIn: 'root'
})
export class ProcurementPricecomparisonCompareBoqDataService extends ProcurementPricecomparisonCompareBoqDataBaseService {
	protected getTreeBuilder(): CompareBoqTreeBuilder {
		return new CompareBoqTreeBuilder(this);
	}

	protected getColumnBuilder(): CompareBoqColumnBuilder {
		return new CompareBoqColumnBuilder(this);
	}

	protected getDataCache(): CompareBoqDataCache {
		return new CompareBoqDataCache();
	}
}