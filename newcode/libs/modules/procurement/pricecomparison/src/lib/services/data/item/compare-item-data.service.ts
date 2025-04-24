/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { ProcurementPricecomparisonCompareItemDataBaseService } from './compare-item-data-base.service';
import { CompareItemTreeBuilder } from '../../../model/entities/item/compare-item-tree-builder.class';
import { CompareItemColumnBuilder } from '../../../model/entities/item/compare-item-column-builder.class';
import { CompareItemDataCache } from '../../../model/entities/item/compare-item-data-cache.class';

@Injectable({
	providedIn: 'root'
})
export class ProcurementPricecomparisonCompareItemDataService extends ProcurementPricecomparisonCompareItemDataBaseService {


	protected getTreeBuilder(): CompareItemTreeBuilder {
		return new CompareItemTreeBuilder(this);
	}

	protected getColumnBuilder(): CompareItemColumnBuilder {
		return new CompareItemColumnBuilder(this);
	}

	protected getDataCache(): CompareItemDataCache {
		return new CompareItemDataCache();
	}
}