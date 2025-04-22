import { Component, inject } from '@angular/core';
import { ControlContextInjectionToken, FieldType, IGridDialogOptions, UiCommonGridDialogService } from '@libs/ui/common';
import { IPrcPackageImportEntity } from '../../model/entities/prc-package-import-entity.interface';
import { IPrcPackageImportDialogEntity } from '../../model/entities/prc-package-import-dialog-entity.interface';

@Component({
	selector: 'procurement-package-import-dialog',
	templateUrl: './package-import-dialog.component.html',
	styleUrls: ['./package-import-dialog.component.scss'],
})
export class ProcurementPackageImportDialogComponent {
	public controlContext = inject(ControlContextInjectionToken);
	private readonly gridDialogService = inject(UiCommonGridDialogService);
	private gridDialogData: IGridDialogOptions<IPrcPackageImportDialogEntity> = {
		width: '50%',
		headerText: 'procurement.package.import.warningMessage',
		windowClass: 'grid-dialog',
		gridConfig: {
			uuid: 'ewx33168c7478883bea20c4f2689dee0',
			columns: [
				{
					id: 'WarningMessage',
					model: 'WarningMessage',
					sortable: true,
					label: {
						text: 'procurement.package.import.warningMessage',
					},
					type: FieldType.Remark,
					width: 400,
				},
			],
		},

		items: this.entity.PrcPackageImportDialogEntity,
		isReadOnly: true,
		allowMultiSelect: false,
		selectedItems: [],
	};
	public async search(): Promise<void> {
		await this.gridDialogService.show(this.gridDialogData);
	}
	public get entity(): IPrcPackageImportEntity {
		return this.controlContext.entityContext.entity as IPrcPackageImportEntity;
	}
}
