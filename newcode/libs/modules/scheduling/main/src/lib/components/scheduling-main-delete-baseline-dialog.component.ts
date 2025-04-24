import { Component, inject } from '@angular/core';
import { BaselineToDelete, DeleteBaselineService } from '../wizards/delete-baseline/scheduling-main-delete-baseline-wizard.service';
import { FieldType, IGridConfiguration } from '@libs/ui/common';

@Component({
	selector: 'scheduling-main-delete-baseline-dialog',
	templateUrl: './scheduling-main-delete-baseline-dialog.component.html'
})

export class SchedulingMainDeleteBaselineDialogComponent {
	public deleteBaselineService: DeleteBaselineService = inject(DeleteBaselineService);

	public baselineGrid: IGridConfiguration<BaselineToDelete> = {
		uuid: 'f6b1110d6e2249a7ba25c8a0d9c27a82',
		items: this.deleteBaselineService.baselineList,
		columns: [
			{
				id: 'Delete',
				model: 'IsToDelete',
				label: {text: 'Delete', key:'cloud.common.delete'},
				type: FieldType.Boolean,
				sortable: true,
				visible: true
			},
			{
				id: 'Description',
				model: 'Baseline.Description',
				type: FieldType.Description,
				label: {text: 'Description', key:'basics.common.Description'},
				sortable: true,
				visible: true
			},
			{
				id: 'Remarks',
				model: 'Baseline.Remark',
				type: FieldType.Remark,
				label: {text: 'Remarks', key:'cloud.common.remark'},
				sortable: true,
				visible: true
			}
		]
	};
}