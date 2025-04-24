/*
 * Copyright(c) RIB Software GmbH
 */

import { Component, inject } from '@angular/core';
import { FieldType, IGridConfigDialogColumnsData, IGridConfigDialogOptions, UiCommonGridConfigDialogService } from '@libs/ui/common';
import { ContainerBaseComponent } from '@libs/ui/container-system';

interface ITestEntity extends IGridConfigDialogColumnsData {
	Id: number | string;
	//TODO: Any additional column properties like uom, fraction, aggregates.
}

interface IAdditionalColumnsTestEntity extends IGridConfigDialogColumnsData {
	Id: number | string;
	fraction: boolean;
}

@Component({
	selector: 'example-topic-one-grid-config-dialog-container',
	templateUrl: './grid-config-dialog-container.component.html',
	styleUrl: './grid-config-dialog-container.component.scss',
})
export class GridConfigDialogContainerComponent extends ContainerBaseComponent {
	private readonly gridConfigDialogService = inject(UiCommonGridConfigDialogService);

	public async openDialog() {
		const options: IGridConfigDialogOptions<ITestEntity> = {
			width: '80%',
			headerText: 'Grid Layout',
			allItems: [
				{
					Id: 'validto',
					name: 'Valid To',
					width: 100,
					userLabelName: '',
					labelCode: '',
					pinned: false,
					enter: true,
				},
				{
					Id: 'insertedby',
					name: 'Inserted By',
					width: 150,
					userLabelName: '',
					labelCode: '',
					pinned: false,
					enter: true,
				},
				{
					Id: 'clerkfk',
					name: 'Clerk',
					width: 150,
					userLabelName: '',
					labelCode: '',
					pinned: false,
					enter: true,
				},
				{
					Id: 'ClerkDescription_description',
					name: 'Clerk Description',
					width: 140,
					userLabelName: '',
					labelCode: '',
					pinned: false,
					enter: true,
				},
				{
					Id: 'insertedat',
					name: 'Inserted At',
					width: 150,
					userLabelName: '',
					labelCode: '',
					pinned: false,
					enter: true,
				},
				{
					Id: 'updatedat',
					name: 'Updated At',
					width: 150,
					userLabelName: '',
					labelCode: '',
					pinned: false,
					enter: true,
				},
				{
					Id: 'updatedby',
					name: 'Updated By',
					width: 150,
					userLabelName: '',
					labelCode: '',
					pinned: false,
					enter: true,
				},
				{
					Id: 'validfrom',
					name: 'Valid From',
					width: 100,
					userLabelName: '',
					labelCode: '',
					pinned: false,
					enter: true,
				},
			],
			value: [
				{
					Id: 'validto',
					name: 'Valid To',
					width: 100,
					userLabelName: '',
					labelCode: '',
					pinned: false,
					enter: true,
				},
				{
					Id: 'insertedby',
					name: 'Inserted By',
					width: 150,
					userLabelName: '',
					labelCode: '',
					pinned: false,
					enter: true,
				},
				{
					Id: 'clerkfk',
					name: 'Clerk',
					width: 150,
					userLabelName: '',
					labelCode: '',
					pinned: false,
					enter: true,
				},
			],
			idProperty: 'Id',
		};

		const data = await this.gridConfigDialogService.show(options);
		console.log(data);
	}

	public async openDialogWithAdditionalColumns() {
		const options: IGridConfigDialogOptions<IAdditionalColumnsTestEntity> = {
			width: '80%',
			headerText: 'Grid Layout',
			additionalSelectedGridColumns: [
				{
					id: 'fraction',
					model: 'fraction',
					sortable: false,
					label: 'Fraction',
					type: FieldType.Boolean,
					width: 30,
					visible: true,
				},
			],
			allItems: [
				{
					Id: 'validto',
					name: 'Valid To',
					width: 100,
					userLabelName: '',
					labelCode: '',
					pinned: false,
					enter: true,
					fraction: true,
				},
				{
					Id: 'insertedby',
					name: 'Inserted By',
					width: 150,
					userLabelName: '',
					labelCode: '',
					pinned: false,
					enter: true,
					fraction: true,
				},
				{
					Id: 'clerkfk',
					name: 'Clerk',
					width: 150,
					userLabelName: '',
					labelCode: '',
					pinned: false,
					enter: true,
					fraction: true,
				},
				{
					Id: 'ClerkDescription_description',
					name: 'Clerk Description',
					width: 140,
					userLabelName: '',
					labelCode: '',
					pinned: false,
					enter: true,
					fraction: true,
				},
				{
					Id: 'insertedat',
					name: 'Inserted At',
					width: 150,
					userLabelName: '',
					labelCode: '',
					pinned: false,
					enter: true,
					fraction: true,
				},
				{
					Id: 'updatedat',
					name: 'Updated At',
					width: 150,
					userLabelName: '',
					labelCode: '',
					pinned: false,
					enter: true,
					fraction: true,
				},
				{
					Id: 'updatedby',
					name: 'Updated By',
					width: 150,
					userLabelName: '',
					labelCode: '',
					pinned: false,
					enter: true,
					fraction: true,
				},
				{
					Id: 'validfrom',
					name: 'Valid From',
					width: 100,
					userLabelName: '',
					labelCode: '',
					pinned: false,
					enter: true,
					fraction: true,
				},
			],
			value: [
				{
					Id: 'validto',
					name: 'Valid To',
					width: 100,
					userLabelName: '',
					labelCode: '',
					pinned: false,
					enter: true,
					fraction: true,
				},
				{
					Id: 'insertedby',
					name: 'Inserted By',
					width: 150,
					userLabelName: '',
					labelCode: '',
					pinned: false,
					enter: true,
					fraction: true,
				},
				{
					Id: 'clerkfk',
					name: 'Clerk',
					width: 150,
					userLabelName: '',
					labelCode: '',
					pinned: false,
					enter: true,
					fraction: true,
				},
			],
			idProperty: 'Id',
		};

		const data = await this.gridConfigDialogService.show(options);
		console.log(data);
	}

	public async openDialogWithAdditionalColumnsWithReadOnlyEntityFields() {
		const options: IGridConfigDialogOptions<IAdditionalColumnsTestEntity> = {
			width: '80%',
			headerText: 'Grid Layout',
			additionalSelectedGridColumns: [
				{
					id: 'fraction',
					model: 'fraction',
					sortable: false,
					label: 'Fraction',
					type: FieldType.Boolean,
					width: 30,
					visible: true,
				},
			],
			allItems: [
				{
					Id: 'validto',
					name: 'Valid To',
					width: 100,
					userLabelName: '',
					labelCode: '',
					pinned: false,
					enter: true,
					fraction: true,
				},
				{
					Id: 'insertedby',
					name: 'Inserted By',
					width: 150,
					userLabelName: '',
					labelCode: '',
					pinned: false,
					enter: true,
					fraction: true,
				},
				{
					Id: 'clerkfk',
					name: 'Clerk',
					width: 150,
					userLabelName: '',
					labelCode: '',
					pinned: false,
					enter: true,
					fraction: true,
				},
				{
					Id: 'ClerkDescription_description',
					name: 'Clerk Description',
					width: 140,
					userLabelName: '',
					labelCode: '',
					pinned: false,
					enter: true,
					fraction: true,
				},
				{
					Id: 'insertedat',
					name: 'Inserted At',
					width: 150,
					userLabelName: '',
					labelCode: '',
					pinned: false,
					enter: true,
					fraction: true,
				},
				{
					Id: 'updatedat',
					name: 'Updated At',
					width: 150,
					userLabelName: '',
					labelCode: '',
					pinned: false,
					enter: true,
					fraction: true,
				},
				{
					Id: 'updatedby',
					name: 'Updated By',
					width: 150,
					userLabelName: '',
					labelCode: '',
					pinned: false,
					enter: true,
					fraction: true,
				},
				{
					Id: 'validfrom',
					name: 'Valid From',
					width: 100,
					userLabelName: '',
					labelCode: '',
					pinned: false,
					enter: true,
					fraction: true,
				},
			],
			value: [
				{
					Id: 'validto',
					name: 'Valid To',
					width: 100,
					userLabelName: 'demo',
					labelCode: '1000001',
					pinned: false,
					enter: true,
					fraction: true,
					readonly: [
						{
							field: 'fraction',
							readOnly: true
						},
						{
							field: 'userLabelName',
							readOnly: true
						}
					]
				},
				{
					Id: 'insertedby',
					name: 'Inserted By',
					width: 150,
					userLabelName: '',
					labelCode: '',
					pinned: false,
					enter: true,
					fraction: true,
				},
				{
					Id: 'clerkfk',
					name: 'Clerk',
					width: 150,
					userLabelName: '',
					labelCode: '',
					pinned: false,
					enter: true,
					fraction: true,
				},
			],
			idProperty: 'Id',
		};

		const data = await this.gridConfigDialogService.show(options);
		console.log(data);
	}

}
