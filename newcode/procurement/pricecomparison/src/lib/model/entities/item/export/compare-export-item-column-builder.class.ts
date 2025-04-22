/*
 * Copyright(c) RIB Software GmbH
 */

import { CompareItemColumnBuilder } from '../compare-item-column-builder.class';
import { CompareGridColumn } from '../../compare-grid-column.interface';
import { ICompositeItemEntity } from '../composite-item-entity.interface';
import { exportRequiredColumns } from '../../../constants/export/export-required-columns';
import { ProcurementPricecomparisonCompareExportItemDataService } from '../../../../services/export/item/compare-export-item-data.service';

export class CompareExportItemColumnBuilder extends CompareItemColumnBuilder {
	public constructor(
		private exportItemDataSvc: ProcurementPricecomparisonCompareExportItemDataService
	) {
		super(exportItemDataSvc);
	}

	protected override buildCustomColumns(columns: CompareGridColumn<ICompositeItemEntity>[]): CompareGridColumn<ICompositeItemEntity>[] {
		const baseColumns = super.buildCustomColumns(columns);
		return this.utilService.buildExportColumns(baseColumns, this.exportItemDataSvc.config.hide.compareFields, this.exportItemDataSvc.config.hide.columns, exportRequiredColumns);
	}
}