import { FieldType, IFormConfig, IFormDialogConfig } from '@libs/ui/common';
import { ChangeProjectNumber } from './change-project-number.class';
import { ProjectEntityDialogPropertyHelper } from '../common/project-entity-dialog-property-helper.class';

export class ChangeProjectNumberDialogConfig {
	public createFormConfiguration(project: ChangeProjectNumber):IFormDialogConfig<ChangeProjectNumber>{
		return <IFormDialogConfig<ChangeProjectNumber>> {
			headerText: 'project.main.entityChangeProjectNumber',
			id: 'project.main.ChangeProjectNumber',
			entity: project,
			formConfiguration: <IFormConfig<ChangeProjectNumber>> {
				showGrouping: false,
				groups: [
					{
						groupId: 'baseGroup',
						header: {text: ''},
					},
				],
				rows: [
					ProjectEntityDialogPropertyHelper.getProjectNumber(1, true), {
						id: 'NewNumber',
						label: 'project.main.entityNewNumber',
						model: 'NewNumber',
						type: FieldType.Code,
						sortOrder: 2
					},
					ProjectEntityDialogPropertyHelper.getProjectName(3, true),
					ProjectEntityDialogPropertyHelper.getProjectName2(4, true)
				]
			}
		};
	}
}