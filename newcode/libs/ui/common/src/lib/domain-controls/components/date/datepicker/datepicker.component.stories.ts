import { Meta, componentWrapperDecorator, moduleMetadata } from '@storybook/angular';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

import { zonedTimeToUtc } from 'date-fns-tz';

import { DatepickerComponent } from './datepicker.component';

import { UiCommonDatePickerConverterService } from '../../../services/date-picker-converter.service';


const data: Date = new Date();
export default {
    title: 'DatepickerComponent',
    component: DatepickerComponent,
    decorators: [
        moduleMetadata({
            imports: [MatCardModule, MatDatepickerModule, MatNativeDateModule, MatButtonModule, MatButtonToggleModule, MatDialogModule,
                MatIconModule,
            ],
            declarations: [],
            providers: [
                { provide: MAT_DIALOG_DATA, useValue: data },
                { provide: MatDialogRef, useValue: DatepickerComponent },
                UiCommonDatePickerConverterService
            ],
        }),
        componentWrapperDecorator((story) => `<div style="width: 350px">${story}</div>`),
    ],
} as Meta<DatepickerComponent>;

export const selectedDateInDateFormat = {
    render: (args: DatepickerComponent) => ({
        props: args,
    }),
    args: {
        selectedDate: new Date()
    },
};



export const selectedDateInDateUtcFormat = {
    render: (args: DatepickerComponent) => ({
        props: args,
    }),
    args: {
        selectedDate: zonedTimeToUtc(new Date(), 'UTC'),
    },
};
