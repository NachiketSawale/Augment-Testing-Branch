/*
 * Copyright(c) RIB Software GmbH
 */

import { Component, inject } from '@angular/core';
import { FieldType, UiCommonGridDialogService, IGridDialog, IGridDialogOptions, IMenuItemEventInfo, ItemType } from '@libs/ui/common';
import { ContainerBaseComponent } from '@libs/ui/container-system';

export interface IGridDialogDataEntity {
	Id: number;
	Code: string;
	isPresent: boolean;
	name?: string;
	age?: number;
	location?: string;
	designation?: string;
}

interface ITestEntity {
	Id: number;
	projectNumber: string;
	description?: string;
	testDateTime: Date;
	testDate: Date;
	testTime: Date;
	isGood?: boolean;
	money?: number;
	myOtherText?: string;
	myText1?: string;
	mode?: number;
	color?: number;
	age?: number;
	url?: string;
	password: string;
	parent?: number;
	descriptionInfo?: {
		description: string;
	};
	dummy?: string;
	subsidiaryFK: number;
}
@Component({
	selector: 'example-topic-one-grid-dialog-container',
	templateUrl: './grid-dialog-container.component.html',
	styleUrls: ['./grid-dialog-container.component.scss'],
})
export class GridDialogContainerComponent extends ContainerBaseComponent {
	private readonly gridDialogService = inject(UiCommonGridDialogService);

	public async openGridDialog() {
		const gridDialogData: IGridDialogOptions<IGridDialogDataEntity> = {
			width: '70%',
			headerText: 'Grid Dialog',
			topDescription: 'This is top description',
			windowClass: 'grid-dialog',
			tools: {
				cssClass: 'tools',
				showImages: true,
				showTitles: false,
				isVisible: true,
				activeValue: '',
				overflow: false,
				iconClass: '',
				layoutChangeable: false,
				items: [
					{
						id: 'z1',
						sort: 10,
						type: ItemType.Item,
						caption: 'platform.wysiwygEditor.settings.toolAddRecord',
						iconClass: 'tlb-icons ico-rec-new',
						fn: (info: IMenuItemEventInfo<IGridDialog<IGridDialogDataEntity>>) => {
							console.log(info);
							console.log('add records');
						},
					},
					{
						id: 'z2',
						sort: 20,
						caption: 'platform.wysiwygEditor.settings.toolDeleteRecord',
						iconClass: 'tlb-icons ico-rec-delete',
						type: ItemType.Item,
						fn: (info: IMenuItemEventInfo<IGridDialog<IGridDialogDataEntity>>) => {
							console.log(info);
							console.log('delete records');
						},
					},
				],
			},
			gridConfig: {
				uuid: 'dfdd06a581624d11ab1e6aa1103e76e2',
				columns: [
					{
						type: FieldType.Integer,
						id: 'Id',
						required: true,
						model: 'Id',
						label: {
							text: 'Id',
							key: 'Id',
						},
						visible: true,
						sortable: true,
					},
					{
						type: FieldType.Code,
						id: 'Code',
						required: true,
						model: 'Code',
						maxLength: 16,
						label: {
							text: 'Code',
							key: 'Code',
						},
						visible: true,
						sortable: true,
					},
					{
						type: FieldType.Translation,
						id: 'DescriptionInfo',
						required: false,
						model: 'isPresent',
						label: {
							text: 'Description',
							key: 'Description',
						},
						visible: true,
						sortable: true,
					},
					{
						type: FieldType.Code,
						id: 'name',
						required: false,
						model: 'name',
						label: {
							text: 'Name',
							key: 'Name',
						},
						visible: true,
						sortable: true,
					},
					{
						type: FieldType.Integer,
						id: 'age',
						required: false,
						model: 'age',
						label: {
							text: 'Age',
							key: 'Age',
						},
						visible: true,
						sortable: true,
					},
					{
						type: FieldType.Code,
						id: 'location',
						required: false,
						model: 'location',
						label: {
							text: 'Location',
							key: 'Location',
						},
						visible: true,
						sortable: true,
					},
					{
						type: FieldType.Code,
						id: 'designation',
						required: false,
						model: 'designation',
						label: {
							text: 'Designation',
							key: 'Designation',
						},
						visible: true,
						sortable: true,
					},
				],
				idProperty: 'Id',
			},
			items: [
				{
					Id: 1000006,
					Code: 'EQ-0030',
					isPresent: true,
					name: 'john',
					age: 23,
					designation: 'SE',
					location: 'GE',
				},
				{
					Id: 1000009,
					Code: 'EQ-0031',
					isPresent: true,
					name: 'john',
					age: 23,
					designation: 'SE',
					location: 'GE',
				},
				{
					Id: 1000010,
					Code: 'EQ-0032',
					isPresent: true,
					name: 'john',
					age: 23,
					designation: 'SE',
					location: 'GE',
				},
				{
					Id: 10000101,
					Code: 'EQ-0032',
					isPresent: true,
					name: 'john',
					age: 23,
					designation: 'SE',
					location: 'GE',
				},
				{
					Id: 10000102,
					Code: 'EQ-0032',
					isPresent: true,
					name: 'john',
					age: 23,
					designation: 'SE',
					location: 'GE',
				},
				{
					Id: 10000103,
					Code: 'EQ-0032',
					isPresent: true,
					name: 'john',
					age: 23,
					designation: 'SE',
					location: 'GE',
				},
				{
					Id: 10000104,
					Code: 'EQ-0032',
					isPresent: true,
					name: 'john',
					age: 23,
					designation: 'SE',
					location: 'GE',
				},
				{
					Id: 10000105,
					Code: 'EQ-0032',
					isPresent: true,
					name: 'john',
					age: 23,
					designation: 'SE',
					location: 'GE',
				},
				{
					Id: 10000106,
					Code: 'EQ-0032',
					isPresent: true,
					name: 'john',
					age: 23,
					designation: 'SE',
					location: 'GE',
				},
				{
					Id: 10000107,
					Code: 'EQ-0032',
					isPresent: true,
					name: 'john',
					age: 23,
					designation: 'SE',
					location: 'GE',
				},
				{
					Id: 10000108,
					Code: 'EQ-0032',
					isPresent: true,
					name: 'john',
					age: 23,
					designation: 'SE',
					location: 'GE',
				},
			],
			isReadOnly: false,
			allowMultiSelect: true,
			selectedItems: []
		};

		const result = await this.gridDialogService.show(gridDialogData);

		console.log(result);
	}

	public async openGridDialogWithTree() {
		const gridDialogData: IGridDialogOptions<ITestEntity> = {
			width: '70%',
			headerText: 'Grid Dialog',
			topDescription: 'This is top description',
			windowClass: 'grid-dialog',
			title: 'cloud.desktop.formConfigDialogSubTitle',
			tools: {
				cssClass: 'tools',
				showImages: true,
				showTitles: false,
				isVisible: true,
				activeValue: '',
				overflow: false,
				iconClass: '',
				layoutChangeable: false,
				items: [
					{
						id: 'z1',
						sort: 10,
						type: ItemType.Item,
						caption: 'platform.wysiwygEditor.settings.toolAddRecord',
						iconClass: 'tlb-icons ico-rec-new',
						fn: (info: IMenuItemEventInfo<IGridDialog<ITestEntity>>) => {
							console.log(info);
							console.log('add records');
						},
					},
					{
						id: 'z2',
						sort: 20,
						caption: 'platform.wysiwygEditor.settings.toolDeleteRecord',
						iconClass: 'tlb-icons ico-rec-delete',
						type: ItemType.Item,
						fn: (info: IMenuItemEventInfo<IGridDialog<ITestEntity>>) => {
							console.log(info);
							console.log('delete records');
						},
					},
				],
			},
			gridConfig: {
				uuid: 'dfdd06a581624d11ab1e6aa1103e76e2',
				columns: [
					{
						id: 'projectNumber',
						model: 'projectNumber',
						sortable: true,
						label: {
							text: 'Project Number',
						},
						type: FieldType.Description,
						required: true,
						maxLength: 16,
						searchable: true,
						tooltip: {
							text: 'Project Number',
						},
						cssClass: '',
						width: 100,
						visible: true,
						keyboard: {
							enter: true,
							tab: true,
						},
						pinned: false,
					},
					{
						id: 'password',
						model: 'password',
						sortable: true,
						label: {
							text: 'Password',
						},
						type: FieldType.Password,
						required: true,
						maxLength: 16,
						searchable: true,
						tooltip: {
							text: 'Password',
						},
						cssClass: '',
						width: 100,
						visible: true,
						keyboard: {
							enter: true,
							tab: true,
						},
						pinned: false,
					},
					{
						id: 'url',
						model: 'url',
						sortable: true,
						label: {
							text: 'Url',
						},
						type: FieldType.Url,
						required: true,
						searchable: true,
						tooltip: {
							text: 'Url',
						},
						cssClass: '',
						width: 200,
						visible: true,
						keyboard: {
							enter: true,
							tab: true,
						},
						pinned: false,
					},
					{
						id: 'testdate',
						model: 'testDate',
						sortable: true,
						label: {
							text: 'Test Date',
						},
						type: FieldType.Date,
						required: true,
						searchable: true,
						tooltip: {
							text: 'Test Date',
						},
						cssClass: '',
						width: 100,
						visible: true,
						keyboard: {
							enter: true,
							tab: true,
						},
						pinned: false,
					},
					{
						id: 'testTime',
						model: 'testTime',
						sortable: true,
						label: {
							text: 'Test Time',
						},                                                                                  
						type: FieldType.Time,
						required: true,
						searchable: true,
						tooltip: {
							text: 'Test Time',
						},
						cssClass: '',
						width: 100,
						visible: true,
						keyboard: {
							enter: true,
							tab: true,
						},
						pinned: false,
						options: {
							format: 'HH:mm'
						}
					},
					{
						id: 'testDateTime',
						model: 'testDateTime',
						sortable: true,
						label: {
							text: 'Test Date Time',
						},
						type: FieldType.DateTime,
						required: true,
						searchable: true,
						tooltip: {
							text: 'Test Date Time',
						},
						cssClass: '',
						width: 120,
						visible: true,
						keyboard: {
							enter: true,
							tab: true,
						},
						pinned: false,
					},
					{
						id: 'money',
						model: 'money',
						sortable: true,
						label: {
							text: 'Money',
						},
						type: FieldType.Money,
						searchable: true,
						tooltip: {
							text: 'Money',
						},
						cssClass: '',
						width: 100,
						visible: true,
						keyboard: {
							enter: true,
							tab: true,
						},
						pinned: false,
					},
					{
						id: 'color',
						model: 'color',
						sortable: true,
						label: {
							text: 'Color',
						},
						type: FieldType.Color,
						searchable: true,
						tooltip: {
							text: 'Color',
						},
						cssClass: '',
						width: 100,
						visible: true,
						keyboard: {
							enter: true,
							tab: true,
						},
						pinned: false,
					},
					{
						id: 'isgood',
						model: 'isGood',
						sortable: true,
						label: {
							text: 'Is Good',
						},
						type: FieldType.Boolean,
						required: true,
						searchable: true,
						tooltip: {
							text: 'Is Good',
						},
						cssClass: '',
						width: 100,
						visible: true,
						keyboard: {
							enter: true,
							tab: true,
						},
						pinned: false,
					},
				],
				treeConfiguration: {
					description: ['descriptionInfo.description', 'description', 'projectNumber'],
					rootEntities: () => {
						return (
							gridDialogData.items?.reduce((result: ITestEntity[], entity) => {
								if (!entity.parent) {
									result.push(entity);
								}
								return result;
							}, []) || []
						);
					},
					children: (entity) => {
						return (
							gridDialogData.items?.reduce((result: ITestEntity[], item) => {
								if (entity.Id === item.parent) {
									result.push(item);
								}
								return result;
							}, []) || []
						);
					},
					parent: (entity) => {
						if (entity.parent) {
							return gridDialogData.items?.find((item) => item.Id === entity.parent) || null;
						}
						return null;
					},
				},
				idProperty: 'Id',
			},
			items: [
				{
					Id: 1,
					projectNumber: '123',
					description: 'Project 1:',
					money: 10.24,
					color: 3378638,
					testDateTime: new Date(Date.now() - Math.random() * 1e12),
					testDate: new Date(Date.now() - Math.random() * 1e12),
					testTime: new Date(Date.now() - Math.random() * 1e12),
					password: 'kjadhaksjdha',
					url: 'https://www.google.com',
					subsidiaryFK: 1000777,
				},
				{
					Id: 2,
					description: 'Project 2:',
					projectNumber: '456',
					money: 231.324235,
					isGood: true,
					color: 16777215,
					testDateTime: new Date(Date.now() - Math.random() * 1e12),
					testDate: new Date(Date.now() - Math.random() * 1e12),
					testTime: new Date(Date.now() - Math.random() * 1e12),
					password: 'kjadhaksjdha',
					url: 'https://www.hotmail.com',
					parent: 1,
					subsidiaryFK: 1000777,
				},
				{
					Id: 3,
					description: 'Project 3:',
					projectNumber: '789',
					money: 63.251,
					isGood: true,
					color: 16777215,
					password: 'kjadhaksjdha',
					testDateTime: new Date(Date.now() - Math.random() * 1e12),
					testDate: new Date(Date.now() - Math.random() * 1e12),
					testTime: new Date(Date.now() - Math.random() * 1e12),
					parent: 1,
					subsidiaryFK: 1000777,
				},
				{
					Id: 4,
					projectNumber: '012',
					money: 2.501,
					isGood: false,
					color: 3378638,
					testDateTime: new Date(Date.now() - Math.random() * 1e12),
					testDate: new Date(Date.now() - Math.random() * 1e12),
					testTime: new Date(Date.now() - Math.random() * 1e12),
					password: 'kjadhaksjdha',
					url: 'https://www.cnn.com',
					descriptionInfo: {
						description: 'Project 4:',
					},
					subsidiaryFK: 1000777,
				},
				{
					Id: 5,
					projectNumber: '345',
					money: 626.0,
					isGood: true,
					color: 3378638,
					password: 'kjadhaksjdha',
					testDateTime: new Date(Date.now() - Math.random() * 1e12),
					testDate: new Date(Date.now() - Math.random() * 1e12),
					testTime: new Date(Date.now() - Math.random() * 1e12),
					parent: 4,
					descriptionInfo: {
						description: 'Project 5:',
					},
					subsidiaryFK: 1000777,
				},
				{
					Id: 6,
					projectNumber: '678',
					money: 6.34,
					isGood: true,
					color: 3684408,
					password: 'kjadhaksjdha',
					testDateTime: new Date(Date.now() - Math.random() * 1e12),
					testDate: new Date(Date.now() - Math.random() * 1e12),
					testTime: new Date(Date.now() - Math.random() * 1e12),
					parent: 5,
					subsidiaryFK: 1000777,
				},
				{
					Id: 7,
					projectNumber: '901',
					money: 664.362,
					isGood: true,
					password: 'kjadhaksjdha',
					testDateTime: new Date(Date.now() - Math.random() * 1e12),
					testDate: new Date(Date.now() - Math.random() * 1e12),
					testTime: new Date(Date.now() - Math.random() * 1e12),
					subsidiaryFK: 1000777,
				},
				{
					Id: 8,
					projectNumber: '234',
					money: 1.2345,
					isGood: true,
					color: 3684408,
					password: 'kjadhaksjdha',
					testDateTime: new Date(Date.now() - Math.random() * 1e12),
					testDate: new Date(Date.now() - Math.random() * 1e12),
					testTime: new Date(Date.now() - Math.random() * 1e12),
					parent: 7,
					subsidiaryFK: 1000777,
				},
				{
					Id: 9,
					projectNumber: '567',
					money: 34324.62,
					isGood: true,
					color: 3378638,
					password: 'kjadhaksjdha',
					testDateTime: new Date(Date.now() - Math.random() * 1e12),
					testDate: new Date(Date.now() - Math.random() * 1e12),
					testTime: new Date(Date.now() - Math.random() * 1e12),
					parent: 7,
					subsidiaryFK: 1000777,
				},
				{
					Id: 10,
					projectNumber: '890',
					money: 22.15,
					isGood: true,
					color: 3378638,
					password: 'kjadhaksjdha',
					testDateTime: new Date(Date.now() - Math.random() * 1e12),
					testDate: new Date(Date.now() - Math.random() * 1e12),
					testTime: new Date(Date.now() - Math.random() * 1e12),
					parent: 9,
					subsidiaryFK: 1000777,
				},
				{
					Id: 11,
					projectNumber: '123',
					money: 75421,
					isGood: false,
					color: 16777215,
					password: 'kjadhaksjdha',
					testDateTime: new Date(Date.now() - Math.random() * 1e12),
					testDate: new Date(Date.now() - Math.random() * 1e12),
					testTime: new Date(Date.now() - Math.random() * 1e12),
					parent: 5,
					subsidiaryFK: 1000777,
				},
				{
					Id: 12,
					projectNumber: '456',
					money: 7734.2654,
					isGood: true,
					color: 16777215,
					password: 'kjadhaksjdha',
					testDateTime: new Date(Date.now() - Math.random() * 1e12),
					testDate: new Date(Date.now() - Math.random() * 1e12),
					testTime: new Date(Date.now() - Math.random() * 1e12),
					parent: 5,
					dummy: 'test1',
					subsidiaryFK: 1000777,
				},
			],
			isReadOnly: false,
			allowMultiSelect: true,
			selectedItems: [],
			onCellValueChanged:(data, info)=> {
				//Change data of property.
				data.items[0].isGood = ! data.items[0].isGood;
				//Refresh Grid to reflect data.
				data.gridRef.refresh();
			},
		};

		const result = await this.gridDialogService.show(gridDialogData);

		console.log(result);
	}
}
