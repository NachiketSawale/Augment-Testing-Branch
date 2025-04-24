/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';

@Injectable({
	providedIn: 'root',
})
export class ServicesSchedulerUiStatusNotificationConfigService {

	/**
	 * Interval to fetch Id's state.
	 */
	public readonly pollingInterval = 15000;
}
