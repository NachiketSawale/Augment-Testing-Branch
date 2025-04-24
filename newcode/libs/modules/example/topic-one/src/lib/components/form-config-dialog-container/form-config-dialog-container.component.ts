/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */
import { Component, inject } from '@angular/core';
import { FieldType, IFormConfigDialogData, IFormConfigDialogOptions, UiCommonFormConfigDialogService } from '@libs/ui/common';
import { ContainerBaseComponent } from '@libs/ui/container-system';

interface IFormConfigData extends IFormConfigDialogData {
	//TODO: Any additional entities like (Uom, Fraction....)
}

interface IFormConfigDataWithAddons extends IFormConfigDialogData {
	//TODO: Any additional entities like (Uom, Fraction....)
	fraction: boolean;
}
@Component({
	selector: 'example-topic-one-form-config-dialog-container',
	templateUrl: './form-config-dialog-container.component.html',
	styleUrl: './form-config-dialog-container.component.scss',
})
export class FormConfigDialogContainerComponent extends ContainerBaseComponent {
	private readonly formConfigDialogSvc = inject(UiCommonFormConfigDialogService);
	public async openDialog() {
		const options: IFormConfigDialogOptions<IFormConfigData> = {
			headerText: {
				key: 'cloud.desktop.formConfigDialogTitle',
			},
			width: '80%',
			groups: [
				{
					groupId: 'basicData',
					label: 'Basic Data',
					userLabelName: '',
					labelCode: '',
					visible: false,
					enterStop: false,
				},
				{
					groupId: 'assignments',
					label: 'Assignments',
					userLabelName: '',
					labelCode: '',
					visible: false,
					enterStop: false,
				},
				{
					groupId: 'userDefText',
					label: 'User-Defined Texts',
					userLabelName: 'User Texts',
					labelCode: '',
					visible: false,
					enterStop: false,
				},
			],
			rows: [
				{
					groupId: 'basicData',
					rowId: 'code',
					label: 'Code',
					userLabelName: '',
					labelCode: '',
					visible: true,
					enterStop: true,
				},
				{
					groupId: 'basicData',
					rowId: 'description',
					label: 'Description',
					userLabelName: '',
					labelCode: '',
					visible: true,
					enterStop: true,
				},
				/////
				{
					groupId: 'assignments',
					rowId: 'costcodeportionsfk',
					label: 'Cost Portions',
					userLabelName: '',
					labelCode: '',
					visible: false,
					enterStop: true,
				},
				{
					groupId: 'assignments',
					rowId: 'costgroupportionsfk',
					label: 'Cost Group Portions',
					userLabelName: '',
					labelCode: '',
					visible: false,
					enterStop: true,
				},
				/////
				{
					groupId: 'userDefText',
					rowId: 'userdefined1',
					label: 'Text 1',
					userLabelName: '',
					labelCode: '',
					visible: true,
					enterStop: true,
				},
				{
					groupId: 'userDefText',
					rowId: 'userdefined2',
					label: 'Text 2',
					userLabelName: '',
					labelCode: '',
					visible: false,
					enterStop: true,
				},
			],
			selectedItem: 'costcodeportionsfk'
		};

		const data = await this.formConfigDialogSvc.show(options);

		console.log(data);
	}

	public async openDialogWithAddons() {
		const options: IFormConfigDialogOptions<IFormConfigDataWithAddons> = {
			headerText: {
				key: 'cloud.desktop.formConfigDialogTitle',
			},
			width: '80%',
			groups: [
				{
					groupId: 'basicData',
					label: 'Basic Data',
					userLabelName: '',
					labelCode: '',
					visible: false,
					enterStop: false,
				},
				{
					groupId: 'assignments',
					label: 'Assignments',
					userLabelName: '',
					labelCode: '',
					visible: false,
					enterStop: false,
				},
				{
					groupId: 'userDefText',
					label: 'User-Defined Texts',
					userLabelName: 'User Texts',
					labelCode: '',
					visible: false,
					enterStop: false,
				},
			],
			rows: [
				{
					groupId: 'basicData',
					rowId: 'code',
					label: 'Code',
					userLabelName: '',
					labelCode: '',
					visible: true,
					enterStop: true,
					fraction: true,
				},
				{
					groupId: 'basicData',
					rowId: 'description',
					label: 'Description',
					userLabelName: '',
					labelCode: '',
					visible: true,
					enterStop: true,
					fraction: true,
				},
				/////
				{
					groupId: 'assignments',
					rowId: 'costcodeportionsfk',
					label: 'Cost Portions',
					userLabelName: '',
					labelCode: '',
					visible: false,
					enterStop: true,
					fraction: false,
				},
				{
					groupId: 'assignments',
					rowId: 'costgroupportionsfk',
					label: 'Cost Group Portions',
					userLabelName: '',
					labelCode: '',
					visible: false,
					enterStop: true,
					fraction: false,
				},
				/////
				{
					groupId: 'userDefText',
					rowId: 'userdefined1',
					label: 'Text 1',
					userLabelName: '',
					labelCode: '',
					visible: true,
					enterStop: true,
					fraction: false,
				},
				{
					groupId: 'userDefText',
					rowId: 'userdefined2',
					label: 'Text 2',
					userLabelName: '',
					labelCode: '',
					visible: false,
					enterStop: true,
					fraction: false,
				},
			],
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
			selectedItem: 'costcodeportionsfk'
		};

		const data = await this.formConfigDialogSvc.show(options);

		console.log(data);
	}
}
