/*
 * Copyright(c) RIB Software GmbH
 */

import { MatTabsModule } from '@angular/material/tabs';
import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule, NoopAnimationsModule } from '@angular/platform-browser/animations';

import { ScopedConfigDialogComponent } from './scoped-config-dialog.component';

import { RgbColor, TranslatePipe } from '@libs/platform/common';
import { StandardDialogButtonId, getCustomDialogDataToken } from '../../../base';
import { getScopedConfigDialogDataToken } from '../../model/scoped-config-dialog-data.interface';

export interface IScopedConfigEntity {
	showModel?: boolean;
	showBackfaces?: boolean;
	selColor?: RgbColor;
	__rt$set_showModel?: boolean;
}

const dialogData = {
	byName: {
		'0': {
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
		g: {
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
					__rt$edited_showBackfaces: true,
					_rt$set_showModel: true,
					_showModel: true,
					_rt$set_selColor: false,
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
							readOnly: true,
						},
						{
							field: 'showModel',
							readOnly: false,
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
		r: {
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
					_rt$set_showModel: true,
					_showModel: true,
					_rt$set_selColor: true,
					_selColor: {
						r: 10,
						g: 139,
						b: 200,
						opacity: 0.867,
					},
					__rt$inheritedSettings: {
						_rt$set_showBackfaces: false,
						_showBackfaces: true,
						__rt$edited_showBackfaces: true,
						_rt$set_showModel: true,
						_showModel: true,
						_rt$set_selColor: false,
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
		u: {
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
					_showBackfaces: false,
					_rt$set_showModel: true,
					_showModel: true,
					_rt$set_selColor: true,
					_selColor: {
						r: 0,
						g: 100,
						b: 200,
						opacity: 0.867,
					},
					__rt$inheritedSettings: {
						_rt$set_showBackfaces: true,
						_showBackfaces: true,
						_rt$set_showModel: true,
						_showModel: true,
						_rt$set_selColor: true,
						_selColor: {
							r: 10,
							g: 139,
							b: 200,
							opacity: 0.867,
						},
						__rt$inheritedSettings: {
							_rt$set_showBackfaces: false,
							_showBackfaces: true,
							__rt$edited_showBackfaces: true,
							_rt$set_showModel: true,
							_showModel: true,
							_rt$set_selColor: false,
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
	},
	ordered: [
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
					__rt$edited_showBackfaces: true,
					_rt$set_showModel: true,
					_showModel: true,
					_rt$set_selColor: false,
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
							readOnly: true,
						},
						{
							field: 'showModel',
							readOnly: false,
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
					_rt$set_showModel: true,
					_showModel: true,
					_rt$set_selColor: true,
					_selColor: {
						r: 10,
						g: 139,
						b: 200,
						opacity: 0.867,
					},
					__rt$inheritedSettings: {
						_rt$set_showBackfaces: false,
						_showBackfaces: true,
						__rt$edited_showBackfaces: true,
						_rt$set_showModel: true,
						_showModel: true,
						_rt$set_selColor: false,
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
					_showBackfaces: false,
					_rt$set_showModel: true,
					_showModel: true,
					_rt$set_selColor: true,
					_selColor: {
						r: 0,
						g: 100,
						b: 200,
						opacity: 0.867,
					},
					__rt$inheritedSettings: {
						_rt$set_showBackfaces: true,
						_showBackfaces: true,
						_rt$set_showModel: true,
						_showModel: true,
						_rt$set_selColor: true,
						_selColor: {
							r: 10,
							g: 139,
							b: 200,
							opacity: 0.867,
						},
						__rt$inheritedSettings: {
							_rt$set_showBackfaces: false,
							_showBackfaces: true,
							__rt$edited_showBackfaces: true,
							_rt$set_showModel: true,
							_showModel: true,
							_rt$set_selColor: false,
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
	],
	items:[]
};

describe('ScopedConfigDialogComponent', () => {
	let component: ScopedConfigDialogComponent<IScopedConfigEntity>;
	let fixture: ComponentFixture<ScopedConfigDialogComponent<IScopedConfigEntity>>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [MatTabsModule, HttpClientModule, BrowserAnimationsModule, NoopAnimationsModule],
			declarations: [ScopedConfigDialogComponent, TranslatePipe],
			providers: [
				{
					provide: getScopedConfigDialogDataToken<IScopedConfigEntity>(),
					useValue: dialogData,
				},
				{
					provide: getCustomDialogDataToken<IScopedConfigEntity, ScopedConfigDialogComponent<IScopedConfigEntity>>(),
					useValue: {
						close: (closingButtonId?: StandardDialogButtonId | string) => {
							console.log('Dialog Closed with id', closingButtonId);
						},
					},
				},
			],
		}).compileComponents();

		fixture = TestBed.createComponent(ScopedConfigDialogComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
		component.dialogInfo.close(StandardDialogButtonId.Ok);
	});
});
