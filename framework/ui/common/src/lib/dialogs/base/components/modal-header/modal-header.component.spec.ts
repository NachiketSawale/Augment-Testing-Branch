/*
 * Copyright(c) RIB Software GmbH
 */

import { HttpClientModule } from '@angular/common/http';

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';

import { TranslatePipe } from '@libs/platform/common';

import { ModalHeaderComponent } from './modal-header.component';

import { IDialogHeaderModel } from '../../model/interfaces/dialog-header-model.interface';

describe('ModalHeaderComponent with header', () => {
	let component: ModalHeaderComponent;
	let fixture: ComponentFixture<ModalHeaderComponent>;
	const data: IDialogHeaderModel = {
		cancel: () => {},
		headerText: 'title'
	};
	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [MatDialogModule, HttpClientModule],
			declarations: [ModalHeaderComponent, TranslatePipe],
			providers: [
				{
					provide: MAT_DIALOG_DATA,
					useValue: {
						dialog: data
					},
				},
			],
		}).compileComponents();

		fixture = TestBed.createComponent(ModalHeaderComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});

describe('ModalHeaderComponent without header', () => {
	let component: ModalHeaderComponent;
	let fixture: ComponentFixture<ModalHeaderComponent>;
	const data: IDialogHeaderModel = {
		cancel() {
		},
		headerText: 'title'
	};
	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [MatDialogModule, HttpClientModule],
			declarations: [ModalHeaderComponent, TranslatePipe],
			providers: [
				{
					provide: MAT_DIALOG_DATA,
					useValue: {
						dialog: data
					},
				},
			],
		}).compileComponents();

		fixture = TestBed.createComponent(ModalHeaderComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
