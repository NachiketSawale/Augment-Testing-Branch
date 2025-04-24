/*
 * Copyright(c) RIB Software GmbH
 */

import { ICustomDialogOptions, StandardDialogButtonId } from '@libs/ui/common';
import { SchedulingMainSplitActivityByLocationsDialogComponent } from '../../components/scheduling-main-split-activity-by-locations-dialog.component';
import { LocTableEntry } from './scheduling-main-split-activity-by-locations-wizard.service';

export class SplitActivityByLocationsDialogConfig {
	public createFormConfiguration(): ICustomDialogOptions<LocTableEntry, SchedulingMainSplitActivityByLocationsDialogComponent>{
		return <ICustomDialogOptions<LocTableEntry, SchedulingMainSplitActivityByLocationsDialogComponent>>{
			buttons: [
				{
					id: StandardDialogButtonId.Ok
				},
				{
					id: StandardDialogButtonId.Cancel, caption: {key: 'ui.common.dialog.cancelBtn'}
				}
			],
			headerText: 'scheduling.main.splitActivityByLocations',
			id: 'SplitActivityByLocations',
			bodyComponent: SchedulingMainSplitActivityByLocationsDialogComponent
		};
	}
}