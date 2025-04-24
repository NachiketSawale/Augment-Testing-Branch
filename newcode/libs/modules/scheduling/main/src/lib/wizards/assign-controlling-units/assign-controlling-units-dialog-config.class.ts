/*
 * Copyright(c) RIB Software GmbH
 */

import { FieldType, IFormConfig, IFormDialogConfig } from '@libs/ui/common';
import { IAssignCUDataEntity } from '@libs/scheduling/interfaces';

export class AssignControllingUnitsDialogConfig {
	public createFormConfiguration(controllingUnits: IAssignCUDataEntity): IFormDialogConfig<IAssignCUDataEntity>{
		return <IFormDialogConfig<IAssignCUDataEntity>>{
			headerText: 'scheduling.main.assignCUs',
			id: 'AssignCUs',
			entity: controllingUnits,
			formConfiguration: <IFormConfig<IAssignCUDataEntity>> {
				showGrouping: true,
				groups: [
					{
						groupId: 'baseCU',
						header: {text:'Assign Controlling Units from Template in Activity', key: 'scheduling.main.assignCusByTemplate'},
						open: true,
						visible: true,
						sortOrder: 1,
					},
					{
						groupId: 'baseLI',
						header: {text: 'Assign Controlling Units of Activity to belonging Line Items', key: 'scheduling.main.assignCusToLineItem'},
						open: true,
						visible: true,
						sortOrder: 2
					}
				],
				rows: [
					{
						groupId: 'baseCU',
						id: 'isByTemplate',
						type: FieldType.Boolean,
						model: 'IsByTemplate',
						label: {text:'assign controlling units from template to activity', key: 'scheduling.main.isByTemplate'},
						sortOrder: 1
					},
					{
						groupId: 'baseCU',
						id: 'isOverwriteCuInActivity',
						type: FieldType.Boolean,
						model: 'IsOverwriteCuInActivity',
						label: {text:'overwrite existing controlling unit in activity', key: 'scheduling.main.isOverwriteCuInActivity'},
						sortOrder: 2
					},
					{
						groupId: 'baseLI',
						id: 'isFromActivityToLineItem',
						type: FieldType.Boolean,
						model: 'IsFromActivityToLineItem',
						label: {text:'assign Controlling Unit to line items belonging to activity', key: 'scheduling.main.isFromActivityToLineItem'},
						sortOrder: 1
					},
					{
						groupId: 'baseLI',
						id: 'isOverwriteCuInLineItem',
						type: FieldType.Boolean,
						model: 'IsOverwriteCuInLineItem',
						label: {text:'overwrite existing controlling unit in line item', key: 'scheduling.main.isOverwriteCuInLineItem'},
						sortOrder: 2
					}
				]
			}
		};
	}
}