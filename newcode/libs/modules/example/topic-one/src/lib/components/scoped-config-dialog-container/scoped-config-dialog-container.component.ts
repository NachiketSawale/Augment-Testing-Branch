/*
 * Copyright(c) RIB Software GmbH
 */
import { Component, inject } from '@angular/core';

import { RgbColor } from '@libs/platform/common';
import { ContainerBaseComponent } from '@libs/ui/container-system';
import { FieldType, IScopedConfigDialogConfig, UiCommonScopedConfigDialogService } from '@libs/ui/common';

export interface IScopedConfigEntity {
	showModel?: boolean;
	showBackfaces?: boolean;
	selColor?: RgbColor;
}

@Component({
	selector: 'example-topic-one-scoped-config-dialog-container',
	templateUrl: './scoped-config-dialog-container.component.html',
	styleUrls: ['./scoped-config-dialog-container.component.scss'],
})
export class ScopedConfigDialogContainerComponent extends ContainerBaseComponent {
	private scopedConfigService = inject(UiCommonScopedConfigDialogService);

	public async openDialog() {
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

		const data = await this.scopedConfigService.showDialog(configData);

		console.log(data);
	}
}
