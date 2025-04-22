/**
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { Component, inject } from '@angular/core';

import { DomainControlBaseComponent } from '../domain-control-base/domain-control-base.component';

import { PlatformDateService } from '@libs/platform/common';

import { ITimeControlContext } from '../../model/time-control-context.interface';
import { TimeConfigInjectionToken } from '../../model/time-config.interface';


/**
 * TimeUtc and Time domain control functionality.
 */
@Component({
	selector: 'ui-common-time',
	templateUrl: './time.component.html',
	styleUrls: ['./time.component.scss'],
})
export class TimeComponent extends DomainControlBaseComponent<Date, ITimeControlContext> {
	/**
	 * To store boolean value according to time type.
	 */
	private isUtc: boolean;

	/**
	 * PlatformDateService instance.
	 */
	private dateService = inject(PlatformDateService);

	/**
	 * The time config the component is initialized with.
	 */
	public readonly timeConfig = inject(TimeConfigInjectionToken);

	/**
	 * Time Format.
	 */
	private timeFormat!: string;

	/**
	 * Check time type and Time format
	 */
	public constructor() {
		super();
		this.isUtc = this.timeConfig.type.includes('utc') ? true : false;
		this.timeFormat = this.controlContext.options.format ?? 'HH:mm';
	}

	/**
	 * Get the time value into the local time format
	 */
	public get value(): string {
		if (this.controlContext.value) {
			let localDate: string | Date = this.controlContext.value;
			if (this.isUtc) {
				localDate = this.dateService.formatUTC(this.controlContext.value, 'yyyy-MM-dd HH:mm:ss');
			}

			return this.dateService.formatLocal(localDate, this.timeFormat);
		}

		return '';
	}

	/**
	 * Set the input time value in utcTime and local time as per the time type
	 * @param timeRawValue {string | undefined} input time value
	 */
	public set value(timeRawValue: string | undefined) {
		if (timeRawValue && timeRawValue.length) {
			if (timeRawValue && timeRawValue.length) {
				const inputTimeParts = timeRawValue.split(':');
				const currentDateTime = new Date();
				const hours = parseInt(inputTimeParts[0]);
				const minutes = parseInt(inputTimeParts[1]);
			
				if (this.isUtc) {
					currentDateTime.setUTCHours(hours);
					currentDateTime.setUTCMinutes(minutes);
					currentDateTime.setUTCSeconds(0);
					currentDateTime.setUTCMilliseconds(0);
				} else {
					currentDateTime.setHours(hours);
					currentDateTime.setMinutes(minutes);
					currentDateTime.setSeconds(0);
					currentDateTime.setMilliseconds(0);
				}
				this.controlContext.value = currentDateTime;
			}
		}
	}
}
