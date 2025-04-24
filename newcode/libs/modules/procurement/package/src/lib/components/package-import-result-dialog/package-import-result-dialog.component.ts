import { Component, inject } from '@angular/core';
import { FieldType, IGridConfiguration } from '@libs/ui/common';
import { IImportPackageResultRow, IMPORT_PACKAGE_RESULT_ROW_TOKEN } from '../../model/entities/import-package-result.interface';

@Component({
	selector: 'procurement-package-import-result-dialog',
	templateUrl: './package-import-result-dialog.component.html',
	styleUrls: ['./package-import-result-dialog.component.scss'],
})
export class ProcurementPackageImportResultDialogComponent {
	public item: IImportPackageResultRow[] = [];
	public gridConfigurationData: IGridConfiguration<IImportPackageResultRow>;
	private readonly importPackageResultRow = inject(IMPORT_PACKAGE_RESULT_ROW_TOKEN);

	public constructor() {
		this.item.push(this.importPackageResultRow);
		this.gridConfigurationData = {
			uuid: 'EF0901BD78454160A581020B97C71CE0',
			columns: [
				{
					id: 'Status',
					model: 'Status',
					sortable: true,
					label: {
						text: 'procurement.common.import.status',
					},
					type: FieldType.Integer,
					width: 100,
				},
				{
					id: 'Error',
					model: 'Error',
					sortable: true,
					label: {
						text: 'procurement.common.import.error',
					},
					type: FieldType.Remark,
					width: 200,
				},
				{
					id: 'Warning',
					model: 'Warning',
					sortable: true,
					label: {
						text: 'procurement.common.import.warning',
					},
					type: FieldType.Remark,
					width: 200,
				},
			],
			skipPermissionCheck: true,
			enableColumnReorder: true,
			enableCopyPasteExcel: false,
			items: [...this.item],
		};
	}
}
