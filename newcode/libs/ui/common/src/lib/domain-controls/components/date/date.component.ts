/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { AfterViewChecked, Component, ElementRef, ViewChild, inject } from '@angular/core';
import { DateAdapter } from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';

import { format, getYear, parse } from 'date-fns';

import { DatepickerComponent } from './datepicker/datepicker.component';
import { DomainControlBaseComponent } from '../domain-control-base/domain-control-base.component';

import { UiCommonDatePickerConverterService } from '../../services/date-picker-converter.service';
import { DateConfigInjectionToken } from '../../model/date-config.interface';
import { IControlContext } from '../../model/control-context.interface';

@Component({
	selector: 'ui-common-date',
	templateUrl: './date.component.html',
	styleUrls: ['./date.component.css'],
})

/**
 * Date input domain control where user can select and enter date.
 */
export class DateComponent extends DomainControlBaseComponent<Date, IControlContext<Date>> implements AfterViewChecked {
	/**
	 * Represent the date input element refrence object
	 */
	@ViewChild('dateInput', { static: false }) public dateInput!: ElementRef;
	public formattedDate!: string;

	/**
	 * Initializes a new instance.
	 * @param controlContext The control context used to create the component.
	 */

	public constructor() {
		super();
		this.dateConverterService.utcMode = this.editorConfig.type.includes('utc');
		this.dateAdapter.setLocale(this.getFormat());
	}

	/**
	 * Used to inject DatePickerConverterService
	 */
	public readonly dateConverterService = inject(UiCommonDatePickerConverterService);

	/**
	 * The editor options the component is initialized with.
	 */
	public readonly editorConfig = inject(DateConfigInjectionToken);

	/**
	 * Used to inject MatDialog
	 */
	public readonly dialog = inject(MatDialog);

	/**
	 * Used to inject DateAdapter
	 */
	public readonly dateAdapter = inject(DateAdapter<Date>);

	/**
	 * Used to format value in 'dd/MM/yyyy' format in input field only once value changed.
	 */
	public ngAfterViewChecked() {
		if (this.controlContext.value && typeof this.controlContext.value !== 'string') {
			this.dateInput.nativeElement.value = format(this.controlContext.value, 'dd/MM/yyyy');
		}
	}

	/**
	 * This function used for the get the format
	 */
	private getFormat() {
		//todo get local from userSettings
		return 'en-GB';
	}

	/**
	 * Used to open mat-calendar from DatepickerComponent for selecting date.
	 */
	public openDialog() {
		const dialogRef = this.dialog.open(DatepickerComponent, {
			data: { selectedDate: this.controlContext.value },
			width: '250px',
		});

		dialogRef.afterClosed().subscribe((result: Date) => {
			if (result !== undefined) {
				const convertedDate = this.dateConverterService.formatInputDate(result);
				this.controlContext.value = convertedDate;
			}
		});
	}

	/**
	 * Used to get date value from input field and format date based on date or dateutc input domain type.
	 */
	public onInputDate() {
		const inputValue = this.dateInput.nativeElement.value;
		const parsedDate = parse(inputValue, 'dd/MM/yyyy', new Date());
		const formattedDate = this.formatInputDateYear(parsedDate);
		const convertedDate = this.dateConverterService.formatInputDate(formattedDate);

		if (typeof convertedDate !== 'undefined') {
			this.dateConverterService.setSelectedDate(convertedDate);
		}
		this.controlContext.value = convertedDate;
	}

	/**
	 * Function converts user input date with wrong year format with valid
	 * year and return formatted date with valid format.
	 * @param {Date} parsedDate user input date
	 * @returns {Date} formatted Date in 'dd/MM/yyyy' format
	 */
	public formatInputDateYear(parsedDate: Date): Date {
		const currentYear = getYear(new Date());
		const parsedYear = getYear(parsedDate);
		if (parsedYear < 100) {
			const centuryThreshold = (currentYear % 100) + 10;
			const adjustedyear = parsedYear + (parsedYear < centuryThreshold ? currentYear - (currentYear % 100) : currentYear - (currentYear % 100) - 100);
			parsedDate.setFullYear(adjustedyear);
		}
		return parsedDate;
	}
}
