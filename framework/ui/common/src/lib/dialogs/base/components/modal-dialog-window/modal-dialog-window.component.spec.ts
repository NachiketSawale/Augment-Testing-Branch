/*
 * Copyright(c) RIB Software GmbH
 */

// TODO: rewrite unit tests or remove file
describe('ModalDialogWindowComponent', () => {
	it('is not tested', () => {
		expect(true).toBeTruthy();
	});
});
/*
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';

import { UiCommonModalDialogWindowComponent } from './modal-dialog-window.component';

import { UiCommonModalBodyComponent } from '../modal-body/modal-body.component';
import { UiCommonModalHeaderComponent } from '../modal-header/modal-header.component';
import { UiCommonModalFooterComponent } from '../modal-footer/modal-footer.component';
import { UiCommonAlarmOverlayComponent } from '../alarm-overlay/alarm-overlay.component';
import { UiCommonErrorDialogComponent } from '../dialog-templates/error-dialog/error-dialog.component';

import { TranslatePipe } from '@libs/platform/common';

import { UiCommonModalDialogBase } from '../../model/classes/modal-dialog-base.class';

import { IDialogData } from '../../model/interfaces/dialog-data-interface';
import { IDialogError } from '../../model/interfaces/dialog-error.interface';

describe('ModalDialogWindowComponent', () => {
	const data: IDialogData<IDialogError> = {
		dialog: {
			modalOptions: {
				bodyComponent: UiCommonErrorDialogComponent,
			},
			onReturnButtonPress: (event: Event) => {},
		} as UiCommonModalDialogBase,
		dataItem: {
			exception: {
				errorCode: 1,
				errorVersion: '2.2',
				errorMessage: 'dummy',
				errorDetail: 'dummy',
				detailStackTrace: '',
				detailMethod: '',
			},
		},
	};
	let component: UiCommonModalDialogWindowComponent;
	let fixture: ComponentFixture<UiCommonModalDialogWindowComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [MatDialogModule, HttpClientModule, CommonModule],
			declarations: [UiCommonModalDialogWindowComponent, UiCommonModalBodyComponent, UiCommonModalHeaderComponent, UiCommonModalFooterComponent, TranslatePipe, UiCommonAlarmOverlayComponent, UiCommonErrorDialogComponent],
			providers: [
				{
					provide: MAT_DIALOG_DATA,
					useValue: data,
				},
			],
		}).compileComponents();

		fixture = TestBed.createComponent(UiCommonModalDialogWindowComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
*/