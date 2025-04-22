/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { MatDialogModule } from '@angular/material/dialog';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompositeComponent } from './composite.component';

import { FieldType } from '../../../model/fields';
import { ControlContextInjectionToken } from '../../model/control-context.interface';
import { IFileSelectControlResult, TranslatePipe } from '@libs/platform/common';

interface ITestEntityComposite {
	isValid?: boolean;
	isPresent?: boolean;
	dataFile?: IFileSelectControlResult;
	money?: number;
}

const controlContext = {
	fieldId: 'valid',
	readonly: false,
	validationResults: [],
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
	],
	owner: {
		entityRuntimeData: {
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
		},
	},
};

const controlContextWithEmptyComposite = {
	fieldId: 'valid',
	readonly: false,
	validationResults: [],
	composite: [],
	owner: {
		entityRuntimeData: {
			readOnly: [
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
		},
	},
};

describe('CompositeComponent', () => {
	let component: CompositeComponent<ITestEntityComposite>;
	let fixture: ComponentFixture<CompositeComponent<ITestEntityComposite>>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [HttpClientModule, FormsModule, MatDialogModule],
			declarations: [CompositeComponent, TranslatePipe],
			providers: [{ provide: ControlContextInjectionToken, useValue: controlContext }],
		}).compileComponents();

		fixture = TestBed.createComponent(CompositeComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});

describe('CompositeComponent with empty composite', () => {
	let component: CompositeComponent<ITestEntityComposite>;
	let fixture: ComponentFixture<CompositeComponent<ITestEntityComposite>>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [HttpClientModule, FormsModule, MatDialogModule],
			declarations: [CompositeComponent, TranslatePipe],
			providers: [{ provide: ControlContextInjectionToken, useValue: controlContextWithEmptyComposite }],
		}).compileComponents();

		fixture = TestBed.createComponent(CompositeComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
