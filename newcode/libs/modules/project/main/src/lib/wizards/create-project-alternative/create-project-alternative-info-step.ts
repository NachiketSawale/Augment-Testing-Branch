/*
 * Copyright(c) RIB Software GmbH
 */

import { FieldType, FormStep, IFormConfig } from '@libs/ui/common';
import { CreateProjectAlternativeConfiguration } from './create-project-alternative-configuration';
import { ProjectEntityDialogPropertyHelper } from '../common/project-entity-dialog-property-helper.class';

export class CreateProjectAlternativeInfoStep{
	public readonly title = 'project.main.createAlternativeTitle';
	public readonly id = 'alternativeConfiguration';

	public createForm(): FormStep<CreateProjectAlternativeConfiguration>{
		return new FormStep(this.id,this.title, this.createFormConfiguration(), this.id);
	}
	public createFormConfiguration():IFormConfig<CreateProjectAlternativeConfiguration>{

		return {
			formId: 'alternativeConfiguration',
			showGrouping: false,
			groups: [
				{
					groupId: 'baseGroup',
					header: {text: ''},
				},
			],
			rows: [
				ProjectEntityDialogPropertyHelper.getProjectName(1),
				ProjectEntityDialogPropertyHelper.getProjectName2(2),
				{
					id: 'setNewAlternativeActive',
					label: 'project.main.entitySetActive',
					type: FieldType.Boolean,
					model: 'SetNewAlternativeActive',
					sortOrder: 3
				},
				{
					id: 'VersionDescription',
					label: 'project.main.alternativeDescription',
					model: 'AlternativeDescription',
					type: FieldType.Description,
					sortOrder: 4
				},
				{
					id: 'VersionComment',
					label: 'project.main.alternativeComment',
					model: 'AlternativeComment',
					type: FieldType.Remark,
					sortOrder: 5
				}
			]
		};
	}
}