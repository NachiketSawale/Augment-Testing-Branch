/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, Input, ViewChild, ViewEncapsulation, inject } from '@angular/core';
import { MatCalendar } from '@angular/material/datepicker';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { UiCommonDatePickerConverterService } from '../../../services/date-picker-converter.service';

@Component({
	selector: 'ui-common-datepicker',
	exportAs: 'uiCommonDatepicker',
	styleUrls: ['./datepicker.component.scss'],
	templateUrl: './datepicker.component.html',
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush,
})

/**
 * Date-picker component which displays mat-calendar for selecting date
 */
export class DatepickerComponent implements AfterViewInit {
	/**
	 * Used to store selected date from calendar.
	 */
	@Input()
	public selectedDate: Date | undefined | null;

	/**
	 * Represent the mat-calendar element refrence object
	 */
	@ViewChild(MatCalendar, { static: false })
	public calendar: MatCalendar<Date> | undefined;

	/**
	 * Used for min date.
	 */
	public min: Date = new Date('1950/09/04');

	/**
	 * Used for start date.
	 */
	public start: Date = new Date('2020/09/04');

	public constructor(
		@Inject(MAT_DIALOG_DATA) public data: Date
	) {
	}

	/**
	 * Inject DatePickerConverterService
	 */
	public readonly dateConverterService = inject(UiCommonDatePickerConverterService);

	/**
	 * Used to inject matDialogRef
	 */
	public readonly dialogRef = inject(MatDialogRef<DatepickerComponent>);

	/**
	 * Used to inject ChangeDetectorRef
	 */
	public readonly cdRef = inject(ChangeDetectorRef);


	/**
	 * Marked input date as selected date once view initialize in mat-calendar.
	 */
	public ngAfterViewInit(): void {
		this.selectedDate = this.dateConverterService.getSelectedDateFromInput();
		this.setSelectedDate();
	}

	/**
	 * Used to get current date.
	 */
	public goToday() {
		this.selectedDate = new Date();
		this.dateConverterService.setSelectedDate(this.selectedDate);
		this.dialogRef.close(this.selectedDate);
	}

	/**
	 * Used to delete selected date.
	 */
	public deleteDate() {
		this.selectedDate = null;
		this.dialogRef.close(this.selectedDate);
	}

	/**
	 * Used to get selected date from mat-calendar and displayed in input field.
	 */
	public onSelect() {
		if (this.calendar) {
			this.selectedDate = this.calendar.activeDate;
			this.dateConverterService.setSelectedDate(this.selectedDate);
			this.dialogRef.close(this.selectedDate);
		}
	}

	/**
	 * Used to marked selected date as active date in mat-calendar.
	 */
	private setSelectedDate() {
		if (this.calendar) {
			this.calendar.activeDate = this.selectedDate ?? new Date();
		}
		this.cdRef.detectChanges();
	}


	/**
	 * Used to return selected date to dialog.
	 */
	public closeDialog() {
		this.dialogRef.close(this.selectedDate);
	}


}