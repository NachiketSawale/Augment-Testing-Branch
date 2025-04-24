/*
 * Copyright(c) RIB Software GmbH
 */

import { FieldType, IFormConfig, IFormDialogConfig } from '@libs/ui/common';
import { ImportFileConfig } from './import-from-ms-project-wizard.service';

export class ImportFileDialogConfig {
	public createFormConfiguration(config: ImportFileConfig): IFormDialogConfig<ImportFileConfig> {
		return <IFormDialogConfig<ImportFileConfig>>{
			headerText: 'scheduling.main.importMSProject',
			id: 'ImportMSProject',
			entity: config,
			formConfiguration: <IFormConfig<ImportFileConfig>> {
				showGrouping: false,
				rows: [
					{
						id: 'overwrite',
						model: 'OverWriteSchedule',
						sortOrder: 1,
						label: {key: 'scheduling.main.overWriteSchedule'},
						type: FieldType.Boolean
					},
					{
						id: 'calculateSchedule',
						model: 'CalculateSchedule',
						sortOrder: 2,
						label: {key: 'scheduling.main.calculateSchedule'},
						type: FieldType.Boolean
					}
				]
			}
		};
	}
}