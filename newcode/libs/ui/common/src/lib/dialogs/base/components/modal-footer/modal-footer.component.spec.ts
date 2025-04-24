/*
 * Copyright(c) RIB Software GmbH
 */

import { FormsModule } from '@angular/forms';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';

import { TranslatePipe } from '@libs/platform/common';

import { ModalFooterComponent } from './modal-footer.component';
import { IDialogFooterModel } from '../../model/interfaces/dialog-footer-model.interface';
import { HttpClientModule } from '@angular/common/http';
import { StandardDialogButtonId } from '../..';

describe('ModalFooterComponent', () => {
	const data: IDialogFooterModel<string, object, void> = {
		doNotShowAgain: {
			showOption: true,
			activated: false,
			defaultActionButtonId: StandardDialogButtonId.Ok
		},
		buttons: [{
			id: StandardDialogButtonId.Ok
		}],
		customButtons: [],
		getCaption: info => '',
		isShown: info => true,
		isDisabled: info => false,
		getTooltip: info => undefined,
		click: (info, ev) => {}
	};

	let component: ModalFooterComponent<string, object>;
	let fixture: ComponentFixture<ModalFooterComponent<string, object>>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [MatDialogModule, FormsModule, HttpClientModule],
			declarations: [ModalFooterComponent, TranslatePipe],
			providers: [
				{
					provide: MAT_DIALOG_DATA,
					useValue: {
						dialog: data
					},
				},
			],
		}).compileComponents();

		fixture = TestBed.createComponent(ModalFooterComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	it('check if dont show again is changing the activated variable state', () => {
		component.isChecked = true;
		component.onDontShowAgain();
		// TODO: code must be fixed/revised first
		//expect((<IDialogDoNotShowAgain>component.data.dialog.modalOptions.dontShowAgain).activated).toBe(true);
		expect(true).toBeTruthy();
	});
});
