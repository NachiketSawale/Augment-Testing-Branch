/*
 * Copyright(c) RIB Software GmbH
 */

import { FieldType, IFormConfig, IFormDialogConfig } from '@libs/ui/common';
import { UncompleteActivities } from '../reschedule-uncomplete-activities/scheduling-main-reschedule-uncompleted-activities-wizard.service';

export class RescheduleUncompleteActivitiesDialogConfig {
	public createFormConfiguration(uncompleteActivities: UncompleteActivities): IFormDialogConfig<UncompleteActivities>{
		return <IFormDialogConfig<UncompleteActivities>>{
			headerText: 'scheduling.main.rescheduleUncompleteActivitiesWizardTitle',
			id: 'RescheduleUncompleteActivities',
			entity: uncompleteActivities,
			formConfiguration: <IFormConfig<UncompleteActivities>> {
				showGrouping: false,
				rows: [
					{
						id: 'startDate',
						model: 'StartDate',
						label: {text: 'Start Date', key: 'scheduling.main.startDate'},
						type: FieldType.Date,
						visible: true,
						sortOrder: 1
					},
					{
						id: 'kind',
						model: 'Kind',
						label: {text: 'Kind', key: 'scheduling.main.kind'},
						type: FieldType.Radio,
						itemsSource: {
							items: [
								{
									id: 1,
									displayName: 'Entire Schedule'
								},
								{
									id: 2,
									displayName: 'Selected Activities'
								}
							]
						},
						sortOrder: 2
					},
				]
			}
		};
	}
}