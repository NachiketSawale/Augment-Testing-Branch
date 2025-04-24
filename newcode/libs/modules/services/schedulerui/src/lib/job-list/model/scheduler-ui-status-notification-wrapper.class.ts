/*
 * Copyright(c) RIB Software GmbH
 */
import { Observer, Subject, Subscription } from 'rxjs';
import { ISchedulerUiJobData } from '@libs/services/interfaces';
import { ISchedulerUiJobInfo } from './entities/scheduler-ui-status-notification-job-info.interface';

/**
 * Handles the subscription count info for the specific id when multiple subscription for similar id.
 */
export class SchedulerUiStatusNotificationWrapper<T extends ISchedulerUiJobData = ISchedulerUiJobData> {
	private subject: Subject<T>;
	private subscriptionCount = 0;

	public constructor(
		private id: number,
		private watchedJobs: Record<string | number, ISchedulerUiJobInfo>,
	) {
		this.subject = new Subject<T>();
	}

	public subscribe(observer: ((value: T) => void) | Partial<Observer<T>>): Subscription {
		//Increase the count when subscribed.
		this.subscriptionCount++;
		const subscription = this.subject.subscribe(observer);
		//Reduce the count when unsubscribed.
		subscription.add(() => {
			this.subscriptionCount--;
			//Remove Job id when subscriptionCount is zero.
			if (this.subscriptionCount === 0) {
				delete this.watchedJobs[this.id];
			}
		});
		return subscription;
	}

	public next(value: T): void {
		this.subject.next(value);
	}
}
