/*
 * Copyright(c) RIB Software GmbH
 */
import { FieldType, GridStep, IGridConfiguration } from '@libs/ui/common';
import { IBasicsClerkOutUserVEntity } from '@libs/basics/interfaces';

export class CreateClerksFromUsersSelectionStep {
	public readonly title = 'basics.clerk.createClerksFromUsersWizard.selectUsersDescription';
	public readonly id = 'selection';
	public gridConfig: IGridConfiguration<IBasicsClerkOutUserVEntity> = this.createGridConfiguration();
	public step: GridStep<IBasicsClerkOutUserVEntity> = new GridStep(this.id, this.title, this.gridConfig, 'selection');

	public createSelectionGrid(): GridStep<IBasicsClerkOutUserVEntity> {
		return this.step;
	}

	public createGridConfiguration(): IGridConfiguration<IBasicsClerkOutUserVEntity> {
		return {
			uuid: '9fc228d8786d419ca4c795ff7f50f66a',
			items: [],
			columns: [
				{
					id: 'Name',
					model: 'Name',
					type: FieldType.Description,
					readonly: false,
					sortable: false,
					visible: true,
					width: 150,
					label: {
						text: 'Name',
						key: 'usermanagement.user.userName'
					}
				}, {
					id: 'Desc',
					model: 'Description',
					type: FieldType.Description,
					readonly: true,
					sortable: true,
					visible: true,
					width: 150,
					label: {
						text: 'Description',
						key: 'usermanagement.user.userDescription'
					}
				},
				{
					id: 'Logonname',
					model: 'Logonname',
					type: FieldType.Description,
					readonly: true,
					sortable: true,
					visible: true,
					width: 150,
					label: {
						text: 'Logon Name',
						key: 'usermanagement.user.userLogonName'
					}
				},
				{
					id: 'Email',
					model: 'Email',
					type: FieldType.Email,
					readonly: true,
					sortable: true,
					visible: true,
					width: 150,
					label: {
						text: 'E-Mail',
						key: 'usermanagement.user.userEmail'
					}
				},
				{
					id: 'IsIncluded',
					model: 'IsIncluded',
					type: FieldType.Boolean,
					readonly: false,
					sortable: true,
					visible: true,
					width: 150,
					label: {
						text: 'Included',
						key: 'usermanagement.user.isIncluded'
					}
				}
			]
		};
	}
}