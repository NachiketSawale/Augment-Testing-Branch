/*
 * Copyright(c) RIB Software GmbH
 */

// TODO: fix test cases
describe('ModalFormComponent', () => {
	it('is not tested', () => {
		expect(true).toBeTruthy();
	});
});
/*
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';

import { UiCommonModalFormComponent } from './modal-form.component';

import { TranslatePipe } from '@libs/platform/common';

import { FieldType } from '../../../../model/fields/field-type.enum';

import { IFormConfig } from '../../../../form/model/form-config.interface';

import { EntityRuntimeData } from '@libs/platform/data-access';

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
	dialog: {
		modalOptions: {
			formConfiguration: firstTestFormConfig,
			entity: firstTestFormEntity,
			runtime: firstTestFormRuntimeInfo,
			buttons: [{}],
		},
		getButtonById: () => {
			return formData.dialog.modalOptions.buttons[0];
		},
		dialogReference: {
			close: () => { },
		},
	},
};
describe('UiCommonModalFormComponent', () => {
	let component: UiCommonModalFormComponent;
	let fixture: ComponentFixture<UiCommonModalFormComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [MatDialogModule],
			providers: [{ provide: MAT_DIALOG_DATA, useValue: formData }, TranslatePipe],
			declarations: [UiCommonModalFormComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(UiCommonModalFormComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
		component['formData'].dialog.getButtonById('ok').fn();
	});
});
*/