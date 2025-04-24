import { Component, inject } from '@angular/core';
import { FieldType, IGridConfiguration } from '@libs/ui/common';
import { ChangeActivityStateOfAllActivitiesWizardService } from '../wizards/change-status-of-all-activities/change-status-of-all-activities-wizard.service';
import { IChangeActivityStateEntity } from '@libs/scheduling/interfaces';

@Component({
	selector: 'scheduling-main-change-status-of-all-activities-dialog',
	templateUrl: './scheduling-main-change-status-of-all-activities-dialog.component.html'
})

export class SchedulingMainChangeStatusOfAllActivitiesDialogComponent {
	private changeStatusService = inject(ChangeActivityStateOfAllActivitiesWizardService);

	public changeStatusGrid: IGridConfiguration<IChangeActivityStateEntity> = {
		uuid: '5DF0D73A84CF47FA87B6E3388025A414',
		items: this.changeStatusService.dataItems,
		columns: [
			{
				//TODO Show Icons
				model: 'Icon',
				type: FieldType.Image,
				formatterOptions: {
					imageSelector: 'platformStatusIconService'
				},
				id: 'icon',
				label: 'cloud.common.entityIcon',
				width: 30,
				sortable: false,
				readonly: true
			},
			{
				model: 'Description',
				type: FieldType.Description,
				id: 'description',
				label: 'cloud.common.entityDescription',
				sortable: true,
				readonly: true
			},
			{
				model: 'IsAutomatic',
				type: FieldType.Boolean,
				id: 'isautomatic',
				label: 'scheduling.main.isAutomatic',
				width: 50,
				sortable: false,
				//TODO change readonly of a cell in the column
				readonly: false
			},
			{
				model: 'IsStarted',
				type: FieldType.Boolean,
				id: 'isstarted',
				label: 'scheduling.main.isStarted',
				width: 50,
				readonly: true,
				sortable: false
			},
			{
				model: 'IsDelayed',
				type: FieldType.Boolean,
				id: 'isdelayed',
				label: 'scheduling.main.isDelayed',
				width: 50,
				readonly: true,
				sortable: false
			},
			{
				model: 'IsAhead',
				type: FieldType.Boolean,
				id: 'isahead',
				label: 'scheduling.main.isAhead',
				width: 50,
				readonly: true,
				sortable: false
			},
			{
				model: 'IsFinished',
				type: FieldType.Boolean,
				id: 'isfinished',
				label: 'scheduling.main.isFinished',
				width: 50,
				readonly: true,
				sortable: false
			},
			{
				model: 'IsFinishedDelayed',
				type: FieldType.Boolean,
				id: 'isfinisheddelayed',
				label: 'scheduling.main.isFinishedDelayed',
				width: 60,
				readonly: true,
				sortable: false
			}
		]
	};
}
