/*
 * Copyright(c) RIB Software GmbH
 */


import { ICustomDialogOptions, StandardDialogButtonId } from '@libs/ui/common';
import { SchedulingMainChangeStatusOfAllActivitiesDialogComponent } from '../../components/scheduling-main-change-status-of-all-activities-dialog.component';
import { IChangeActivityStateEntity } from '@libs/scheduling/interfaces';

export class ChangeStatusOfAllActivitiesDialogConfig {

	public createFormConfiguration(dataItems: IChangeActivityStateEntity[]): ICustomDialogOptions<IChangeActivityStateEntity[], SchedulingMainChangeStatusOfAllActivitiesDialogComponent>{
		return <ICustomDialogOptions<IChangeActivityStateEntity[], SchedulingMainChangeStatusOfAllActivitiesDialogComponent>>{
			buttons: [
				{
					id: StandardDialogButtonId.Ok
				},
				{
					id: StandardDialogButtonId.Cancel, caption: {key: 'ui.common.dialog.cancelBtn'}
				}
			],
			headerText: 'scheduling.main.changeActivityStateOfAllActivities',
			id: 'changeActivityStateOfAllActivities',
			value: dataItems,
			bodyComponent: SchedulingMainChangeStatusOfAllActivitiesDialogComponent
		};
	}
}