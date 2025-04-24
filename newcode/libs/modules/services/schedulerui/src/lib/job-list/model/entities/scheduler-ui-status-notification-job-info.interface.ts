/*
 * Copyright(c) RIB Software GmbH
 */

import { SchedulerUiStatusNotificationWrapper } from '../scheduler-ui-status-notification-wrapper.class';

/**
 * Reference data of the specific id.
 */
export interface ISchedulerUiJobInfo {
	/**
	 * Id for job.
	 */
	id: number;

	/**
	 * Previous job state.
	 */
	lastState: number | null;

	/**
	 * Handler for the id.
	 */
	subjectHandler: SchedulerUiStatusNotificationWrapper;
}