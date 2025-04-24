/*
 * Copyright(c) RIB Software GmbH
 */

import { LazyInjectionToken } from '@libs/platform/common';
import { Observer, Subscription } from 'rxjs';

/**
 * Notification data.
 */
export interface ISchedulerUiJobData {
	/**
	 * Id for job.
	 */
	jobId: number;

	/**
	 * Job state(complete or inprogress).
	 */
	state: number | null;

	/**
	 * Is job in complete state.
	 */
	isFinal: boolean;
}

/**
 * Scheduler ui notification data.
 */
export interface ISchedulerUiStatusNotification {
	register(ids: number, observer: (value: ISchedulerUiJobData) => void): Subscription;
	register(ids: number[], observer: (value: ISchedulerUiJobData) => void): Subscription;
	register(ids: number, observer: Partial<Observer<ISchedulerUiJobData>>): Subscription;
	register(ids: number[], observer: Partial<Observer<ISchedulerUiJobData>>): Subscription;
	register(ids: number | Array<number>, observer: (value: ISchedulerUiJobData) => void | Partial<Observer<ISchedulerUiJobData>>): Subscription;
}

/**
 * Injection token to lazy load status notification.
 */
export const SCHEDULER_UI_STATUS_NOTIFICATION = new LazyInjectionToken<ISchedulerUiStatusNotification>('scheduler-ui-status-notification');
