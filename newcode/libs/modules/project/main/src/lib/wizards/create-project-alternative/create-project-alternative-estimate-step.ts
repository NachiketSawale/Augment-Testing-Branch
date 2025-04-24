/*
 * Copyright(c) RIB Software GmbH
 */

import { FieldType, GridStep, IGridConfiguration } from '@libs/ui/common';
import { CreateProjectAlternativeConfiguration } from './create-project-alternative-configuration';

export class CreateProjectAlternativeEstimateStep{
	public readonly title = 'project.main.data';
	public readonly id = 'estimateConfiguration';

	public createGrid(): GridStep<CreateProjectAlternativeConfiguration>{
		return new GridStep(this.id,this.title, this.createGridConfiguration(), this.id);
	}
	public createGridConfiguration():IGridConfiguration<CreateProjectAlternativeConfiguration>{

		return {
			uuid: '86a9b170898542c8b5e5cbdb2c96e28f',
			items: [],
			columns: [
				{
					id:'CopyEntity',
					model:'copyEntity',
					type: FieldType.Boolean,
					readonly: false,
					sortable: false,
					visible: true,
					width: 150,
					label: {
						text: 'Selected',
						key: 'cloud.desktop.layoutExport.selected'
					}
				},
				{
					id:'Code',
					model:'code',
					type: FieldType.Code,
					readonly: true,
					sortable: true,
					visible: true,
					width: 150,
					label: {
						text: 'Code',
						key: 'cloud.common.entityCode'
					}
				},
				{
					id:'Desc',
					model:'description',
					type: FieldType.Description,
					readonly: true,
					sortable: true,
					visible: true,
					width: 150,
					label: {
						text: 'Description',
						key: 'cloud.common.entityDescription'
					}
				},
				{
					id:'IsLive',
					model:'isLive',
					type: FieldType.Boolean,
					readonly: true,
					sortable: true,
					visible: true,
					width: 150,
					label: {
						text: 'IsLive',
						key: 'cloud.common.entityIsLive'
					}
				}
			]
		};
	}
}