/*
 * Copyright(c) RIB Software GmbH
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GridDialogComponent } from './grid-dialog.component';

import { FieldType } from '../../../../model/fields/field-type.enum';
import { ItemType } from '../../../../model/menu-list/enum/menulist-item-type.enum';

import { IMenuItemEventInfo } from '../../../../model/menu-list/interface/menu-item-event-info.interface';
import { IGridDialog } from '../../model/grid-dialog.interface';
import { IGridDialogOptions } from '../../model/grid-dialog-options.interface';
import { getGridDialogDataToken } from '../../model/grid-dialog-data.interface';
import { getCustomDialogDataToken } from '../../../base/model/interfaces/custom-dialog.interface';

export interface IGridDialogDataEntity {
	Id: number;
	Code: string;
	isPresent: boolean;
	name?: string;
	age?: number;
	location?: string;
	designation?: string;
}

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
				fn: () => {
					console.log('delete');
				},
			},
		],
	},
	gridConfig: {
		uuid: 'b71b610f564c40ed81dfe5d853bf5fe8',
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
	selectedItems: [],
	isReadOnly: false,
	allowMultiSelect: true,
};

const dialogWrapper = {
	value: {
		items: [
			{
				Id: 1000006,
				Code: 'EQ-0030',
				isPresent: true,
				name: 'john',
				age: 23,
				designation: 'SE',
				location: 'GE',
				children: [
					{
						Id: 10000061,
						Code: 'EQ-0030',
						isPresent: true,
						children: [],
					},
				],
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
		selectedItems: [],
	},
};

describe('GridDialogComponent', () => {
	let component: GridDialogComponent<IGridDialogDataEntity>;
	let fixture: ComponentFixture<GridDialogComponent<IGridDialogDataEntity>>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [GridDialogComponent],
			providers: [
				{
					provide: getGridDialogDataToken<IGridDialogDataEntity>(),
					useValue: {
						gridConfig: gridDialogData.gridConfig,
						tools: gridDialogData.tools,
						items: gridDialogData.items,
					},
				},
				{
					provide: getCustomDialogDataToken<IGridDialogDataEntity, GridDialogComponent<IGridDialogDataEntity>>(),
					useValue: dialogWrapper,
				},
			],
		}).compileComponents();

		fixture = TestBed.createComponent(GridDialogComponent<IGridDialogDataEntity>);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	it('should call onSelectionChanged', () => {
		const mockEvent = [
			{
				Id: 1000009,
				Code: 'EQ-0031',
				isPresent: true,
				name: 'john',
				age: 23,
				designation: 'SE',
				location: 'GE',
			},
		];
		jest.spyOn(component, 'onSelectionChanged');
		component.onSelectionChanged(mockEvent);
		expect(component.onSelectionChanged).toHaveBeenCalledWith(mockEvent);
		expect(component).toBeTruthy();
	});
});
