import { Component, inject } from '@angular/core';
import { ColumnDef, FieldType, IGridConfiguration } from '@libs/ui/common';
import { IBaselineEntity } from '@libs/scheduling/interfaces';
import { CreateBaselineService } from '../wizards/create-baseline/scheduling-main-create-baseline-wizard.service';

@Component({
	selector: 'scheduling-main-create-baseline-grid-dialog',
	templateUrl: './scheduling-main-create-baseline-grid-dialog.component.html'
})
export class SchedulingMainCreateBaselineGridDialogComponent {

	public createBaselineService: CreateBaselineService = inject(CreateBaselineService);

	public gridConfig: IGridConfiguration<IBaselineEntity> = {
		uuid: 'f6b1110d6e2249a7ba25c8a0d9c27a82',
		items: this.createBaselineService.baselineList,
		columns: [
			{
				id: 'Description',
				model: 'Description',
				label: {text: 'Description', key: 'basics.common.Description'},
				type: FieldType.Description,
				readonly: true,
				visible: true
			},
			{
				id: 'Remarks',
				model: 'Remark',
				type: FieldType.Remark,
				label: {text: 'Remarks', key: 'cloud.common.remark'},
				readonly: true,
				visible: true
			},
			{
				id: 'InsertedAt',
				model: 'InsertedAt',
				type: FieldType.Date,
				label: {text: 'Inserted At', key: 'cloud.common.entityInsertedAt'},
				readonly: true,
				visible: true
			},
			{
				id: 'InsertedBy',
				model: 'InsertedBy',
				type: FieldType.Code,
				label: {text: 'Inserted By', key: 'cloud.common.entityInsertedBy'},
				readonly: true,
				visible: true
			}
		] as ColumnDef<IBaselineEntity>[]
	} as IGridConfiguration<IBaselineEntity>;
}