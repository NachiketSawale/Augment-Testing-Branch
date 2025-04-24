/*
 * Copyright(c) RIB Software GmbH
 */

// TODO: rewrite unit tests or remove file
describe('ModalBodyCompnent', () => {
	it('is not tested', () => {
		expect(true).toBeTruthy();
	});
});
/*
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogModule, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { UiCommonSafeHtmlPipe } from '../../pipes/safe-html.pipe';
import { TranslatePipe } from '@libs/platform/common';

import { ModalBodyComponent } from './modal-body.component';
import { UiCommonAlarmOverlayComponent } from '../alarm-overlay/alarm-overlay.component';
import { DialogBodyDescriptionComponent } from '../dialog-body-description/dialog-body-description.component';

describe('ModalBodyComponent', () => {
	const data = {
		dialog: {
			alarm: 'copy to clipboard sucess',
			modalOptions: {
				bodyComponent: UiCommonErrorDialogComponent,
			},
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

	let component: ModalBodyComponent;
	let fixture: ComponentFixture<ModalBodyComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [ModalBodyComponent, UiCommonSafeHtmlPipe, TranslatePipe, UiCommonAlarmOverlayComponent, UiCommonModalBodyTopDescriptionComponent, UiCommonModalBodyBottomDescriptionComponent, UiCommonErrorDialogComponent],
			providers: [{ provide: MAT_DIALOG_DATA, useValue: data }],
			imports: [MatDialogModule, FormsModule, HttpClientModule, CommonModule],
		}).compileComponents();

		fixture = TestBed.createComponent(ModalBodyComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
*/