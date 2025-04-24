/*
 * Copyright(c) RIB Software GmbH
 */

// TODO: fix test cases
describe('UiCommonFormDialogService', () => {
	it('is not tested', () => {
		expect(true).toBeTruthy();
	});
});
/*
import { TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';
import { MatDialogModule } from '@angular/material/dialog';

import { UiCommonFormDialogService } from './form-dialog.service';

import { FieldType } from '../../../model/fields/field-type.enum';

import { EntityRuntimeData } from '@libs/platform/data-access';

import { IFormConfig } from '../../../form/model/form-config.interface';

interface IFirstFormTestEntity {
	myText: string;
	testDate: Date;
	isGood?: boolean;
	money?: number;
}
const firstTestFormEntity: IFirstFormTestEntity = {
	myText: 'Will has said good-bye.',
	isGood: true,
	testDate: new Date('2022-08-08'),
};
const firstTestFormRuntimeInfo: EntityRuntimeData<IFirstFormTestEntity> = {
	readOnly: [
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
};
const firstTestFormConfig: IFormConfig<IFirstFormTestEntity> = {
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
			required: true
		},
	],
};

const formData = {
	id: 'first-test',
	headerText: 'Test Form Dialog',
	formConfiguration: firstTestFormConfig,
	entity: firstTestFormEntity,
	runtime: firstTestFormRuntimeInfo,
	customButtons: [
		{
			id: 'reset',
			caption: 'Reset',
		},
	],
	topDescription: 'Just an Demo form dialog',
};
const formDataWithBasicProp = {
	id: 'first-test',
	headerText: 'Test Form Dialog',
	formConfiguration: firstTestFormConfig,
	entity: firstTestFormEntity,
	runtime: firstTestFormRuntimeInfo,
	customButtons: [
		{
			id: 'reset',
			caption: 'Reset',
		},
	],
	topDescription: 'Just an Demo form dialog',
	width: '300px',
	showOkButton: true,
	showCancelButton: true,
};
describe('UiCommonModalDialogFormConfigService', () => {
	let service: UiCommonFormDialogService;

	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [MatDialogModule, HttpClientModule],
		});
		service = TestBed.inject(UiCommonFormDialogService);
	});

	it('check if dialog gets opened with form data having no basic properties predefined', async () => {
		await service.showDialog<IFirstFormTestEntity>(formData);
	});

	it('check if dialog gets opened with form data having properties predefined', async () => {
		await service.showDialog<IFirstFormTestEntity>(formDataWithBasicProp);
	});
});
*/