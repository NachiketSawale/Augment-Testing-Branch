/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { DateAdapter } from '@angular/material/core';
import { By } from '@angular/platform-browser';

import { DateComponent } from './date.component';

import { ControlContextInjectionToken, IControlContext } from '../../model/control-context.interface';

import { UiCommonDatePickerConverterService } from '../../services/date-picker-converter.service';
import { FieldType } from '../../../model/fields';
import { DateConfigInjectionToken, IDateConfig } from '../../model/date-config.interface';
import { parse } from 'date-fns';

describe('DateComponent', () => {
	let component: DateComponent;
	let fixture: ComponentFixture<DateComponent>;
	beforeEach(async () => {
		const ctlCtx: IControlContext = {
			fieldId: 'Date',
			readonly: false,
			value: new Date(),
			validationResults: [],
			entityContext: { totalCount: 0 }
		};

		const dateConfig: IDateConfig = {
			type: FieldType.Date
		};

		await TestBed.configureTestingModule({
			imports: [MatDialogModule],
			declarations: [DateComponent],
			providers: [
				{ provide: ControlContextInjectionToken, useValue: ctlCtx },
				{ provide: DateConfigInjectionToken, useValue: dateConfig },
				MatDialog,
				DateAdapter,
				UiCommonDatePickerConverterService

			]
		})
			.compileComponents();

		fixture = TestBed.createComponent(DateComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	it('should call onInputDate', () => {
		const inputElement = fixture.debugElement.query(By.css('input')).nativeElement;
		jest.spyOn(component, 'onInputDate');
		inputElement.value = '7/29/23';
		inputElement.dispatchEvent(new Event('change'));
		fixture.detectChanges();
		expect(component.onInputDate).toHaveBeenCalled();

	});

	it('should call openDilog', () => {
		const buttonElement = fixture.debugElement.query(By.css('button')).nativeElement;
		jest.spyOn(component, 'openDialog');
		buttonElement.click();
		fixture.detectChanges();
		expect(component.openDialog).toHaveBeenCalled();

	});

	it('should call formatInputDate', () => {
		const inputDate = parse('12/10/23', 'dd/MM/yyyy', new Date());
		component.formatInputDateYear(inputDate);

	});
});
