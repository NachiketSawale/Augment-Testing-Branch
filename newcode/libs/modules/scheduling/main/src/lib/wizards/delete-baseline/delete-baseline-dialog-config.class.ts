/*
 * Copyright(c) RIB Software GmbH
 */

import { ICustomDialogOptions, StandardDialogButtonId } from '@libs/ui/common';
import { SchedulingMainDeleteBaselineDialogComponent } from '../../components/scheduling-main-delete-baseline-dialog.component';
import { BaselineToDelete } from './scheduling-main-delete-baseline-wizard.service';

export class DeleteBaselineDialogConfig {

	public createFormConfiguration(baselines: BaselineToDelete[]): ICustomDialogOptions<BaselineToDelete[], SchedulingMainDeleteBaselineDialogComponent>{
		return <ICustomDialogOptions<BaselineToDelete[], SchedulingMainDeleteBaselineDialogComponent>>{
			buttons: [
				{
					id: StandardDialogButtonId.Ok
				},
				{
					id: StandardDialogButtonId.Cancel, caption: {key: 'ui.common.dialog.cancelBtn'}
				}
			],
			headerText: 'scheduling.main.deleteBaseline',
			id: 'deleteBaseline',
			value: baselines,
			bodyComponent: SchedulingMainDeleteBaselineDialogComponent
		};
	}
}