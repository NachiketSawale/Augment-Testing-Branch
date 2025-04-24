/*
 * Copyright(c) RIB Software GmbH
 */

import { FieldType, GridStep, IGridConfiguration } from '@libs/ui/common';
import { CreateProjectAlternativeConfiguration } from './create-project-alternative-configuration';

export class CreateProjectAlternativeScheduleStep{
	public readonly title = 'project.main.data';
	public readonly id = 'scheduleConfiguration';

	public createGrid(): GridStep<CreateProjectAlternativeConfiguration>{
		return new GridStep(this.id,this.title, this.createGridConfiguration(), this.id);
	}
	public createGridConfiguration():IGridConfiguration<CreateProjectAlternativeConfiguration>{

		return {
			uuid: 'ec7759b7303a478bbc8f73ca64640573',
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