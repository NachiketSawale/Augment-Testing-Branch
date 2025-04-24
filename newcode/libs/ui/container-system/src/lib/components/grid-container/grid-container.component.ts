/*
 * Copyright(c) RIB Software GmbH
 */

import { Component, OnInit, inject } from '@angular/core';
import { ContainerBaseComponent } from '../container-base/container-base.component';
import { FieldType, ColumnDef, IGridConfiguration, IFieldValueChangeInfo, GridApiService } from '@libs/ui/common';

/*
interface IColumnInputField {
	[key: string]: string;
}
 */

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

/**
 * Used to build the configuration and services for the slick grid
 * @deprecated GridContainerComponent from ui.business-base should be used instead.
 */
@Component({
	selector: 'ui-container-system-grid-container',
	templateUrl: './grid-container.component.html',
	styleUrls: ['./grid-container.component.scss'],
})
export class GridContainerComponent extends ContainerBaseComponent implements OnInit {

	private columns: ColumnDef<ITestEntity>[] = [];
	private dataService: unknown = null;
	private gridApiService = inject(GridApiService);

	/**
	 * Holds the data that will be passed into the grid.
	 */
	public gridData: object[] = [];

	/**
	 * Holds the column configuration used to render the grid
	 */
	public config: IGridConfiguration<ITestEntity> = {
		columns: this.columns,
		idProperty: 'Id',
		skipPermissionCheck: true,
		treeConfiguration: {
			description: ['descriptionInfo.description', 'description', 'projectNumber'],
			rootEntities: () => {
				return this.config?.items?.reduce((result: ITestEntity[], entity) => {
					if(!entity.parent) {
						result.push(entity);
					}
					return result;
				}, []) || [];
			},
			children: (entity) => {
				return this.config?.items?.reduce((result: ITestEntity[], item) => {
					if(entity.Id === item.parent) {
						result.push(item);
					}
					return result;
				}, []) || [];
			},
			parent: (entity) => {
				if(entity.parent) {
					return this.config?.items?.find(item => item.Id === entity.parent) || null;
				}
				return null;
			}
		}
	};

	/**
	 * Injects the required dataservice.
	 */
	public constructor() {
		super();
		this.config.uuid = this.containerDefinition.uuid;
	}

	/**
	 * Loads the data into the grid on component initialization
	 */
	public ngOnInit(): void {
		// Adding a timeout as the grid container initializes first before data is loaded in the dataservice
		const dataLoaded = setInterval(() => {
			const entities: ITestEntity[] = [
				{
					Id: 1,
					projectNumber: '123',
					description: 'Project 1:',
					money: 10.24,
					isGood: true,
					color: 3378638,
					testDateTime: new Date(Date.now() - Math.random()*(1e+12)),
					testDate: new Date(Date.now() - Math.random()*(1e+12)),
					testTime: new Date(Date.now() - Math.random()*(1e+12)),
					password: 'kjadhaksjdha',
					url: 'https://www.google.com',
					subsidiaryFK: 1000777
				},
				{
					Id: 2,
					description: 'Project 2:',
					projectNumber: '456',
					money: 231.324235,
					isGood: true,
					color: 16777215,
					testDateTime: new Date(Date.now() - Math.random()*(1e+12)),
					testDate: new Date(Date.now() - Math.random()*(1e+12)),
					testTime: new Date(Date.now() - Math.random()*(1e+12)),
					password: 'kjadhaksjdha',
					url: 'https://www.hotmail.com',
					parent: 1,
					subsidiaryFK: 1000777
				},
				{
					Id: 3,
					description: 'Project 3:',
					projectNumber: '789',
					money: 63.251,
					isGood: true,
					color: 16777215,
					password: 'kjadhaksjdha',
					testDateTime: new Date(Date.now() - Math.random()*(1e+12)),
					testDate: new Date(Date.now() - Math.random()*(1e+12)),
					testTime: new Date(Date.now() - Math.random()*(1e+12)),
					parent: 1,
					subsidiaryFK: 1000777
				},
				{
					Id: 4,
					projectNumber: '012',
					money: 2.501,
					isGood: false,
					color: 3378638,
					testDateTime: new Date(Date.now() - Math.random()*(1e+12)),
					testDate: new Date(Date.now() - Math.random()*(1e+12)),
					testTime: new Date(Date.now() - Math.random()*(1e+12)),
					password: 'kjadhaksjdha',
					url: 'https://www.cnn.com',
					descriptionInfo: {
						description: 'Project 4:',
					},
					subsidiaryFK: 1000777
				},
				{
					Id: 5,
					projectNumber: '345',
					money: 626.00,
					isGood: true,
					color: 3378638,
					password: 'kjadhaksjdha',
					testDateTime: new Date(Date.now() - Math.random()*(1e+12)),
					testDate: new Date(Date.now() - Math.random()*(1e+12)),
					testTime: new Date(Date.now() - Math.random()*(1e+12)),
					parent: 4,
					descriptionInfo: {
						description: 'Project 5:',
					},
					subsidiaryFK: 1000777
				},
				{
					Id: 6,
					projectNumber: '678',
					money: 6.34,
					isGood: true,
					color: 3684408,
					password: 'kjadhaksjdha',
					testDateTime: new Date(Date.now() - Math.random()*(1e+12)),
					testDate: new Date(Date.now() - Math.random()*(1e+12)),
					testTime: new Date(Date.now() - Math.random()*(1e+12)),
					parent: 5,
					subsidiaryFK: 1000777
				},
				{
					Id: 7,
					projectNumber: '901',
					money: 664.362,
					isGood: true,
					password: 'kjadhaksjdha',
					testDateTime: new Date(Date.now() - Math.random()*(1e+12)),
					testDate: new Date(Date.now() - Math.random()*(1e+12)),
					testTime: new Date(Date.now() - Math.random()*(1e+12)),
					subsidiaryFK: 1000777
				},
				{
					Id: 8,
					projectNumber: '234',
					money: 1.2345,
					isGood: true,
					color: 3684408,
					password: 'kjadhaksjdha',
					testDateTime: new Date(Date.now() - Math.random()*(1e+12)),
					testDate: new Date(Date.now() - Math.random()*(1e+12)),
					testTime: new Date(Date.now() - Math.random()*(1e+12)),
					parent: 7,
					subsidiaryFK: 1000777
				},
				{
					Id: 9,
					projectNumber: '567',
					money: 34324.62,
					isGood: true,
					color: 3378638,
					password: 'kjadhaksjdha',
					testDateTime: new Date(Date.now() - Math.random()*(1e+12)),
					testDate: new Date(Date.now() - Math.random()*(1e+12)),
					testTime: new Date(Date.now() - Math.random()*(1e+12)),
					parent: 7,
					subsidiaryFK: 1000777
				},
				{
					Id: 10,
					projectNumber: '890',
					money: 22.15,
					isGood: true,
					color: 3378638,
					password: 'kjadhaksjdha',
					testDateTime: new Date(Date.now() - Math.random()*(1e+12)),
					testDate: new Date(Date.now() - Math.random()*(1e+12)),
					testTime: new Date(Date.now() - Math.random()*(1e+12)),
					parent: 9,
					subsidiaryFK: 1000777
				},
				{
					Id: 11,
					projectNumber: '123',
					money: 75421,
					isGood: false,
					color: 16777215,
					password: 'kjadhaksjdha',
					testDateTime: new Date(Date.now() - Math.random()*(1e+12)),
					testDate: new Date(Date.now() - Math.random()*(1e+12)),
					testTime: new Date(Date.now() - Math.random()*(1e+12)),
					parent: 5,
					subsidiaryFK: 1000777
				},
				{
					Id: 12,
					projectNumber: '456',
					money: 7734.2654,
					isGood: true,
					color: 16777215,
					password: 'kjadhaksjdha',
					testDateTime: new Date(Date.now() - Math.random()*(1e+12)),
					testDate: new Date(Date.now() - Math.random()*(1e+12)),
					testTime: new Date(Date.now() - Math.random()*(1e+12)),
					parent: 5,
					dummy: 'test1',
					subsidiaryFK: 1000777
				}
			];

			this.setContainerData(entities);
			clearTimeout(dataLoaded);
		}, 2000);

		// const testRefresh = setInterval(() => {
		// 	const api = this.gridApiService.get<ITestEntity>(this.config.uuid || '');
		//
		// 	if(api && this.config.items) {
		// 		api.refresh();
		// 		api.invalidate();
		// 		api.invalidate(this.config.items[0]);
		// 	}
		//
		// 	clearTimeout(testRefresh);
		// }, 10000);
	}

	/**
	 * Used to pass the selected data from the grid to the dataservice
	 * @param selectedRows
	 */
	public onSelectionChanged(selectedRows: object[]) {
		console.log('selectionChanged:', selectedRows);
	}

	public valueChanged(info: IFieldValueChangeInfo<ITestEntity>) {
		console.log('valueChanged:', info);
	}

	private setContainerData(selectedEntities: ITestEntity[]) {
		if (selectedEntities && selectedEntities.length > 0) {
			const columns: ColumnDef<ITestEntity>[] = [
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
						tab: true
					},
					pinned: false
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
						tab: true
					},
					pinned: false
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
						tab: true
					},
					pinned: false
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
						tab: true
					},
					pinned: false
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
						tab: true
					},
					pinned: false,
					options:{
						
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
						tab: true
					},
					pinned: false
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
						tab: true
					},
					pinned: false
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
						tab: true
					},
					pinned: false
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
						tab: true
					},
					pinned: false,
					headerChkbox: true
				},
				{
					id: 'isgetvalue',
					model: { getValue: (obj) => obj.dummy || obj.projectNumber || '42' },
					sortable: true,
					label: {
						text: 'Is getValue',
					},
					type: FieldType.Description,
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
						tab: true
					},
					pinned: false
				}];



			// apply new grid configuration
			this.config = {...this.config, columns: columns, items: selectedEntities};
		}
	}
}
