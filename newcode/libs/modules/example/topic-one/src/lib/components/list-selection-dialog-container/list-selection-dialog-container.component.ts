/*
 * Copyright(c) RIB Software GmbH
 */
import { Component, inject } from '@angular/core';
import { FieldType, IListSelectionDialogOptions, UiCommonListSelectionDialogService } from '@libs/ui/common';
import { ContainerBaseComponent } from '@libs/ui/container-system';

interface ITestEntity {
	isTag: boolean;
	Id: number | string;
	description?: string;
	parent?: number | string;
	image?: string;
}

interface ITestEntityWithoutParent {
	Id: number | string;
	description?: string;
}
@Component({
	selector: 'example-topic-one-list-selection-dialog-container',
	templateUrl: './list-selection-dialog-container.component.html',
	styleUrl: './list-selection-dialog-container.component.scss',
})
export class ListSelectionDialogContainerComponent extends ContainerBaseComponent {
	private readonly listSelectionDialogService = inject(UiCommonListSelectionDialogService);

	public async openDialog() {
		const options: IListSelectionDialogOptions<ITestEntity> = {
			width: '60%',
			headerText: 'Select Attribute Tag',
			availableGridConfig: {
				columns: [
					{
						id: 'description',
						model: 'description',
						sortable: false,
						label: {
							key: 'cloud.common.entityDescription',
							text: 'Description',
						},
						type: FieldType.Description,
						width: 200,
						visible: true,
						readonly: true,
					},
				],
				treeConfiguration: {
					children: (entity) => {
						return (
							options.allItems.reduce((result: ITestEntity[], item) => {
								if (entity.Id === item.parent) {
									result.push(item);
								}
								return result;
							}, []) || []
						);
					},
					parent: (entity) => {
						if (entity.parent) {
							return options.allItems.find((item) => item.Id === entity.parent) || null;
						}
						return null;
					},
				},
			},
			selectedGridConfig: {
				columns: [
					{
						id: 'description',
						model: 'description',
						sortable: false,
						label: {
							key: 'cloud.common.entityDescription',
							text: 'Description',
						},
						type: FieldType.Description,
						width: 200,
						visible: true,
						readonly: true,
					},
				],
			},
			allItems: [
				{
					Id: 'C1',
					description: 'System',
					isTag: false,
				},
				{
					Id: 'C2',
					parent: 'C1',
					isTag: false,
					description: 'Formats',
				},
				{
					Id: 2,
					parent: 'C2',
					isTag: true,
					description: 'CPI',
					image: 'control-icons ico-ctrl-label',
				},
				{
					Id: 3,
					description: 'IFC',
					parent: 'C2',
					isTag: true,
					image: 'control-icons ico-ctrl-label',
				},
				{
					Id: 4,
					description: 'Revit',
					parent: 'C2',
					isTag: true,
					image: 'control-icons ico-ctrl-label',
				},
				{
					Id: 'C3',
					parent: 'C1',
					isTag: false,
					description: 'Origin',
				},
				{
					Id: 5,
					parent: 'C3',
					isTag: true,
					description: 'User-Defined',
					image: 'control-icons ico-ctrl-label',
				},
				{
					Id: 6,
					parent: 'C3',
					isTag: true,
					description: 'From Imported Model',
					image: 'control-icons ico-ctrl-label',
				},
				{
					Id: 7,
					parent: 'C3',
					isTag: true,
					description: 'From Public API',
					image: 'control-icons ico-ctrl-label',
				},
				{
					Id: 1,
					parent: 'C1',
					isTag: true,
					description: 'iTWO 4.0 Metadata',
					image: 'control-icons ico-ctrl-label',
				},
				{
					Id: 'c1000005',
					isTag: false,
					description: 'Test A',
				},
				{
					Id: 1000109,
					parent: 'c1000005',
					isTag: true,
					description: 'X',
					image: 'control-icons ico-ctrl-label',
				},
				{
					Id: 1000303,
					parent: 'c1000005',
					isTag: true,
					image: 'control-icons ico-ctrl-label',
				},
				{
					Id: 'c1000007',
					description: 'Test B',
					isTag: false,
				},
			],
			value: [
				{
					Id: 2,
					parent: 'C2',
					isTag: true,
					description: 'CPI',
				},
				{
					Id: 3,
					description: 'IFC',
					parent: 'C2',
					isTag: true,
				},
			],
			isSelectable: (item: ITestEntity) => {
				return item.isTag;
			},
			idProperty: 'Id',
		};

		const data = await this.listSelectionDialogService.show(options);
		console.log(data);
	}

	public async openDialogWithoutTree(){
		const options: IListSelectionDialogOptions<ITestEntityWithoutParent> = {
			width: '60%',
			headerText: 'Select Attribute Tag',
			availableGridConfig: {
				columns: [
					{
						id: 'description',
						model: 'description',
						sortable: false,
						label: {
							key: 'cloud.common.entityDescription',
							text: 'Description',
						},
						type: FieldType.Description,
						width: 200,
						visible: true,
						readonly: true
					},
				],
				idProperty: 'Id'
			},
			selectedGridConfig: {
				columns: [
					{
						id: 'description',
						model: 'description',
						sortable: false,
						label: {
							key: 'cloud.common.entityDescription',
							text: 'Description',
						},
						type: FieldType.Description,
						width: 200,
						visible: true,
						readonly: true
					},
				],
			},
			allItems: [
				{
					Id: 2,
					description: 'CPI',
				},
				{
					Id: 3,
					description: 'IFC',
				},
				{
					Id: 4,
					description: 'Revit',
				},
				{
					Id: 5,
					description: 'User-Defined',
				},
				{
					Id: 6,
					description: 'From Imported Model',
				},
				{
					Id: 7,
					description: 'From Public API',
				},
				{
					Id: 1,
					description: 'iTWO 4.0 Metadata',
				},
				{
					Id: 1000109,
					description: 'X',
				},
				{
					Id: 1000303,
					description: 'Y'
				},
			],
			value: [
				{
					Id: 2,
					description: 'CPI',
				},
				{
					Id: 3,
					description: 'IFC',
				},
			],
			idProperty: 'Id'
		};

		const data = await this.listSelectionDialogService.show(options);
		console.log(data);
	}
}
