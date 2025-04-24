/*
 * Copyright(c) RIB Software GmbH
 */
import { FieldType, GridStep, IGridConfiguration } from '@libs/ui/common';
import { IBasicsClerkEntity } from '@libs/basics/interfaces';


export class CreateClerkFromUsersResultStep {
	public readonly title = 'basics.clerk.createClerksFromUsersWizard.resultClerkDescription';
	public readonly id = 'result';
	public gridConfig: IGridConfiguration<IBasicsClerkEntity> = this.createResultGridConfiguration();
	public step = new GridStep(this.id,this.title, this.gridConfig, 'result');

	public createResultGrid(): GridStep<IBasicsClerkEntity>{
		return this.step;
	}
	public createResultGridConfiguration(): IGridConfiguration<IBasicsClerkEntity>{

		// TODO: clone listView (may should make the clerk layout config object as a dynamic layout)
		return {
			uuid: '9fc228d8786d419ca4c795ff7f50f66a',
			items: [],
			columns: [
				{
					id:'FamilyName',
					model:'FamilyName',
					type: FieldType.Description,
					readonly: false,
					sortable: false,
					visible: true,
					width: 150,
					label: {
						text: 'Family Name',
						key: 'basics.clerk.entityFamilyName'
					}
				}, {
					id:'Desc',
					model:'Description',
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
					id:'FirstName',
					model:'FirstName',
					type: FieldType.Description,
					readonly: true,
					sortable: true,
					visible: true,
					width: 150,
					label: {
						text: 'First Name',
						key: 'basics.clerk.entityFirstName'
					}
				},
			]
		};
	}

}