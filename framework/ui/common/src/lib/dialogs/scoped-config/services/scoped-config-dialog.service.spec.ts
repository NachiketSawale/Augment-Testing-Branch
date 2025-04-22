/*
 * Copyright(c) RIB Software GmbH
 */
import { TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';
import { MatDialogModule } from '@angular/material/dialog';

import { UiCommonScopedConfigDialogService } from './scoped-config-dialog.service';

import { RgbColor } from '@libs/platform/common';
import { FieldType } from '../../../model/fields';

import { IScopedConfigDialogState } from '../model/scoped-config-dialog-state.interface';
import { IScopedConfigDialogConfig } from '../model/scoped-config-dialog-options.interface';
import { IScopedConfigDialogFormData } from '../model/scoped-config-dialog-form-data.interface';


export interface IScopedConfigEntity {
	showModel?: boolean;
	showBackfaces?: boolean;
	selColor?: RgbColor;
	__rt$set_showModel?: boolean;
}

const configData: IScopedConfigDialogConfig<IScopedConfigEntity> = {
	headerText: 'Model-Specific Settings',
	formConfiguration: {
		formId: 'model.viewer.modelDisplaySettingsForm',
		showGrouping: false,
		groups: [
			{
				groupId: 1,
				header: '',
			},
		],
		rows: [
			{
				groupId: 1,
				id: 'showBackfaces',
				model: 'showBackfaces',
				type: FieldType.Boolean,
				label: {
					text: 'showBackfaces',
				},
			},
			{
				groupId: 1,
				id: 'showModel',
				model: 'showModel',
				type: FieldType.Boolean,
				label: {
					text: 'showModel',
				},
			},
			{
				groupId: 1,
				type: FieldType.Color,
				id: 'selColor',
				model: 'selColor',
				label: {
					text: 'selColor',
				},
				showClearButton: true,
			},
		],
	},
	fallbackValue: {
		showModel: true,
		showBackfaces: true,
		selColor: new RgbColor(0, 39, 200, 0.867),
	},
	value: {
		u: {
			showModel: true,
			showBackfaces: false,
			selColor: new RgbColor(0, 100, 200, 0.867),
		},
		r: {
			showModel: true,
			showBackfaces: true,
			selColor: new RgbColor(10, 139, 200, 0.867),
		},
		g: {
			showModel: true,
		},
	},
	permissions: {
		permission: 16,
		g: ['3370d97838704b85ae0d49a1d8fdbf73'],
		r: ['2a9924e3d31546c380f236e5f5fa4b5e'],
		u: ['60cc1283416a404f96985ff04af6c9b6'],
	},
};

describe('ScopedConfigDialogService', () => {
	let service: UiCommonScopedConfigDialogService;

	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [MatDialogModule, HttpClientModule],
		});
		service = TestBed.inject(UiCommonScopedConfigDialogService);
	});

	it('should be created', () => {
		expect(service).toBeTruthy();
	});

	it('Check if showDialog function opens the dialog', () => {
		const data = service.showDialog(configData);
		expect(data).toBeTruthy();
	});

	it('Check if createSettingsData function creates setting object', () => {
		const result = {
			entity: {} as IScopedConfigEntity,
			runTimeData: {
				readOnlyFields: [],
				validationResults: [],
				entityIsReadOnly: false,
			},
		};

		service['createSettingsData'](result, configData.fallbackValue as object, 'showModel', true, true);
		result.entity.showModel = false;
		result.entity.__rt$set_showModel = true;
		console.log(result.entity.showModel);
		console.log(result.entity.__rt$set_showModel);
	});

	it('Check if applySettings function creates the result data', () => {
		const orderedData = [
			{
				scopeLevel: 0,
				isGlobalFallback: true,
				formConfiguration: null,
				settings: {
					entity: {
						showModel: true,
						showBackfaces: true,
						selColor: {
							r: 0,
							g: 39,
							b: 200,
							opacity: 0.867,
						},
					},
					runTimeData: {
						readOnlyFields: [],
						validationResults: [],
						entityIsReadOnly: false,
					},
				},
			},
			{
				scopeLevel: 'g',
				isGlobalFallback: false,
				formConfiguration: {
					formId: 'model.viewer.modelDisplaySettingsForm',
					showGrouping: false,
					groups: [
						{
							groupId: 1,
							header: '',
						},
					],
					rows: [
						{
							type: 'composite',
							groupId: 1,
							id: 'showBackfaces',
							label: {
								text: 'showBackfaces',
								key: 'showBackfaces',
							},
							composite: [
								{
									model: '__rt$set_showBackfaces',
									type: 'boolean',
									id: 'bool',
									tooltip: {
										text: '',
										key: 'platform.overwriteInherited',
									},
									readonly: false,
								},
								{
									groupId: 1,
									id: 'showBackfaces',
									model: 'showBackfaces',
									type: 'boolean',
									label: {
										text: 'showBackfaces',
										key: 'showBackfaces',
									},
									readonly: false,
								},
							],
						},
						{
							type: 'composite',
							groupId: 1,
							id: 'showModel',
							label: {
								text: 'showModel',
								key: 'showModel',
							},
							composite: [
								{
									model: '__rt$set_showModel',
									type: 'boolean',
									id: 'bool',
									tooltip: {
										text: '',
										key: 'platform.overwriteInherited',
									},
									readonly: false,
								},
								{
									groupId: 1,
									id: 'showModel',
									model: 'showModel',
									type: 'boolean',
									label: {
										text: 'showModel',
										key: 'showModel',
									},
									readonly: false,
								},
							],
						},
						{
							type: 'composite',
							groupId: 1,
							id: 'selColor',
							label: {
								text: 'selColor',
								key: 'selColor',
							},
							composite: [
								{
									model: '__rt$set_selColor',
									type: 'boolean',
									id: 'bool',
									tooltip: {
										text: '',
										key: 'platform.overwriteInherited',
									},
									readonly: false,
								},
								{
									groupId: 1,
									type: 'color',
									id: 'selColor',
									model: 'selColor',
									label: {
										text: 'selColor',
										key: 'selColor',
									},
									showClearButton: true,
									readonly: false,
								},
							],
						},
					],
				},
				settings: {
					entity: {
						_rt$set_showBackfaces: true,
						_showBackfaces: true,
						__rt$edited_showBackfaces: true,
						_rt$set_showModel: true,
						_showModel: true,
						_rt$set_selColor: true,
						_selColor: {
							r: 0,
							g: 39,
							b: 200,
							opacity: 0.867,
						},
						__rt$edited_selColor: {
							r: 0,
							g: 39,
							b: 200,
							opacity: 0.867,
						},
						__rt$inheritedSettings: {
							showModel: true,
							showBackfaces: true,
							selColor: {
								r: 0,
								g: 39,
								b: 200,
								opacity: 0.867,
							},
						},
					},
					runTimeData: {
						readOnlyFields: [
							{
								field: 'showBackfaces',
								readOnly: false,
							},
							{
								field: 'showModel',
								readOnly: false,
							},
							{
								field: 'selColor',
								readOnly: false,
							},
						],
						validationResults: [],
						entityIsReadOnly: false,
					},
				},
			},
			{
				scopeLevel: 'r',
				isGlobalFallback: false,
				formConfiguration: {
					formId: 'model.viewer.modelDisplaySettingsForm',
					showGrouping: false,
					groups: [
						{
							groupId: 1,
							header: '',
						},
					],
					rows: [
						{
							type: 'composite',
							groupId: 1,
							id: 'showBackfaces',
							label: {
								text: 'showBackfaces',
								key: 'showBackfaces',
							},
							composite: [
								{
									model: '__rt$set_showBackfaces',
									type: 'boolean',
									id: 'bool',
									tooltip: {
										text: '',
										key: 'platform.overwriteInherited',
									},
									readonly: false,
								},
								{
									groupId: 1,
									id: 'showBackfaces',
									model: 'showBackfaces',
									type: 'boolean',
									label: {
										text: 'showBackfaces',
										key: 'showBackfaces',
									},
									readonly: false,
								},
							],
						},
						{
							type: 'composite',
							groupId: 1,
							id: 'showModel',
							label: {
								text: 'showModel',
								key: 'showModel',
							},
							composite: [
								{
									model: '__rt$set_showModel',
									type: 'boolean',
									id: 'bool',
									tooltip: {
										text: '',
										key: 'platform.overwriteInherited',
									},
									readonly: false,
								},
								{
									groupId: 1,
									id: 'showModel',
									model: 'showModel',
									type: 'boolean',
									label: {
										text: 'showModel',
										key: 'showModel',
									},
									readonly: false,
								},
							],
						},
						{
							type: 'composite',
							groupId: 1,
							id: 'selColor',
							label: {
								text: 'selColor',
								key: 'selColor',
							},
							composite: [
								{
									model: '__rt$set_selColor',
									type: 'boolean',
									id: 'bool',
									tooltip: {
										text: '',
										key: 'platform.overwriteInherited',
									},
									readonly: false,
								},
								{
									groupId: 1,
									type: 'color',
									id: 'selColor',
									model: 'selColor',
									label: {
										text: 'selColor',
										key: 'selColor',
									},
									showClearButton: true,
									readonly: false,
								},
							],
						},
					],
				},
				settings: {
					entity: {
						_rt$set_showBackfaces: true,
						_showBackfaces: true,
						_rt$set_showModel: false,
						_showModel: true,
						_rt$set_selColor: true,
						_selColor: {
							r: 10,
							g: 139,
							b: 200,
							opacity: 0.867,
						},
						__rt$inheritedSettings: {
							_rt$set_showBackfaces: true,
							_showBackfaces: true,
							__rt$edited_showBackfaces: true,
							_rt$set_showModel: true,
							_showModel: true,
							_rt$set_selColor: true,
							_selColor: {
								r: 0,
								g: 39,
								b: 200,
								opacity: 0.867,
							},
							__rt$edited_selColor: {
								r: 0,
								g: 39,
								b: 200,
								opacity: 0.867,
							},
							__rt$inheritedSettings: {
								showModel: true,
								showBackfaces: true,
								selColor: {
									r: 0,
									g: 39,
									b: 200,
									opacity: 0.867,
								},
							},
						},
						__rt$edited_showModel: true,
					},
					runTimeData: {
						readOnlyFields: [
							{
								field: 'showBackfaces',
								readOnly: false,
							},
							{
								field: 'showModel',
								readOnly: true,
							},
							{
								field: 'selColor',
								readOnly: false,
							},
						],
						validationResults: [],
						entityIsReadOnly: false,
					},
				},
			},
			{
				scopeLevel: 'u',
				isGlobalFallback: false,
				formConfiguration: {
					formId: 'model.viewer.modelDisplaySettingsForm',
					showGrouping: false,
					groups: [
						{
							groupId: 1,
							header: '',
						},
					],
					rows: [
						{
							type: 'composite',
							groupId: 1,
							id: 'showBackfaces',
							label: {
								text: 'showBackfaces',
								key: 'showBackfaces',
							},
							composite: [
								{
									model: '__rt$set_showBackfaces',
									type: 'boolean',
									id: 'bool',
									tooltip: {
										text: '',
										key: 'platform.overwriteInherited',
									},
									readonly: false,
								},
								{
									groupId: 1,
									id: 'showBackfaces',
									model: 'showBackfaces',
									type: 'boolean',
									label: {
										text: 'showBackfaces',
										key: 'showBackfaces',
									},
									readonly: false,
								},
							],
						},
						{
							type: 'composite',
							groupId: 1,
							id: 'showModel',
							label: {
								text: 'showModel',
								key: 'showModel',
							},
							composite: [
								{
									model: '__rt$set_showModel',
									type: 'boolean',
									id: 'bool',
									tooltip: {
										text: '',
										key: 'platform.overwriteInherited',
									},
									readonly: false,
								},
								{
									groupId: 1,
									id: 'showModel',
									model: 'showModel',
									type: 'boolean',
									label: {
										text: 'showModel',
										key: 'showModel',
									},
									readonly: false,
								},
							],
						},
						{
							type: 'composite',
							groupId: 1,
							id: 'selColor',
							label: {
								text: 'selColor',
								key: 'selColor',
							},
							composite: [
								{
									model: '__rt$set_selColor',
									type: 'boolean',
									id: 'bool',
									tooltip: {
										text: '',
										key: 'platform.overwriteInherited',
									},
									readonly: false,
								},
								{
									groupId: 1,
									type: 'color',
									id: 'selColor',
									model: 'selColor',
									label: {
										text: 'selColor',
										key: 'selColor',
									},
									showClearButton: true,
									readonly: false,
								},
							],
						},
					],
				},
				settings: {
					entity: {
						_rt$set_showBackfaces: false,
						_showBackfaces: true,
						_rt$set_showModel: false,
						_showModel: true,
						_rt$set_selColor: false,
						_selColor: {
							r: 10,
							g: 139,
							b: 200,
							opacity: 0.867,
						},
						__rt$inheritedSettings: {
							_rt$set_showBackfaces: true,
							_showBackfaces: true,
							_rt$set_showModel: false,
							_showModel: true,
							_rt$set_selColor: true,
							_selColor: {
								r: 10,
								g: 139,
								b: 200,
								opacity: 0.867,
							},
							__rt$inheritedSettings: {
								_rt$set_showBackfaces: true,
								_showBackfaces: true,
								__rt$edited_showBackfaces: true,
								_rt$set_showModel: true,
								_showModel: true,
								_rt$set_selColor: true,
								_selColor: {
									r: 0,
									g: 39,
									b: 200,
									opacity: 0.867,
								},
								__rt$edited_selColor: {
									r: 0,
									g: 39,
									b: 200,
									opacity: 0.867,
								},
								__rt$inheritedSettings: {
									showModel: true,
									showBackfaces: true,
									selColor: {
										r: 0,
										g: 39,
										b: 200,
										opacity: 0.867,
									},
								},
							},
							__rt$edited_showModel: true,
						},
						__rt$edited_showBackfaces: false,
						__rt$edited_showModel: true,
						__rt$edited_selColor: {
							r: 0,
							g: 100,
							b: 200,
							opacity: 0.867,
						},
					},
					runTimeData: {
						readOnlyFields: [
							{
								field: 'showBackfaces',
								readOnly: true,
							},
							{
								field: 'showModel',
								readOnly: true,
							},
							{
								field: 'selColor',
								readOnly: true,
							},
						],
						validationResults: [],
						entityIsReadOnly: false,
					},
				},
			},
		] as unknown as IScopedConfigDialogFormData<IScopedConfigEntity>[];

		service['applySettings'](configData.formConfiguration, { byName: {}, ordered: orderedData, items:[] }, configData.value as IScopedConfigDialogState<IScopedConfigEntity>);
	});
});
