/*
 * Copyright(c) RIB Software GmbH
 */

import { FieldType, FormStep, IFormConfig } from '@libs/ui/common';
import { CreateProjectAlternativeConfiguration } from './create-project-alternative-configuration';

export class CreateProjectAlternativeSortCodesStep{
	public readonly title = 'project.structures.sortCodes';
	public readonly id = 'sortCodesConfiguration';

	public createForm(): FormStep<CreateProjectAlternativeConfiguration>{
		return new FormStep(this.id,this.title, this.createFormConfiguration(), this.id);
	}
	public createFormConfiguration():IFormConfig<CreateProjectAlternativeConfiguration>{

		return {
			formId: 'sortCodesConfiguration',
			showGrouping: false,
			groups: [
				{
					groupId: 'baseGroup',
					header: {text: ''},
				},
			],
			rows: [
				{
					id: 'copySortCode01',
					label: 'project.structures.sortCode01',
					type: FieldType.Boolean,
					model: 'CopySortCode01',
					sortOrder: 1
				},
				{
					id: 'copySortCode02',
					label: 'project.structures.sortCode02',
					type: FieldType.Boolean,
					model: 'CopySortCode02',
					sortOrder: 2
				},
				{
					id: 'copySortCode03',
					label: 'project.structures.sortCode03',
					type: FieldType.Boolean,
					model: 'CopySortCode03',
					sortOrder: 3
				},
				{
					id: 'copySortCode04',
					label: 'project.structures.sortCode04',
					type: FieldType.Boolean,
					model: 'CopySortCode04',
					sortOrder: 4
				},
				{
					id: 'copySortCode05',
					label: 'project.structures.sortCode05',
					type: FieldType.Boolean,
					model: 'CopySortCode05',
					sortOrder: 5
				},
				{
					id: 'copySortCode06',
					label: 'project.structures.sortCode06',
					type: FieldType.Boolean,
					model: 'CopySortCode06',
					sortOrder: 6
				},
				{
					id: 'copySortCode07',
					label: 'project.structures.sortCode07',
					type: FieldType.Boolean,
					model: 'CopySortCode07',
					sortOrder: 7
				},
				{
					id: 'copySortCode08',
					label: 'project.structures.sortCode08',
					type: FieldType.Boolean,
					model: 'CopySortCode08',
					sortOrder: 8
				},
				{
					id: 'copySortCode09',
					label: 'project.structures.sortCode09',
					type: FieldType.Boolean,
					model: 'CopySortCode09',
					sortOrder: 9
				},
				{
					id: 'copySortCode10',
					label: 'project.structures.sortCode10',
					type: FieldType.Boolean,
					model: 'CopySortCode10',
					sortOrder: 10
				},
			]
		};
	}
}