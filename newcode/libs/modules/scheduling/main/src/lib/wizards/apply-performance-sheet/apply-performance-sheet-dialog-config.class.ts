/*
 * Copyright(c) RIB Software GmbH
 */

import { FieldType, IFormConfig, IFormDialogConfig } from '@libs/ui/common';
import { IPerformanceSheetEntity } from '@libs/scheduling/interfaces';

export class ApplyPerformanceSheetDialogConfig {
	public createFormConfiguration(performanceSheet: IPerformanceSheetEntity): IFormDialogConfig<IPerformanceSheetEntity> {
		return <IFormDialogConfig<IPerformanceSheetEntity>>{
			headerText: 'scheduling.main.applyPerformanceSheet',
			id: 'ApplyPerformanceSheet',
			entity: performanceSheet,
			formConfiguration: <IFormConfig<IPerformanceSheetEntity>> {
				showGrouping: false,
				rows: [
					{
						id: 'notstarted',
						label: {text: 'Not Started', key: 'scheduling.main.notStarted'},
						type: FieldType.Boolean,
						model: 'NotStarted',
						visible: true,
						readonly: false,
						sortOrder: 1
					},
					{
						id: 'started',
						label: {text: 'started', key: 'scheduling.main.started'},
						type: FieldType.Boolean,
						model: 'Started',
						visible: true,
						readonly: false,
						sortOrder: 2
					},
					{
						id: 'finishedactivities',
						label: {text: 'Finished Activities', key: 'scheduling.main.finishedActivities'},
						type: FieldType.Boolean,
						model: 'FinishedActivities',
						visible: true,
						readonly: false,
						sortOrder: 3
					}
				]
			}
		};
	}
}