/*
 * Copyright(c) RIB Software GmbH
 */

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { INPUT_DLG_OPTIONS_TOKEN, ModalBodyInputComponent } from './modal-body-input.component';

import { IInputDialogOptions } from '../../model/input-dialog-options.interface';
import {
	ICustomDialog,
	getCustomDialogDataToken
} from '../../../base';

describe('ModalBodyInputComponent', () => {
	let component: ModalBodyInputComponent;
	let fixture: ComponentFixture<ModalBodyInputComponent>;

	beforeEach(async () => {
		const inputDlgOptions: IInputDialogOptions = {};
		const customDlgWrapper: ICustomDialog<string, ModalBodyInputComponent> = {
			value: '',
			get body(): ModalBodyInputComponent {
				return component;
			},
			close() {
			}
		};

		await TestBed.configureTestingModule({
			imports: [CommonModule, FormsModule],
			declarations: [ModalBodyInputComponent],
			providers: [{
				provide: INPUT_DLG_OPTIONS_TOKEN,
				useValue: inputDlgOptions
			}, {
				provide: getCustomDialogDataToken<string, ModalBodyInputComponent>(),
				useValue: customDlgWrapper
			}]
		}).compileComponents();

		fixture = TestBed.createComponent(ModalBodyInputComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
describe('ModalBodyInputComponent with input pattern', () => {
	let component: ModalBodyInputComponent;
	let fixture: ComponentFixture<ModalBodyInputComponent>;

	beforeEach(async () => {
		const inputDlgOptions: IInputDialogOptions = {
			maxLength: 20,
			pattern: '[a - zA - Z] *'
		};
		const customDlgWrapper: ICustomDialog<string, ModalBodyInputComponent> = {
			value: '',
			get body(): ModalBodyInputComponent {
				return component;
			},
			close() {
			}
		};

		await TestBed.configureTestingModule({
			imports: [CommonModule, FormsModule],
			declarations: [ModalBodyInputComponent],
			providers: [{
				provide: INPUT_DLG_OPTIONS_TOKEN,
				useValue: inputDlgOptions
			}, {
				provide: getCustomDialogDataToken<string, ModalBodyInputComponent>(),
				useValue: customDlgWrapper
			}]
		}).compileComponents();

		fixture = TestBed.createComponent(ModalBodyInputComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
