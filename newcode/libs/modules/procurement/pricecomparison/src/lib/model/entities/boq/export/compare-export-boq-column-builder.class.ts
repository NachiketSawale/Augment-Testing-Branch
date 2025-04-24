/*
 * Copyright(c) RIB Software GmbH
 */

import { CompareBoqColumnBuilder } from '../compare-boq-column-builder.class';
import { ProcurementPricecomparisonCompareExportBoqDataService } from '../../../../services/export/boq/compare-export-boq-data.service';
import { CompareGridColumn } from '../../compare-grid-column.interface';
import { ICompositeBoqEntity } from '../composite-boq-entity.interface';
import { exportRequiredColumns } from '../../../constants/export/export-required-columns';

export class CompareExportBoqColumnBuilder extends CompareBoqColumnBuilder {
	public constructor(
		private exportBoqDataSvc: ProcurementPricecomparisonCompareExportBoqDataService
	) {
		super(exportBoqDataSvc);
	}

	protected override buildCustomColumns(columns: CompareGridColumn<ICompositeBoqEntity>[]): CompareGridColumn<ICompositeBoqEntity>[] {
		const baseColumns = super.buildCustomColumns(columns);
		return this.utilService.buildExportColumns(baseColumns, this.exportBoqDataSvc.config.hide.compareFields, this.exportBoqDataSvc.config.hide.columns, exportRequiredColumns);
	}
}