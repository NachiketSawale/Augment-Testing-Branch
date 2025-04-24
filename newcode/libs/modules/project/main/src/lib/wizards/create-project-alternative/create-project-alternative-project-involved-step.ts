/*
 * Copyright(c) RIB Software GmbH
 */

import { FieldType, FormStep, IFormConfig } from '@libs/ui/common';
import { CreateProjectAlternativeConfiguration } from './create-project-alternative-configuration';

export class CreateProjectAlternativeProjectInvolvedStep{
	public readonly title = 'project.main.projectInvolved';
	public readonly id = 'involvedConfiguration';

	public createForm(): FormStep<CreateProjectAlternativeConfiguration>{
		return new FormStep(this.id,this.title, this.createFormConfiguration(), this.id);
	}
	public createFormConfiguration():IFormConfig<CreateProjectAlternativeConfiguration>{

		return {
			formId: 'involvedConfiguration',
			showGrouping: false,
			groups: [
				{
					groupId: 'baseGroup',
					header: {text: ''},
				},
			],
			rows: [
				{
					id: 'copyBusinessPartner',
					label: 'project.main.entityBusinessPartner',
					type: FieldType.Boolean,
					model: 'CopyBusinessPartner',
					sortOrder: 1
				},
				{
					id: 'copyCharacteristics',
					label: 'basics.characteristic.title.characteristics',
					type: FieldType.Boolean,
					model: 'CopyCharacteristics',
					sortOrder: 2
				},
				{
					id: 'copyLocations',
					label: 'project.location.listContainerTitle',
					type: FieldType.Boolean,
					model: 'CopyLocations',
					sortOrder: 3
				},
				{
					id: 'copyDocuments',
					label: 'documents.project.title.headerTitle',
					type: FieldType.Boolean,
					model: 'CopyDocuments',
					sortOrder: 4
				},
				{
					id: 'copyExchangeRates',
					label: 'basics.currency.ExchangeRates',
					type: FieldType.Boolean,
					model: 'CopyExchangeRates',
					sortOrder: 5
				},
				{
					id: 'copySales',
					label: 'project.main.listSaleTitle',
					type: FieldType.Boolean,
					model: 'CopySales',
					sortOrder: 6
				},
				{
					id: 'copyTenderResults',
					label: 'project.main.entityTenderResultList',
					type: FieldType.Boolean,
					model: 'CopyTenderResults',
					sortOrder: 7
				},
				{
					id: 'copyClerkRights',
					label: 'basics.clerk.listClerkAuthTitle',
					type: FieldType.Boolean,
					model: 'CopyClerkRights',
					sortOrder: 8
				},
				{
					id: 'copyGenerals',
					label: 'project.main.entityGeneralList',
					type: FieldType.Boolean,
					model: 'CopyGenerals',
					sortOrder: 9
				},
				{
					id: 'copyKeyFigures',
					label: 'project.main.entityKeyFigureList',
					type: FieldType.Boolean,
					model: 'CopyKeyFigures',
					sortOrder: 10
				},
			]
		};
	}
}