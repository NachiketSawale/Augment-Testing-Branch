/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatNativeDateModule } from '@angular/material/core';
import { MatCalendar, MatDatepickerInputEvent, MatDatepickerModule } from '@angular/material/datepicker';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { By } from '@angular/platform-browser';

import { DatepickerComponent } from './datepicker.component';

import { UiCommonDatePickerConverterService } from '../../../services/date-picker-converter.service';


describe('DatepickerComponent', () => {
	let component: DatepickerComponent;
	let fixture: ComponentFixture<DatepickerComponent>;

	beforeEach(async () => {
		const data: Date = new Date();
		await TestBed.configureTestingModule({
			imports: [MatCardModule, MatDatepickerModule, MatNativeDateModule, MatButtonModule, MatButtonToggleModule, MatDialogModule],
			declarations: [DatepickerComponent],
			providers: [
				{ provide: MAT_DIALOG_DATA, useValue: data },
				{ provide: MatDialogRef, useValue: DatepickerComponent },
				UiCommonDatePickerConverterService

			]
		}).compileComponents();

		fixture = TestBed.createComponent(DatepickerComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	it('should call getToday', () => {
		const buttonElement = fixture.debugElement.query(By.css('#todayBtn')).nativeElement;
		jest.spyOn(component, 'goToday');
		buttonElement.click();
		fixture.detectChanges();
		expect(component.goToday).toHaveBeenCalled();

	});

	it('should call deleteDate', () => {
		const buttonElement = fixture.debugElement.query(By.css('#deleteBtn')).nativeElement;
		jest.spyOn(component, 'deleteDate');
		buttonElement.click();
		fixture.detectChanges();
		expect(component.deleteDate).toHaveBeenCalled();

	});

	it('should call onSelect', () => {
		const matCalendar = fixture.debugElement.query(By.directive(MatCalendar));
		const matCalendarInstance = matCalendar.injector.get(MatCalendar);
		jest.spyOn(component, 'onSelect');
		const selectedDate = new Date();
		const event = { value: selectedDate } as MatDatepickerInputEvent<Date>;
		matCalendarInstance.selectedChange.emit(event);
		fixture.detectChanges();
		expect(component.onSelect).toHaveBeenCalled();

	});
});
