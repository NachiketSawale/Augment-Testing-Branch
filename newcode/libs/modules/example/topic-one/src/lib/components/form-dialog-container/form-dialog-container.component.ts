/*
 * Copyright(c) RIB Software GmbH
 */

import { Component, inject } from '@angular/core';

import { ContainerBaseComponent } from '@libs/ui/container-system';

import { StandardDialogButtonId, UiCommonFormDialogService } from '@libs/ui/common';

import { FieldType } from '@libs/ui/common';

import { IFormConfig } from '@libs/ui/common';
import { IEditorDialogResult } from '@libs/ui/common';
import { EntityRuntimeData } from '@libs/platform/data-access';

/**
 * Demo first form entity interface.
 */
interface IFirstFormTestEntity {
	myText: string;
	testDate: Date;
	isGood?: boolean;
	money?: number;
}

/**
 * Demo second form entity interface.
 */
interface ISecondFormTestEntity {
	name?: string;
	age?: number;
	isOld?: boolean;
}

/**
 * Demo Component to demonstarte form dialog.
 */
@Component({
	selector: 'example-topic-one-form-dialog',
	templateUrl: './form-dialog-container.component.html',
	styleUrls: ['./form-dialog-container.component.scss'],
})
export class FormDialogContainerComponent extends ContainerBaseComponent {
	/**
	 * Demo first form controls data.
	 */
	private firstTestFormEntity: IFirstFormTestEntity = {
		myText: 'Will has said good-bye.',
		isGood: true,
		testDate: new Date('2022-08-08'),
	};

	/**
	 * Demo second form controls data.
	 */
	private secondTestFormEntity: ISecondFormTestEntity = {
		name: 'RIB',
	};

	/**
	 * Demo first form runtime data.
	 */
	private firstTestFormRuntimeInfo: EntityRuntimeData<IFirstFormTestEntity> = {
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
					error: 'I dont like this!',
				},
			},
		],
		entityIsReadOnly: false,
	};

	/**
	 * Demo second form runtime data.
	 */
	private secondTestFormRuntimeInfo: EntityRuntimeData<ISecondFormTestEntity> = {
		readOnlyFields: [
			{
				field: 'isOld',
				readOnly: true,
			},
		],
		validationResults: [],
		entityIsReadOnly: false,
	};

	/**
	 * Demo first form configuration data.
	 */
	private firstTestFormConfig: IFormConfig<IFirstFormTestEntity> = {
		formId: 'first-test-form',
		showGrouping: true,
		groups: [
			{
				groupId: 'default',
				header: { text: 'Default Group' },
			},
		],
		rows: [
			{
				groupId: 'default',
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
				groupId: 'default',
				id: 'isGood',
				label: {
					text: 'It is good',
				},
				type: FieldType.Boolean,
				model: 'isGood',
				sortOrder: 5,
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
				id: 'date',
				label: {
					text: 'Please choose a date',
				},
				type: FieldType.Date,
				model: 'testDate',
				sortOrder: 8,
				required: true,
			},
		],
	};

	/**
	 * Demo second form configuration data.
	 */
	private secondTestFormConfig: IFormConfig<ISecondFormTestEntity> = {
		formId: 'second-test-form',
		showGrouping: true,
		groups: [
			{
				groupId: 'organization',
				header: { text: 'Organization' },
			},
		],
		rows: [
			{
				groupId: 'organization',
				id: 'name',
				label: {
					text: 'Name',
				},
				type: FieldType.Description,
				model: 'name',
				sortOrder: 2,
				required: true,
			},
			{
				groupId: 'organization',
				id: '',
				label: {
					text: 'Is Old',
				},
				type: FieldType.Boolean,
				model: 'isOld',
				sortOrder: 5,
			},
			{
				groupId: 'organization',
				id: 'age',
				label: {
					text: 'Age',
				},
				type: FieldType.Integer,
				minValue: 10,
				model: 'age',
				sortOrder: 7,
				required: true,
			},
		],
	};

	/**
	 * Dialog form config service.
	 */
	private formDialogService = inject(UiCommonFormDialogService);

	/**
	 * Method opens the form dialog.
	 */
	public async openFirstTestForm() {
		const result = await this.formDialogService.showDialog<IFirstFormTestEntity>({
			id: 'first-test',
			headerText: 'Test Form Dialog',
			formConfiguration: this.firstTestFormConfig,
			entity: this.firstTestFormEntity,
			runtime: this.firstTestFormRuntimeInfo,
			buttons: [
				{
					id: StandardDialogButtonId.Ok,
					caption: { key: 'cloud.common.ok' },
					fn: (event, info) => {
						console.log(info);
					},
					isDisabled: (info) => {
						return false;
					},
					autoClose: true,
				},
			],
			customButtons: [
				{
					id: 'reset',
					caption: 'Reset',
					fn: (event, info) => {
						if (info.dialog.runtime) {
							//Just a demo implementation.
							info.dialog.runtime = {
								entityIsReadOnly: info.dialog.runtime.entityIsReadOnly,
								validationResults: [...info.dialog.runtime.validationResults],
								readOnlyFields: [
									{
										field: 'money',
										readOnly: true,
									},
								],
							};
						}
					},
					isDisabled: (info) => {
						return !info.dialog.value?.money;
					},
				},
			],
			topDescription: 'Just a Demo form dialog',
		});
		// TODO: here (and elsewhere) use constant
		if (result?.closingButtonId === StandardDialogButtonId.Ok) {
			this.handleOk(result);
		} else {
			this.handleCancel(result);
		}
	}

	/**
	 * Method opens the form dialog.
	 */
	public async openSecondTestForm() {
		const result = await this.formDialogService.showDialog<ISecondFormTestEntity>({
			id: 'first-test',
			headerText: 'Test Form Dialog',
			formConfiguration: this.secondTestFormConfig,
			entity: this.secondTestFormEntity,
			runtime: this.secondTestFormRuntimeInfo,
			customButtons: [
				{
					id: 'reset',
					caption: 'Reset',
					fn: (event, info) => {
						info.dialog.value = {
							name: '',
							isOld: false,
							age: 0,
						};
					},
					isDisabled: (info) => {
						return !info.dialog.value?.age;
					},
				},
			],
			topDescription: 'Just a Demo form dialog',
		});
		if (result?.closingButtonId === StandardDialogButtonId.Ok) {
			this.handleOk(result);
		} else {
			this.handleCancel(result);
		}
	}

	/**
	 * Method handles 'Ok' button functionality.
	 *
	 * @param {IFormDialogResultInterface<IFirstFormTestEntity | ISecondFormTestEntity>} result Dialog result.
	 */
	private handleOk(result: IEditorDialogResult<IFirstFormTestEntity | ISecondFormTestEntity>): void {
		//TODO:Operations to be carried out on ok click.
		console.log(result);
	}

	/**
	 * Method handles 'Cancel' button functionality.
	 *
	 * @param {IFormDialogResultInterface<IFirstFormTestEntity | ISecondFormTestEntity>} result Dialog result.
	 */
	private handleCancel(result?: IEditorDialogResult<IFirstFormTestEntity | ISecondFormTestEntity>): void {
		//TODO:Operations to be carried out on ok click.
		console.log(result);
	}
}
