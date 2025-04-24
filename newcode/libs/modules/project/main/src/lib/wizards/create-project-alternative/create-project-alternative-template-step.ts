/*
 * Copyright(c) RIB Software GmbH
 */

import { FieldType, FormStep, IFormConfig } from '@libs/ui/common';
import { CreateProjectAlternativeConfiguration } from './create-project-alternative-configuration';

export class CreateProjectAlternativeTemplateStep{
	public readonly title = 'project.main.projectTemplate';
	public readonly id = 'projectTemplateConfiguration';

	public createForm(): FormStep<CreateProjectAlternativeConfiguration>{
		return new FormStep(this.id,this.title, this.createFormConfiguration(), this.id);
	}
	public createFormConfiguration():IFormConfig<CreateProjectAlternativeConfiguration>{

		return {
			formId: 'projectTemplateConfiguration',
			showGrouping: false,
			groups: [
				{
					groupId: 'baseGroup',
					header: {text: ''},
				},
			],
			rows: [
				{
					id: 'ProjectName',
					label: 'cloud.common.entityName',
					model: 'ProjectName',
					type: FieldType.Description,
					sortOrder: 1
				},
				{
					id:'CopyProjectFromTemplate',
					label: 'project.main.projectTemplateToCopyFlag',
					model: 'copyProjectFromTemplate',
					type: FieldType.Boolean,
					sortOrder: 2
				},
				/*
				{
					id: 'ProjectTemplateFk',
					label: 'project.main.projectTemplateFk',
					type: FieldType.Lookup,
					lookupOptions:{

					},
					model: 'projectTemplateFk',
					sortOrder: 3
				}
				 */
			]
		};
	}
}