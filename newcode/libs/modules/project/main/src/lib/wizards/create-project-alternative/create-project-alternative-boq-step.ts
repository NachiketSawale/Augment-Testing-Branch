/*
 * Copyright(c) RIB Software GmbH
 */

import { FieldType, FormStep, IFormConfig } from '@libs/ui/common';
import { CreateProjectAlternativeConfiguration } from './create-project-alternative-configuration';

export class CreateProjectAlternativeBoqStep{
	public readonly title = 'project.main.data';
	public readonly id = 'boqConfiguration';

	public createForm(): FormStep<CreateProjectAlternativeConfiguration>{
		return new FormStep(this.id,this.title, this.createFormConfiguration(), this.id);
	}
	public createFormConfiguration():IFormConfig<CreateProjectAlternativeConfiguration>{

		return {
			formId: 'boqConfiguration',
			showGrouping: false,
			groups: [
				{
					groupId: 'baseGroup',
					header: {text: ''},
				},
			],
			rows: [
				{
					id: 'copyBoq',
					label: 'project.main.boq',
					type: FieldType.Boolean,
					model: 'CopyBoq',
					sortOrder: 1
				},
				{
					id: 'copyLineItemSelectionStatement',
					label: 'estimate.main.lineItemSelStatement.containerTitle',
					type: FieldType.Boolean,
					model: 'CopyLineItemSelectionStatement',
					sortOrder: 2
				},
				{
					id: 'copyCosInstanceHeaders',
					label: 'estimate.main.instanceHeaderGridContainerTitle',
					type: FieldType.Boolean,
					model: 'CopyCosInstanceHeaders',
					sortOrder: 3
				},
				{
					id: 'copyControllingUnits',
					label: 'estimate.main.controllingContainer',
					type: FieldType.Boolean,
					model: 'CopyControllingUnits',
					sortOrder: 4
				},
				{
					id: 'copyCostGroupCatalogs',
					label: 'basics.costgroups.costgroupcatalog',
					type: FieldType.Boolean,
					model: 'CopyCostGroupCatalogs',
					sortOrder: 5
				},
				{
					id: 'copyProcurementPackage',
					label: 'estimate.main.ProcurementPackage',
					type: FieldType.Boolean,
					model: 'CopyProcurementPackage',
					sortOrder: 6
				},
			]
		};
	}
}