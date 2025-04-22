import { Meta, moduleMetadata } from '@storybook/angular';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { FormsModule } from '@angular/forms';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { zonedTimeToUtc } from 'date-fns-tz';

import { DateComponent } from './date.component';
import { DatepickerComponent } from './datepicker/datepicker.component';

import { ControlContextInjectionToken, IControlContext } from '../../model/control-context.interface';

import { UiCommonDatePickerConverterService } from '../../services/date-picker-converter.service';
import { DateConfigInjectionToken, IDateConfig } from '../../model/date-config.interface';
import { FieldType } from '../../../model/fields';


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

export default {
    title: 'DateComponent',
    component: DateComponent,
    decorators: [
        moduleMetadata({
            imports: [MatDialogModule, MatDatepickerModule, MatNativeDateModule, FormsModule,
                MatButtonToggleModule,
                MatCardModule,
                MatIconModule,
                MatButtonModule,
                MatDialogModule,],
            declarations: [DatepickerComponent],
            providers: [
                { provide: ControlContextInjectionToken, useValue: ctlCtx },
                { provide: DateConfigInjectionToken, useValue: dateConfig },
                MatDialog,
                UiCommonDatePickerConverterService
            ],
        }),
    ],
} as Meta<DateComponent>;

const data = {
    value: new Date('09/23/2023')

};
export const DateDomainControl = {
    render: (args: DateComponent) => ({
        props: args,
    }),
    args: {
        controlContext: data
    },
};

const utcData = {
    value: zonedTimeToUtc(new Date('09/23/2023'), 'UTC')

};
export const DateUTCDomainControl = {
    render: (args: DateComponent) => ({
        props: args,
    }),
    args: {
        controlContext: utcData
    },
};
