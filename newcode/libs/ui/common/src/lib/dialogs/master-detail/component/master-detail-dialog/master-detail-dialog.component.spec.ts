/*
 * Copyright(c) RIB Software GmbH
 */

import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MasterDetailDialogComponent } from './master-detail-dialog.component';

import { TranslatePipe } from '@libs/platform/common';

import { FieldType } from '../../../../model/fields';
import { ItemType } from '../../../../model/menu-list/enum/menulist-item-type.enum';

import { IDialogEventInfo, getCustomDialogDataToken } from '../../../base';
import { IMasterDetailItem } from '../../model/master-detail-item.interface';
import { IMasterDetailDialog } from '../../model/master-detail-dialog.interface';
import { IMasterDetailDialogOptions } from '../../model/master-detail-dialog-options.interface';
import { getMasterDetailDialogDataToken } from '../../model/master-detail-dialog-data.interface';
import { IMenuItemEventInfo } from '../../../../model/menu-list/interface/menu-item-event-info.interface';

interface IFirstMasterItemFormTestEntity {
	myText: string;
	isGood?: boolean;
	money?: number;
	myText1: string;
	isGood1?: boolean;
	money1?: number;
	myText2: string;
	isGood2?: boolean;
	money2?: number;
	myText3: string;
	isGood3?: boolean;
	money3?: number;
	myText4: string;
	isGood4?: boolean;
	money4?: number;
	myText5: string;
	isGood5?: boolean;
	money5?: number;
	myText0: string;
	isGood0?: boolean;
	money0?: number;
}

interface ISecondMasterItemFormTestEntity {
	name?: string;
	age?: number;
	isOld?: boolean;
	isValid?: boolean;
	name1?: string;
	age1?: number;
	isOld1?: boolean;
	isValid1?: boolean;
	name2?: string;
	age2?: number;
	isOld2?: boolean;
	isValid2?: boolean;
	name3?: string;
	age3?: number;
	isOld3?: boolean;
	isValid3?: boolean;
	name4?: string;
	age4?: number;
	isOld4?: boolean;
	isValid4?: boolean;
	name5?: string;
	age5?: number;
	isOld5?: boolean;
	isValid5?: boolean;
}

type IDialogData = IFirstMasterItemFormTestEntity | ISecondMasterItemFormTestEntity;

const fixedDialogData: IMasterDetailDialogOptions<IDialogData> = {
	backdrop: 'static',
	height: '90%',
	headerText: 'cloud.desktop.sdSettingsHeader',
	width: '830px',
	windowClass: 'app-settings',
	customTools: [
		{
			caption: 'cloud.desktop.design.resetToDefault',
			fn: (info: IMenuItemEventInfo<IMasterDetailDialog<IDialogData>>) => {
				console.log(info);
			},
			iconClass: 'tlb-icons ico-reset',
			id: 'setDefault',
			sort: 1,
			type: ItemType.Item,
		},
	],
	items: [
		{
			// Id: 'sysSettings',
			cssClass: 'title',
			disabled: true,
			name: 'System Settings',
			visible: true,
		},
		{
			name: 'UI Branding (System)',
			visible: (info: IDialogEventInfo<IMasterDetailDialog<IDialogData>>) => {
				console.log(info);
				return true;
			},
			disabled: (info: IDialogEventInfo<IMasterDetailDialog<IDialogData>>) => {
				console.log(info);
				return false;
			},
			form: {
				formId: 'displaySettingsSystem',
				showGrouping: true,
				groups: [
					{
						groupId: 'config',
						header: { text: 'Config', key: 'cloud.desktop.design.config' },
					},
					{
						groupId: 'personal',
						header: { text: 'Personal', key: 'cloud.desktop.design.personal' },
					},

					{
						groupId: 'config0',
						header: { text: 'Config', key: 'cloud.desktop.design.config' },
					},
					{
						groupId: 'personal0',
						header: { text: 'Personal', key: 'cloud.desktop.design.personal' },
					},
				],
				rows: [
					{
						groupId: 'config',
						id: 'isoCode1',
						label: {
							text: 'Iso Code 1',
						},
						type: FieldType.Description,
						model: 'myText',
						sortOrder: 2,
						required: true,
					},
					{
						groupId: 'config',
						id: 'isGood',
						label: {
							text: 'It is good',
						},
						type: FieldType.Boolean,
						model: 'isGood',
						sortOrder: 5,
					},
					{
						groupId: 'personal',
						id: 'money',
						label: {
							text: 'Please transfer immediately',
						},
						type: FieldType.Money,
						minValue: 10,
						model: 'money',
						sortOrder: 7,
					},

					{
						groupId: 'config0',
						id: 'isoCode10',
						label: {
							text: 'Iso Code 1',
						},
						type: FieldType.Description,
						model: 'myText0',
						sortOrder: 2,
						required: true,
					},
					{
						groupId: 'config0',
						id: 'isGood0',
						label: {
							text: 'It is good',
						},
						type: FieldType.Boolean,
						model: 'isGood0',
						sortOrder: 5,
					},
					{
						groupId: 'personal0',
						id: 'money0',
						label: {
							text: 'Please transfer immediately',
						},
						type: FieldType.Money,
						minValue: 10,
						model: 'money0',
						sortOrder: 7,
					},
				],
			},
		},
		{
			name: 'Layout Settings',
			visible: true,
			form: {
				formId: 'layoutSettings',
				showGrouping: true,
				groups: [
					{
						groupId: 'pages',
						header: { text: 'Config', key: 'cloud.desktop.design.pages' },
					},
					{
						groupId: 'groups',
						header: { text: 'Personal', key: 'cloud.desktop.design.groups' },
					},
				],
				rows: [
					{
						groupId: 'pages',
						id: 'name',
						label: {
							text: 'Name',
						},
						type: FieldType.Description,
						model: 'name',
						sortOrder: 1,
						required: true,
					},
					{
						groupId: 'pages',
						id: 'age',
						label: {
							text: 'Age',
						},
						type: FieldType.Integer,
						minValue: 10,
						model: 'age',
						sortOrder: 2,
						required: true,
					},
					{
						groupId: 'groups',
						id: 'old',
						label: {
							text: 'Is Old',
						},
						type: FieldType.Boolean,
						model: 'isOld',
						sortOrder: 3,
					},
					{
						groupId: 'groups',
						id: 'isValid',
						label: {
							text: 'Is Valid',
						},
						type: FieldType.Boolean,
						model: 'isValid',
						sortOrder: 4,
					},
				],
			},
		},

		{
			// Id: 'sysSettings',
			cssClass: 'title',
			disabled: true,
			name: 'System Settings 1',
			visible: true,
		},
		{
			name: 'UI Branding 1 (System)',
			visible: (info: IDialogEventInfo<IMasterDetailDialog<IDialogData>>) => {
				console.log(info);
				return true;
			},
			disabled: (info: IDialogEventInfo<IMasterDetailDialog<IDialogData>>) => {
				console.log(info);
				return false;
			},
			form: {
				formId: 'displaySettingsSystem1',
				showGrouping: true,
				groups: [
					{
						groupId: 'config1',
						header: { text: 'Config', key: 'cloud.desktop.design.config' },
					},
					{
						groupId: 'personal1',
						header: { text: 'Personal', key: 'cloud.desktop.design.personal' },
					},
				],
				rows: [
					{
						groupId: 'config1',
						id: 'isoCode1',
						label: {
							text: 'Iso Code 1',
						},
						type: FieldType.Description,
						model: 'myText1',
						sortOrder: 2,
						required: true,
					},
					{
						groupId: 'config1',
						id: 'isGood',
						label: {
							text: 'It is good',
						},
						type: FieldType.Boolean,
						model: 'isGood1',
						sortOrder: 5,
					},
					{
						groupId: 'personal1',
						id: 'money',
						label: {
							text: 'Please transfer immediately',
						},
						type: FieldType.Money,
						minValue: 10,
						model: 'money1',
						sortOrder: 7,
					},
				],
			},
		},
		{
			name: 'Layout Settings 1',
			visible: true,
			form: {
				formId: 'layoutSettings1',
				showGrouping: true,
				groups: [
					{
						groupId: 'pages1',
						header: { text: 'Config', key: 'cloud.desktop.design.pages' },
					},
					{
						groupId: 'groups1',
						header: { text: 'Personal', key: 'cloud.desktop.design.groups' },
					},
				],
				rows: [
					{
						groupId: 'pages1',
						id: 'name',
						label: {
							text: 'Name',
						},
						type: FieldType.Description,
						model: 'name1',
						sortOrder: 1,
						required: true,
					},
					{
						groupId: 'pages1',
						id: 'age',
						label: {
							text: 'Age',
						},
						type: FieldType.Integer,
						minValue: 10,
						model: 'age1',
						sortOrder: 2,
						required: true,
					},
					{
						groupId: 'groups1',
						id: 'old',
						label: {
							text: 'Is Old',
						},
						type: FieldType.Boolean,
						model: 'isOld1',
						sortOrder: 3,
					},
					{
						groupId: 'groups1',
						id: 'isValid',
						label: {
							text: 'Is Valid',
						},
						type: FieldType.Boolean,
						model: 'isValid1',
						sortOrder: 4,
					},
				],
			},
		},

		{
			// Id: 'sysSettings',
			cssClass: 'title',
			disabled: true,
			name: 'System Settings 2',
			visible: true,
		},
		{
			name: 'UI Branding 2 (System)',
			visible: (info: IDialogEventInfo<IMasterDetailDialog<IDialogData>>) => {
				console.log(info);
				return true;
			},
			disabled: (info: IDialogEventInfo<IMasterDetailDialog<IDialogData>>) => {
				console.log(info);
				return false;
			},
			form: {
				formId: 'displaySettingsSystem2',
				showGrouping: true,
				groups: [
					{
						groupId: 'config2',
						header: { text: 'Config', key: 'cloud.desktop.design.config' },
					},
					{
						groupId: 'personal2',
						header: { text: 'Personal', key: 'cloud.desktop.design.personal' },
					},
				],
				rows: [
					{
						groupId: 'config2',
						id: 'isoCode1',
						label: {
							text: 'Iso Code 1',
						},
						type: FieldType.Description,
						model: 'myText2',
						sortOrder: 2,
						required: true,
					},
					{
						groupId: 'config2',
						id: 'isGood',
						label: {
							text: 'It is good',
						},
						type: FieldType.Boolean,
						model: 'isGood2',
						sortOrder: 5,
					},
					{
						groupId: 'personal2',
						id: 'money',
						label: {
							text: 'Please transfer immediately',
						},
						type: FieldType.Money,
						minValue: 10,
						model: 'money2',
						sortOrder: 7,
					},
				],
			},
		},
		{
			name: 'Layout Settings 2',
			visible: true,
			form: {
				formId: 'layoutSettings2',
				showGrouping: true,
				groups: [
					{
						groupId: 'pages2',
						header: { text: 'Config', key: 'cloud.desktop.design.pages' },
					},
					{
						groupId: 'groups2',
						header: { text: 'Personal', key: 'cloud.desktop.design.groups' },
					},
				],
				rows: [
					{
						groupId: 'pages2',
						id: 'name',
						label: {
							text: 'Name',
						},
						type: FieldType.Description,
						model: 'name2',
						sortOrder: 1,
						required: true,
					},
					{
						groupId: 'pages2',
						id: 'age',
						label: {
							text: 'Age',
						},
						type: FieldType.Integer,
						minValue: 10,
						model: 'age2',
						sortOrder: 2,
						required: true,
					},
					{
						groupId: 'groups2',
						id: 'old',
						label: {
							text: 'Is Old',
						},
						type: FieldType.Boolean,
						model: 'isOld2',
						sortOrder: 3,
					},
					{
						groupId: 'groups2',
						id: 'isValid',
						label: {
							text: 'Is Valid',
						},
						type: FieldType.Boolean,
						model: 'isValid2',
						sortOrder: 4,
					},
				],
			},
		},

		{
			// Id: 'sysSettings',
			cssClass: 'title',
			disabled: true,
			name: 'System Settings 3',
			visible: true,
		},
		{
			name: 'UI Branding 3 (System)',
			visible: (info: IDialogEventInfo<IMasterDetailDialog<IDialogData>>) => {
				console.log(info);
				return true;
			},
			disabled: (info: IDialogEventInfo<IMasterDetailDialog<IDialogData>>) => {
				console.log(info);
				return false;
			},
			form: {
				formId: 'displaySettingsSystem3',
				showGrouping: true,
				groups: [
					{
						groupId: 'config3',
						header: { text: 'Config', key: 'cloud.desktop.design.config' },
					},
					{
						groupId: 'personal3',
						header: { text: 'Personal', key: 'cloud.desktop.design.personal' },
					},
				],
				rows: [
					{
						groupId: 'config2',
						id: 'isoCode1',
						label: {
							text: 'Iso Code 1',
						},
						type: FieldType.Description,
						model: 'myText3',
						sortOrder: 2,
						required: true,
					},
					{
						groupId: 'config3',
						id: 'isGood',
						label: {
							text: 'It is good',
						},
						type: FieldType.Boolean,
						model: 'isGood3',
						sortOrder: 5,
					},
					{
						groupId: 'personal3',
						id: 'money',
						label: {
							text: 'Please transfer immediately',
						},
						type: FieldType.Money,
						minValue: 10,
						model: 'money3',
						sortOrder: 7,
					},
				],
			},
		},
		{
			name: 'Layout Settings 3',
			visible: true,
			form: {
				formId: 'layoutSettings3',
				showGrouping: true,
				groups: [
					{
						groupId: 'pages3',
						header: { text: 'Config', key: 'cloud.desktop.design.pages' },
					},
					{
						groupId: 'groups3',
						header: { text: 'Personal', key: 'cloud.desktop.design.groups' },
					},
				],
				rows: [
					{
						groupId: 'pages3',
						id: 'name',
						label: {
							text: 'Name',
						},
						type: FieldType.Description,
						model: 'name3',
						sortOrder: 1,
						required: true,
					},
					{
						groupId: 'pages3',
						id: 'age',
						label: {
							text: 'Age',
						},
						type: FieldType.Integer,
						minValue: 10,
						model: 'age3',
						sortOrder: 2,
						required: true,
					},
					{
						groupId: 'groups3',
						id: 'old',
						label: {
							text: 'Is Old',
						},
						type: FieldType.Boolean,
						model: 'isOld3',
						sortOrder: 3,
					},
					{
						groupId: 'groups3',
						id: 'isValid',
						label: {
							text: 'Is Valid',
						},
						type: FieldType.Boolean,
						model: 'isValid3',
						sortOrder: 4,
					},
				],
			},
		},

		{
			// Id: 'sysSettings',
			cssClass: 'title',
			disabled: true,
			name: 'System Settings 4',
			visible: true,
		},
		{
			name: 'UI Branding 4 (System)',
			visible: (info: IDialogEventInfo<IMasterDetailDialog<IDialogData>>) => {
				console.log(info);
				return true;
			},
			disabled: (info: IDialogEventInfo<IMasterDetailDialog<IDialogData>>) => {
				console.log(info);
				return false;
			},
			form: {
				formId: 'displaySettingsSystem4',
				showGrouping: true,
				groups: [
					{
						groupId: 'config4',
						header: { text: 'Config', key: 'cloud.desktop.design.config' },
					},
					{
						groupId: 'personal4',
						header: { text: 'Personal', key: 'cloud.desktop.design.personal' },
					},
				],
				rows: [
					{
						groupId: 'config4',
						id: 'isoCode1',
						label: {
							text: 'Iso Code 1',
						},
						type: FieldType.Description,
						model: 'myText4',
						sortOrder: 2,
						required: true,
					},
					{
						groupId: 'config4',
						id: 'isGood',
						label: {
							text: 'It is good',
						},
						type: FieldType.Boolean,
						model: 'isGood4',
						sortOrder: 5,
					},
					{
						groupId: 'personal4',
						id: 'money',
						label: {
							text: 'Please transfer immediately',
						},
						type: FieldType.Money,
						minValue: 10,
						model: 'money4',
						sortOrder: 7,
					},
				],
			},
		},
		{
			name: 'Layout Settings 4',
			visible: true,
			form: {
				formId: 'layoutSettings4',
				showGrouping: true,
				groups: [
					{
						groupId: 'pages4',
						header: { text: 'Config', key: 'cloud.desktop.design.pages' },
					},
					{
						groupId: 'groups4',
						header: { text: 'Personal', key: 'cloud.desktop.design.groups' },
					},
				],
				rows: [
					{
						groupId: 'pages4',
						id: 'name',
						label: {
							text: 'Name',
						},
						type: FieldType.Description,
						model: 'name4',
						sortOrder: 1,
						required: true,
					},
					{
						groupId: 'pages4',
						id: 'age',
						label: {
							text: 'Age',
						},
						type: FieldType.Integer,
						minValue: 10,
						model: 'age4',
						sortOrder: 2,
						required: true,
					},
					{
						groupId: 'groups4',
						id: 'old',
						label: {
							text: 'Is Old',
						},
						type: FieldType.Boolean,
						model: 'isOld4',
						sortOrder: 3,
					},
					{
						groupId: 'groups4',
						id: 'isValid',
						label: {
							text: 'Is Valid',
						},
						type: FieldType.Boolean,
						model: 'isValid4',
						sortOrder: 4,
					},
				],
			},
		},

		{
			// Id: 'sysSettings',
			cssClass: 'title',
			disabled: true,
			name: 'System Settings 5',
			visible: true,
		},
		{
			name: 'UI Branding 5 (System)',
			visible: (info: IDialogEventInfo<IMasterDetailDialog<IDialogData>>) => {
				console.log(info);
				return true;
			},
			disabled: (info: IDialogEventInfo<IMasterDetailDialog<IDialogData>>) => {
				console.log(info);
				return false;
			},
			form: {
				formId: 'displaySettingsSystem5',
				showGrouping: true,
				groups: [
					{
						groupId: 'config5',
						header: { text: 'Config', key: 'cloud.desktop.design.config' },
					},
					{
						groupId: 'personal5',
						header: { text: 'Personal', key: 'cloud.desktop.design.personal' },
					},
				],
				rows: [
					{
						groupId: 'config5',
						id: 'isoCode1',
						label: {
							text: 'Iso Code 1',
						},
						type: FieldType.Description,
						model: 'myText5',
						sortOrder: 2,
						required: true,
					},
					{
						groupId: 'config5',
						id: 'isGood',
						label: {
							text: 'It is good',
						},
						type: FieldType.Boolean,
						model: 'isGood5',
						sortOrder: 5,
					},
					{
						groupId: 'personal5',
						id: 'money',
						label: {
							text: 'Please transfer immediately',
						},
						type: FieldType.Money,
						minValue: 10,
						model: 'money5',
						sortOrder: 7,
					},
				],
			},
		},
		{
			name: 'Layout Settings 5',
			visible: true,
			form: {
				formId: 'layoutSettings5',
				showGrouping: true,
				groups: [
					{
						groupId: 'pages5',
						header: { text: 'Config', key: 'cloud.desktop.design.pages' },
					},
					{
						groupId: 'groups5',
						header: { text: 'Personal', key: 'cloud.desktop.design.groups' },
					},
				],
				rows: [
					{
						groupId: 'pages5',
						id: 'name',
						label: {
							text: 'Name',
						},
						type: FieldType.Description,
						model: 'name5',
						sortOrder: 1,
						required: true,
					},
					{
						groupId: 'pages5',
						id: 'age',
						label: {
							text: 'Age',
						},
						type: FieldType.Integer,
						minValue: 10,
						model: 'age5',
						sortOrder: 2,
						required: true,
					},
					{
						groupId: 'groups5',
						id: 'old',
						label: {
							text: 'Is Old',
						},
						type: FieldType.Boolean,
						model: 'isOld5',
						sortOrder: 3,
					},
					{
						groupId: 'groups5',
						id: 'isValid',
						label: {
							text: 'Is Valid',
						},
						type: FieldType.Boolean,
						model: 'isValid5',
						sortOrder: 4,
					},
				],
			},
		},
	],
};

describe('MasterDetailDialogComponent with fixed items', () => {
	let component: MasterDetailDialogComponent<IDialogData>;
	let fixture: ComponentFixture<MasterDetailDialogComponent<IDialogData>>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [MasterDetailDialogComponent, TranslatePipe],
			imports: [HttpClientModule],
			providers: [
				{
					provide: getMasterDetailDialogDataToken<IDialogData>(),
					useValue: {
						items: fixedDialogData.items,
						customTools: fixedDialogData.customTools,
					},
				},
				{
					provide: getCustomDialogDataToken<IDialogData, MasterDetailDialogComponent<IDialogData>>(),
					useValue: {
						value: fixedDialogData.items
					},
				},
			],
		}).compileComponents();

		fixture = TestBed.createComponent(MasterDetailDialogComponent);
		component = fixture.componentInstance;
		component.searchSettings.isSearchActive = true;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	it('check if onSearch function is working fine', () => {
		component.onSearch();
	});
});

interface IDynamicFirstMasterItemFormTestEntity {
	myText: string;
	isGood?: boolean;
	money?: number;
}

interface IDynamicSecondMasterItemFormTestEntity {
	name?: string;
	age?: number;
	isOld?: boolean;
	isValid?: boolean;
}

interface IAdditionalEntry {
	moneyValue?: number;
	isOver?: boolean;
	dummyText?: string;
}

type IDynamicDialogData = IDynamicFirstMasterItemFormTestEntity | IDynamicSecondMasterItemFormTestEntity | IAdditionalEntry;

const dynamicDialogData: IMasterDetailDialogOptions<IDynamicDialogData> = {
	backdrop: 'static',
	height: '90%',
	headerText: 'cloud.desktop.sdSettingsHeader',
	width: '830px',
	windowClass: 'app-settings',
	editing: {
		add: (items: IMasterDetailItem<IDynamicDialogData>[]) => {
			//TODO: Implementation is Mocked
			const item: IMasterDetailItem<IDynamicDialogData> = {
				name: 'UI System',
				visible: true,
				form: {
					formId: 'displaySettingsSystem',
					showGrouping: true,
					groups: [
						{
							groupId: 'dataconfig',
							header: { text: 'DataConfig', key: 'cloud.desktop.design.dataconfig' },
						},
						{
							groupId: 'personaldata',
							header: { text: 'PersonalData', key: 'cloud.desktop.design.personaldata' },
						},
					],
					rows: [
						{
							groupId: 'dataconfig',
							id: 'dummyText',
							label: {
								text: 'Dummy Text',
							},
							type: FieldType.Description,
							model: 'dummyText',
							sortOrder: 2,
							required: true,
						},
						{
							groupId: 'dataconfig',
							id: 'isOver',
							label: {
								text: 'It is Over',
							},
							type: FieldType.Boolean,
							model: 'isOver',
							sortOrder: 5,
						},
						{
							groupId: 'personaldata',
							id: 'moneyValue',
							label: {
								text: 'Please transfer Money',
							},
							type: FieldType.Money,
							minValue: 10,
							model: 'moneyValue',
							sortOrder: 7,
						},
					],
				},
			};
			items.push(item as IMasterDetailItem<IDynamicDialogData>);
			return item;
		},
		delete: (items: IMasterDetailItem<IDynamicDialogData>[], deleteItem: IMasterDetailItem<IDynamicDialogData>) => {
			//TODO: Implementation is Mocked
			const delIdx = items.indexOf(deleteItem);
			items.splice(delIdx, 1);
			return true;
		},
		addText: 'Add',
		deleteText: 'Delete',
	},
	items: [
		{
			cssClass: 'title',
			disabled: true,
			name: 'System Settings',
			visible: true,
		},
		{
			name: 'UI Branding (System)',
			visible: true,
			form: {
				formId: 'displaySettingsSystem',
				showGrouping: true,
				groups: [
					{
						groupId: 'config',
						header: { text: 'Config', key: 'cloud.desktop.design.config' },
					},
					{
						groupId: 'personal',
						header: { text: 'Personal', key: 'cloud.desktop.design.personal' },
					},
				],
				rows: [
					{
						groupId: 'config',
						id: 'isoCode1',
						label: {
							text: 'Iso Code 1',
						},
						type: FieldType.Description,
						model: 'myText',
						sortOrder: 2,
						required: true,
					},
					{
						groupId: 'config',
						id: 'isGood',
						label: {
							text: 'It is good',
						},
						type: FieldType.Boolean,
						model: 'isGood',
						sortOrder: 5,
					},
					{
						groupId: 'personal',
						id: 'money',
						label: {
							text: 'Please transfer immediately',
						},
						type: FieldType.Money,
						minValue: 10,
						model: 'money',
						sortOrder: 7,
					},
				],
			},
		},
		{
			name: 'Layout Settings',
			visible: true,
			form: {
				formId: 'layoutSettings',
				showGrouping: true,
				groups: [
					{
						groupId: 'pages',
						header: { text: 'Config', key: 'cloud.desktop.design.pages' },
					},
					{
						groupId: 'groups',
						header: { text: 'Personal', key: 'cloud.desktop.design.groups' },
					},
				],
				rows: [
					{
						groupId: 'pages',
						id: 'name',
						label: {
							text: 'Name',
						},
						type: FieldType.Description,
						model: 'name',
						sortOrder: 1,
						required: true,
					},
					{
						groupId: 'pages',
						id: 'age',
						label: {
							text: 'Age',
						},
						type: FieldType.Integer,
						minValue: 10,
						model: 'age',
						sortOrder: 2,
						required: true,
					},
					{
						groupId: 'groups',
						id: 'old',
						label: {
							text: 'Is Old',
						},
						type: FieldType.Boolean,
						model: 'isOld',
						sortOrder: 3,
					},
					{
						groupId: 'groups',
						id: 'isValid',
						label: {
							text: 'Is Valid',
						},
						type: FieldType.Boolean,
						model: 'isValid',
						sortOrder: 4,
					},
				],
			},
		},
	],
};

describe('MasterDetailDialogComponent with dynamic items', () => {
	let component: MasterDetailDialogComponent<IDynamicDialogData>;
	let fixture: ComponentFixture<MasterDetailDialogComponent<IDynamicDialogData>>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [MasterDetailDialogComponent, TranslatePipe],
			imports: [HttpClientModule],
			providers: [
				{
					provide: getMasterDetailDialogDataToken<IDynamicDialogData>(),
					useValue: {
						items: dynamicDialogData.items,
						editing: dynamicDialogData.editing,
					},
				},
				{
					provide: getCustomDialogDataToken<IDialogData, MasterDetailDialogComponent<IDynamicDialogData>>(),
					useValue: {
						value: dynamicDialogData.items
					},
				},
			],
		}).compileComponents();

		fixture = TestBed.createComponent(MasterDetailDialogComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
	/*
// TODO: check with new menu item generic parameter
	it('check if add icon adds the item ', () => {
		if (component.tools.items && component.tools.items[1].fn) {
			component.tools.items[1].fn('');
		}
	});

	it('check if delete icon deletes the item ', () => {
		if (component.tools.items && component.tools.items[2].fn) {
			component.tools.items[2].fn('');
		}
	});

	it('check if search icon searches the item list ', () => {
		if (component.tools.items && component.tools.items[3].fn) {
			component.tools.items[3].fn('');
		}
	});*/
});

const defaultFormData: IMasterDetailDialogOptions<IAdditionalEntry> = {
	backdrop: 'static',
	headerText: 'cloud.desktop.sdSettingsHeader',
	width: '830px',
	windowClass: 'app-settings',
	defaultForm: (dialogInfo) => {
		return {
			form: {
				formId: 'displaySettingsSystem',
				showGrouping: true,
				groups: [
					{
						groupId: 'dataconfig',
						header: { text: 'DataConfig', key: 'cloud.desktop.design.dataconfig' },
					},
					{
						groupId: 'personaldata',
						header: { text: 'PersonalData', key: 'cloud.desktop.design.personaldata' },
					},
				],
				rows: [
					{
						groupId: 'dataconfig',
						id: 'dummyText',
						label: {
							text: 'Dummy Text',
						},
						type: FieldType.Description,
						model: 'dummyText',
						sortOrder: 2,
						required: true,
					},
					{
						groupId: 'dataconfig',
						id: 'isOver',
						label: {
							text: 'It is Over',
						},
						type: FieldType.Boolean,
						model: 'isOver',
						sortOrder: 5,
					},
					{
						groupId: 'personaldata',
						id: 'moneyValue',
						label: {
							text: 'Please transfer Money',
						},
						type: FieldType.Money,
						minValue: 10,
						model: 'moneyValue',
						sortOrder: 7,
					},
				],
			},
			//Default value
			value: {
				dummyText: 'demo'
			}
		};
	},
	items: [
		{
			cssClass: 'title',
			disabled: true,
			name: 'System Settings',
			visible: true,
		},
		{
			name: 'UI Branding (System)',
			visible: true,
		},
		{
			name: 'Layout Settings',
			visible: true
		},
	],
};
describe('MasterDetailDialogComponent with deafult form', () => {
	let component: MasterDetailDialogComponent<IDynamicDialogData>;
	let fixture: ComponentFixture<MasterDetailDialogComponent<IDynamicDialogData>>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [MasterDetailDialogComponent, TranslatePipe],
			imports: [HttpClientModule],
			providers: [
				{
					provide: getMasterDetailDialogDataToken<IDynamicDialogData>(),
					useValue: {
						items: defaultFormData.items,
						defaultForm: defaultFormData.defaultForm,
						editing: defaultFormData.editing,
					},
				},
				{
					provide: getCustomDialogDataToken<IDialogData, MasterDetailDialogComponent<IDynamicDialogData>>(),
					useValue: {
						value: defaultFormData.items
					},
				},
			],
		}).compileComponents();

		fixture = TestBed.createComponent(MasterDetailDialogComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
