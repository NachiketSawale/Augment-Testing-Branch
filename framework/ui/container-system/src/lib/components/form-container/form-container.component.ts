import { Component, inject } from '@angular/core';

import { ContainerBaseComponent } from '../container-base/container-base.component';
import { IFormConfig, UiCommonCountryLookupService, FieldType, ConcreteMenuItem, FieldDataMode,  IGridApi, imageSelectData, IMenuItemsList, ItemType, createLookup, CountryEntity, IGridConfiguration} from '@libs/ui/common';
import { EntityRuntimeData, ValidationResult } from '@libs/platform/data-access';
import { IFileSelectControlResult, RgbColor, IEntityContext, IDescriptionInfo, PlatformTranslateService } from '@libs/platform/common';


/**
 * Mock data for file select
 */
const singleFileData = {
	data: 'data://',
	file: new File([], 'img_test1.png', {
		type: 'image/png',
	}),
	name: 'img_test1.png',
};

interface IParameterEntity {
	id?: number;
	name: string;
	isLive: boolean;
	value?: string;
	type: string;
}

interface ITestEntity {
	myText: string;
	testDate: Date;
	isGood?: boolean;
	money?: number;
	myFile?: IFileSelectControlResult;
	myOtherText?: string;
	myText1?: string;
	mode?: number;
	inputselect?: string;
	color?: RgbColor;
	sampleTime?: Date;
	sampleTimeutc?: Date;
	age?: number;
	translation?: IDescriptionInfo;
	radio?: string | number | boolean;
	isValid?: boolean;
	isPresent?: boolean;
	dataFile?: IFileSelectControlResult;
	url?:string;
	testCustomTranslate?: string;
	ref?: number;
	items?: IParameterEntity[];
	testToolItem?: IParameterEntity[];
	actionItems?: ConcreteMenuItem[];
	imageselect?: string
}

interface ITestEntry {
	item: ITestEntity;
	runtime?: EntityRuntimeData<ITestEntity>;
}

/*
interface IModeItem {
	readonly id: number;
	readonly name: string;
}*/

/**
 * This is a preliminary test for a form container.
 * It does not constitute the actual form container as it will be used later on.
 * @deprecated GridContainerComponent from ui.business-base should be used instead.
 */
@Component({
	templateUrl: './form-container.component.html',
	styleUrls: ['./form-container.component.scss'],
})
export class FormContainerComponent extends ContainerBaseComponent {

	/**
	 * inject the PlatformTranslateService
	 */
	public readonly translate = inject(PlatformTranslateService);
	
	public constructor() {
		super();
	}

	private entities: ITestEntry[] = [
		{
			item: {
				myText: 'Jean-Luc says hello!',
				testDate: new Date('2022-07-07'),
				myFile: singleFileData,
				sampleTime: new Date('2025-04-16'),
				sampleTimeutc: new Date('2025-04-16'),
				color: new RgbColor(0, 39, 200, 0.867),
				isValid: true,
				inputselect: 'test',
				radio: 2,
				items: [{
					id: 1,
					isLive: true,
					name: 'Test 1',
					type: 'string',
					value: 'This is Test 1 Item ',
				}, {
					id: 2,
					isLive: false,
					name: 'Test 2',
					type: 'number',
					value: '10',
				}, {
					id: 3,
					isLive: true,
					name: 'Test 3',
					type: 'string',
					value: 'This is Test3 Item',
				}, {
					id: 4,
					isLive: false,
					name: 'Test 4',
					type: 'number',
					value: '15',
				}],
				actionItems: [{
					id: 'actionButton1',
					type: ItemType.Item,
					iconClass: 'control-icons ico-filetype-log',
					fn: () => {
						console.log('action button 1 click');
					},
					caption: { key: 'basics.company.importContent.showLog' },
				}]


			},
			runtime: {
				readOnlyFields: [
					{
						field: 'isValid',
						readOnly: true,
					},
				],
				validationResults: [
					{
						field: 'dataFile',
						result: {
							valid: false,
							error: 'Please select file',
						},
					},
				],
				entityIsReadOnly: false
			},
		},
		{
			item: {
				myText: 'Will has said good-bye.',
				isGood: true,
				testDate: new Date('2022-08-08'),
				inputselect: 'test1',
				sampleTimeutc:new Date('2025-04-16'),
				items: [{
					id: 1,
					isLive: true,
					name: 'Test 11',
					type: 'string',
					value: 'This is Test 11 Item ',
				}, {
					id: 2,
					isLive: false,
					name: 'Test 21',
					type: 'number',
					value: '98',
				}, {
					id: 3,
					isLive: true,
					name: 'Test 31',
					type: 'string',
					value: 'This is Test 31 Item',
				}, {
					id: 4,
					isLive: false,
					name: 'Test 41',
					type: 'number',
					value: '45',
				}],

				actionItems: [{
					id: 'actionButton2',
					type: ItemType.Item,
					iconClass: 'tlb-icons ico-settings',
					fn: () => {
						console.log('action button 1 click');
					},
					caption: { key: 'basics.config.setConfiguration' },
				},
				{
					id: 'actionButton',
					type: ItemType.Item,
					iconClass: 'control-icons ico-config-test',
					fn: () => {
						console.log('action button 1 click');
					},
					caption: { key: 'basics.customize.checkConfig' },
				}
				]
			},
			runtime: {
				readOnlyFields: [
					{
						field: 'isGood',
						readOnly: true,
					},
				],
				validationResults: [
					{
						field: 'myText',
						result: {
							valid: false,
							error: 'I don\'t like this!',
						},
					},
				],
				entityIsReadOnly: false
			},
		},
	];

	private currentEntity: number = 0;

	public entity: ITestEntity = this.entities[0].item;

	public entityRuntimeInfo?: EntityRuntimeData<ITestEntity> = this.entities[0].runtime;

	private gridConfiguration: IGridConfiguration<IParameterEntity> = {
		uuid: '6f1b4d78935942dd8ba8a0f1d1568018',
		idProperty: 'name',
		skipPermissionCheck: true,
		columns: [{
			id: 'islive',
			model: 'isLive',
			sortable: true,
			label: {
				text: 'Is Live',
			},
			type: FieldType.Boolean,
			readonly: false,
			searchable: true,
			tooltip: {
				text: 'Is Live',
			},
			width: 20,
			visible: true,
			keyboard: {
				enter: false,
				tab: false
			},
			pinned: true
		}, {
			id: 'name',
			model: 'name',
			sortable: true,
			label: {
				text: 'Name',
			},
			type: FieldType.Description,
			readonly: true,
			searchable: true,
			tooltip: {
				text: 'Name of parameter',
			},
			width: 100,
			visible: true,
			keyboard: {
				enter: false,
				tab: false
			},
			pinned: false
		}, {
			id: 'type',
			model: 'type',
			sortable: true,
			label: {
				text: 'Type',
			},
			type: FieldType.Description,
			readonly: true,
			searchable: true,
			tooltip: {
				text: 'Type',
			},
			width: 100,
			visible: true,
			keyboard: {
				enter: false,
				tab: false
			},
			pinned: false
		}, {
			id: 'value',
			model: 'value',
			sortable: true,
			label: {
				text: 'Value',
			},
			type: FieldType.Description,
			readonly: false,
			searchable: true,
			tooltip: {
				text: 'Value',
			},
			width: 100,
			visible: true,
			keyboard: {
				enter: false,
				tab: false
			}
		}],
	};
	private gridConfiguration1: IGridConfiguration<IParameterEntity> = {
		uuid: '00e9fd2759df5b92a0ff108c50440c70',
		idProperty: 'name',
		skipPermissionCheck: true,
		columns: [
			{
				id: 'islive',
				model: 'isLive',
				sortable: true,
				label: {
					text: 'Is Live',
				},
				type: FieldType.Boolean,
				readonly: false,
				searchable: true,
				tooltip: {
					text: 'Is Live',
				},
				width: 20,
				visible: true,
				keyboard: {
					enter: false,
					tab: false,
				},
				pinned: true,
			},
			{
				id: 'name',
				model: 'name',
				sortable: true,
				label: {
					text: 'Name',
				},
				type: FieldType.Description,
				readonly: true,
				searchable: true,
				tooltip: {
					text: 'Name of parameter',
				},
				width: 100,
				visible: true,
				keyboard: {
					enter: false,
					tab: false,
				},
				pinned: false,
			},
			{
				id: 'type',
				model: 'type',
				sortable: true,
				label: {
					text: 'Type',
				},
				type: FieldType.Description,
				readonly: true,
				searchable: true,
				tooltip: {
					text: 'Type',
				},
				width: 100,
				visible: true,
				keyboard: {
					enter: false,
					tab: false,
				},
				pinned: false,
			},
			{
				id: 'value',
				model: 'value',
				sortable: true,
				label: {
					text: 'Value',
				},
				type: FieldType.Description,
				readonly: false,
				searchable: true,
				tooltip: {
					text: 'Value',
				},
				width: 100,
				visible: true,
				keyboard: {
					enter: false,
					tab: false,
				},
				pinned: false
		}]
	};

	public formConfig: IFormConfig<ITestEntity> = {
		formId: 'abc',
		showGrouping: true,
		groups: [
			{
				groupId: 'default',
				header: { text: 'Default Group' },
			},
			{
				groupId: 'iso-code-group',
				header: 'Iso',
			},
		],
		rows: [
			{
				groupId: 'default',
				id: 'grid-1',
				label: 'Grid',
				type: FieldType.Grid,
				tools: (info) => {
					return this.getTool(info);
				},
				configuration: this.gridConfiguration as IGridConfiguration<object>,
				height: 100,
				model: 'items',
			},
			{
				groupId: 'iso-code-group',
				id: 'isoCode1',
				label: {
					text: 'Iso Code 1',
				},
				type: FieldType.Description,
				model: 'myText',
				sortOrder: 2,
				required: true,
				validator: info => {
					const strVal = <string>info.value;
					if (strVal.length % 2 === 0) {
						return new ValidationResult();
					} else {
						return new ValidationResult('Odd text length.');
					}
				}
			},
			{
				groupId: 'iso-code-group',
				id: 'isoCode2',
				label: {
					text: 'Iso Code 2',
				},
				type: FieldType.Description,
				model: 'myText1',
				maxLength: 252,
				sortOrder: 2,
				validator: async info => {
					await new Promise(resolve => setTimeout(() => resolve(undefined), 1000));
					const strVal = <string>info.value;
					if (strVal.length % 2 === 0) {
						return new ValidationResult();
					} else {
						return new ValidationResult('Odd text length.');
					}
				}
			},
			{
				groupId: 'iso-code-group',
				id: 'isoCode3',
				label: {
					text: 'Iso Code 3',
				},
				type: FieldType.Description,
				model: 'myOtherText',
				maxLength: 20,
				sortOrder: 2,
			},
			{
				groupId: 'iso-code-group',
				id: 'const',
				label: {
					text: 'Constant',
				},
				type: FieldType.Description,
				model: {
					getValue(obj: ITestEntity): string {
						return 'Hello, World!';
					},
				},
				readonly: true,
			},
			{
				groupId: 'default',
				id: 'isGood',
				label: {
					text: 'It is good',
				},
				type: FieldType.Boolean,
				model: 'isGood',
				sortOrder: 7,
			},
			{
				groupId: 'default',
				id: 'myFile',
				label: {
					text: 'Upload your File',
				},
				type: FieldType.FileSelect,
				model: 'myFile',
				sortOrder: 6,
				options: {
					fileFilter: 'image/*',
					multiSelect: true,
					retrieveFile: true,
				},
			},
			{
				groupId: 'default',
				id: 'money',
				label: {
					text: 'Please transfer immediately',
				},
				type: FieldType.Money,
				minValue: 10,
				model: 'money',
				sortOrder: 7,
				required: true,
			},
			{
				groupId: 'default',
				id: 'favColor',
				label: {
					text: 'Favorite Color',
				},
				type: FieldType.Color,
				model: 'color',
				showClearButton: true,
				infoText: 'Favorite Color',
				sortOrder: 1000,
			},
			{
				groupId: 'default',
				id: 'date',
				label: {
					text: 'Please choose a date',
				},
				type: FieldType.Date,
				model: 'testDate',
				sortOrder: 8,
				required: true
			},
			{
				groupId: 'default',
				id: 'actionItem',
				label: 'Action',
				type: FieldType.Action,
				model: 'actionItems',
				displayText: {
					getValue: (obj) => {
						return obj.myText;
					}
				},
				actionsSource: FieldDataMode.ModelElseFieldDef,
				actions: [
					{
						id: 'actionButton',
						type: ItemType.Item,
						iconClass: 'control-icons ico-config-test',
						fn: () => {
							console.log('action button 1 click');
						},
						caption: { key: 'basics.customize.checkConfig' },
					}
				]
			},
			{
				groupId: 'default',
				id: 'mode',
				label: 'Mode',
				type: FieldType.Select,
				model: 'mode',
				itemsSource: {
					items: [
						{
							id: 2,
							displayName: 'Smooth',
						},
						{
							id: 3,
							displayName: 'Bumpy',
						},
					],
				},
			},
			{
				groupId: 'default',
				id: 'age1',
				label: 'Age',
				type: FieldType.Integer,
				model: 'age',
			},
			{
				groupId: 'default',
				id: 'password',
				label: 'url Password',
				type: FieldType.Password,
				model: 'Password',
				placeholder: this.translate.instant({key:'basics.materialcatalog.enterPassword'}).text
			},
			{
				groupId: 'default',
				id: 'Description',
				label: {
					text: 'Placeholder for Description type',
				},
				type: FieldType.Description,
				model: 'Description',
				placeholder: 'Test placeholder for Description type'
			},
			{
				groupId: 'default',
				id: 'integer',
				label: 'Placeholder for Integer type',
				type: FieldType.Integer,
				model: 'Integer',
				placeholder: 'Test placeholder for Integer type'
			},
			{
				groupId: 'default',
				id: 'Decimal',
				label: 'Placeholder for float Component',
				type: FieldType.Decimal,
				model: 'Decimal',
				placeholder: 'Test placeholder for float Component'
			},
			{
				groupId: 'default',
				id: 'comment',
				label: 'Placeholder for Multi Line Text Component',
				type: FieldType.Comment,
				model: 'Comment',
				placeholder: 'Test placeholder for Multi Line Text'
			},
			{
				groupId: 'default',
				id: 'age2',
				label: 'Age Again',
				type: FieldType.Integer,
				model: 'age',
			},
			{
				groupId: 'default',
				id: 'utctime',
				label: {
					text: 'utc time',
				},
				type: FieldType.TimeUtc,
				model: 'sampleTimeutc',
				sortOrder: 10,
				required: true,
				options: {
					format: 'HH:mm'
				},
			},

			{
				groupId: 'default',
				id: 'localtime',
				label: {
					text: 'local time',
				},
				type: FieldType.Time,
				model: 'sampleTime',
				sortOrder: 11,
				required: true,
				options: {
					format: 'HH:mm',
				},
			},

			{
				id: 'url',
				label: 'url',
				type: FieldType.Url,
				model:'url',
			},
			{
				groupId: 'default',
				id: 'customTranslate',
				label: {
					text: 'Custom Translate',
				},
				type: FieldType.CustomTranslate,
				model: 'testCustomTranslate',
				sortOrder: 8,
				options: {
					section: 'testSection',
					id: 'testId',
					name: 'testName',
					onInitiated: (info) => {
						console.log(info);
					},
					onTranslationChanged: (info) => {
						console.log(info);
					},
					cacheEnabled: false,
				},
			},
			{
				groupId: 'default',
				id: 'ref',
				label: 'Reference',
				type: FieldType.Lookup,
				model: 'ref',
				lookupOptions: createLookup<ITestEntity, CountryEntity>({
					dataServiceToken: UiCommonCountryLookupService,
					clientSideFilter: {
						execute(item: CountryEntity, entity: IEntityContext<ITestEntity>): boolean {
							return true;
						},
					},
					showDescription: true,
					descriptionMember: 'Iso2',
				}),
			},
			{
				groupId: 'default',
				type: FieldType.Composite,
				id: 'composite',
				label: 'composite',
				composite: [
					{
						id: 'valid',
						label: {
							text: 'Is Valid',
						},
						type: FieldType.Boolean,
						model: 'isValid',
						sortOrder: 6,
						required: true,
					},
					{
						id: 'present',
						label: {
							text: 'Is Present',
						},
						type: FieldType.Boolean,
						model: 'isPresent',
						sortOrder: 8,
					},
					{
						id: 'myFile',
						label: {
							text: 'Upload File',
						},
						type: FieldType.FileSelect,
						model: 'dataFile',
						sortOrder: 9,
						options: {
							fileFilter: 'image/*',
							multiSelect: true,
							retrieveFile: true,
						},
					},
				],
				sortOrder: 1,
			},
			{
				groupId: 'default',
				id: 'radio',
				label: 'radio',
				type: FieldType.Radio,
				model: 'radio',
				itemsSource: {
					items: [
						{
							id: 1,
							displayName: 'Portrait',
							iconCSS: 'tlb-icons ico-info',
						},
						{
							id: 2,
							displayName: 'Landscape',
							iconCSS: 'tlb-icons ico-info',
						},
						{
							id: 3,
							displayName: 'Picture',
							iconCSS: 'tlb-icons ico-info',
						},
					],
				},
			},
			{
				groupId: 'default',
				id: 'input select',
				label: 'Input select',
				type: FieldType.InputSelect,
				model: 'inputselect',
				options: {
					items: [
						{
							description: 'Q1 2015',
							id: 1,
							isLive: true,
							remark: 'Q1 2015',
							sorting: 1,
							version: 1,
						},
						{
							description: 'Q2 2015',
							id: 2,
							isLive: true,
							remark: 'Q2 2015',
							sorting: 15,
							version: 2,
						},
						{
							description: 'Q3 2015',
							id: 3,
							isLive: true,
							remark: 'Q3 2015',
							sorting: 3,
							version: 1,
						},
						{
							description: 'Version 6',
							id: 4,
							isLive: true,
							remark: 'Version 6',
							sorting: 14,
							version: 1,
						},
						{
							description: 'Test Nr 1',
							id: 5,
							isLive: true,
							remark: 'Test Nr 1',
							sorting: 2,
							version: 2,
						},
					],
					serviceName: 'schedulingLookupBaselineSpecificationDataService',
					inputDomain: 'Description',
				},
			},
			{
				groupId: 'default',
				id: 'imageSelect',
				label: 'Image Select',
				type: FieldType.ImageSelect,
				model: 'imageselect',
				itemsSource: {
					items: imageSelectData,
				},
			},
		],
	};

	public entityAsJson() {
		return JSON.stringify(this.entity);
	}

	public nextEntity() {
		this.currentEntity++;
		if (this.currentEntity >= this.entities.length) {
			this.currentEntity = 0;
		}
		this.entity = this.entities[this.currentEntity].item;
		this.entityRuntimeInfo = this.entities[this.currentEntity].runtime;
	}

	public toggleValidationError() {
		if (this.entityRuntimeInfo) {
			const valResults = this.entityRuntimeInfo.validationResults;
			if (valResults.length > 1) {
				valResults.splice(1, 1);
			} else {
				valResults.push({
					field: 'myOtherText',
					result: {
						valid: false,
						error: 'Bad choice',
					},
				});
			}
		}
	}

	public getTool(grid?: IGridApi<object>): IMenuItemsList<void> {
		return {
			showImages: true,
			showTitles: true,
			cssClass: 'tools',
			items: [
				{
					id: 'moveUp',
					sort: 10,
					caption: 'cloud.common.toolbarMoveUp',
					type: ItemType.Item,
					iconClass: 'tlb-icons ico-grid-row-up',
					fn: () => {
						//TODO Grid methods will be accessed
						if (grid && grid.collapseAll) {
							grid.collapseAll();
						}
					},
					disabled: () => {
						//TODO Grid methods will be accessed
						return false;
					},
				},
				{
					id: 'moveDown',
					sort: 10,
					caption: 'cloud.common.toolbarMoveDown',
					type: ItemType.Item,
					iconClass: 'tlb-icons ico-grid-row-down',
					fn: () => {
						//TODO Grid methods will be accessed
						if (grid && grid.collapseAll) {
							grid.collapseAll();
						}
					},
					disabled: () => {
						return false;
					},
				},
				{
					id: 'moveTop',
					sort: 0,
					caption: 'cloud.common.toolbarMoveTop',
					type: ItemType.Item,
					iconClass: 'tlb-icons ico-grid-row-start',
					fn: () => {
						//TODO Grid methods will be accessed
						if (grid && grid.collapseAll) {
							grid.collapseAll();
						}
					},
					disabled: () => {
						return false;
					},
				},
				{
					id: 'moveBottom',
					sort: 10,
					caption: 'cloud.common.toolbarMoveBottom',
					type: ItemType.Item,
					iconClass: 'tlb-icons ico-grid-row-end',
					fn: () => {
						//TODO Grid methods will be accessed
						if (grid && grid.collapseAll) {
							grid.collapseAll();
						}
					},
					disabled: () => {
						return false;
					},
				},
			],
		};
	}

	public toggleReadOnly() {
		if (this.entityRuntimeInfo) {
			const ro = this.entityRuntimeInfo.readOnlyFields;
			if (ro.length > 1) {
				ro.splice(1, 1);
			} else {
				ro.push({
					field: 'myOtherText',
					readOnly: true,
				});
			}
		}
	}
}
