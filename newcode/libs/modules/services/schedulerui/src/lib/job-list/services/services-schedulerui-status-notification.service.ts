/*
 * Copyright(c) RIB Software GmbH
 */
import { map } from 'lodash';
import { inject, Injectable } from '@angular/core';
import { LazyInjectable, PlatformHttpService } from '@libs/platform/common';
import { interval, Observer, startWith, Subscription, tap } from 'rxjs';
import { ISchedulerUiJobData, ISchedulerUiStatusNotification, SCHEDULER_UI_STATUS_NOTIFICATION } from '@libs/services/interfaces';
import { SchedulerUiStatusNotificationWrapper } from '../model/scheduler-ui-status-notification-wrapper.class';
import { ISchedulerUiJobInfo } from '../model/entities/scheduler-ui-status-notification-job-info.interface';
import { ServicesSchedulerUiStatusNotificationConfigService } from './status-notification-config.service';

/**
 * Response form the server for job ids.
 */
interface ISchedulerUiApiResponse {
	/**
	 * Id for job.
	 */
	j: number;

	/**
	 * Job state.
	 */
	s: number;
}

/**
 *  Manages event handlers that get notified when the status of a job changes.
 */

@Injectable({
	providedIn: 'root',
})
@LazyInjectable({
	token: SCHEDULER_UI_STATUS_NOTIFICATION,
	useAngularInjection: true,
})
export class ServicesScheduleruiStatusNotificationService implements ISchedulerUiStatusNotification {
	/**
	 * Job information
	 */
	private readonly watchedJobs: Record<string | number, ISchedulerUiJobInfo> = {};

	/**
	 * Supplies fixed configuration options to the service.
	 */
	private readonly config = inject(ServicesSchedulerUiStatusNotificationConfigService);

	/**
	 * Disposable resource for subscription.
	 */
	private pollingSubscription!: Subscription | null;

	/**
	 * Handles http request and response activity
	 */
	private readonly platformHttpService = inject(PlatformHttpService);

	/**
	 * Continously polls the data for job ids from server.
	 */
	private enablePolling(): void {
		this.pollingSubscription = interval(this.config.pollingInterval)
			.pipe(
				startWith(0),
				tap(() => {
					if (Object.keys(this.watchedJobs).length === 0) {
						this.disablePolling();
					}
				}),
			)
			.subscribe(() => {
				this.platformHttpService
					.get$<ISchedulerUiApiResponse[]>('services/scheduler/job/jobstates/', {
						params: {
							jobIds: map(Object.keys(this.watchedJobs), (key) => {
								return this.watchedJobs[key].id;
							}),
						},
					})
					.subscribe((response) => {
						response.forEach((jobStatus) => {
							const jobInfo = this.watchedJobs[jobStatus.j];
							if (jobInfo) {
								if (jobStatus.s !== jobInfo.lastState) {
									jobInfo.lastState = jobStatus.s;
									this.emitData(jobInfo);
									if (jobStatus.s >= 3) {
										delete this.watchedJobs[jobStatus.j];
										if (Object.keys(this.watchedJobs).length <= 0) {
											this.disablePolling();
										}
									}
								}
							}
						});
					});
			});
	}

	/**
	 * Function emits the Job data.
	 *
	 * @param jobInfo Data for the respective Job id.
	 */
	private emitData(jobInfo: ISchedulerUiJobInfo): void {
		jobInfo.subjectHandler.next({
			jobId: jobInfo.id,
			state: jobInfo.lastState,
			isFinal: jobInfo.lastState ? jobInfo.lastState >= 3 : false,
		});
	}

	/**
	 * Function disables polling.
	 */
	private disablePolling(): void {
		if (this.pollingSubscription) {
			this.pollingSubscription.unsubscribe();
			this.pollingSubscription = null;
		}
	}

	/**
	 * Creates and returns the job information..
	 *
	 * @param id Job id.
	 * @returns Job information.
	 */
	private getJobInfo(id: number): ISchedulerUiJobInfo {
		let jobInfo = this.watchedJobs[id];
		if (!jobInfo) {
			jobInfo = (function createInfo(owner: ServicesScheduleruiStatusNotificationService) {
				return {
					id: id,
					lastState: null,
					subjectHandler: new SchedulerUiStatusNotificationWrapper(id, owner.watchedJobs),
				};
			})(this);
		}

		return jobInfo;
	}

	/**
	 * Registers for the job status notification for Single job.
	 *
	 * @param ids Job id.
	 * @param observer callback.
	 * @returns Subscription.
	 */
	public register(ids: number, observer: (value: ISchedulerUiJobData) => void): Subscription;

	/**
	 * Registers for the job status notification for multiple job.
	 *
	 * @param ids Job ids.
	 * @param observer callback.
	 * @returns Subscription.
	 */
	public register(ids: number[], observer: (value: ISchedulerUiJobData) => void): Subscription;

	/**
	 * Registers for the job status notification for single job.
	 *
	 * @param ids Job id.
	 * @param observer Observer.
	 * @returns Subscription.
	 */
	public register(ids: number, observer: Partial<Observer<ISchedulerUiJobData>>): Subscription;

	/**
	 * Registers for the job status notification for multiple job.
	 *
	 * @param ids Job ids.
	 * @param observer observer.
	 * @returns Subscription.
	 */
	public register(ids: number[], observer: Partial<Observer<ISchedulerUiJobData>>): Subscription;

	/**
	 * Registers for the job status notification for single/multiple job.
	 *
	 * @param ids Job id/ids.
	 * @param observer callback/observer.
	 * @returns Subscription.
	 */
	public register(ids: number | Array<number>, observer: ((value: ISchedulerUiJobData) => void) | Partial<Observer<ISchedulerUiJobData>>): Subscription {
		const jobInfo: ISchedulerUiJobInfo[] = [];
		const subscriptions: Subscription = new Subscription();

		if (Array.isArray(ids)) {
			ids.forEach((id) => {
				const value = this.getJobInfo(id);
				jobInfo.push(value);
				subscriptions.add(value.subjectHandler.subscribe(observer));
			});
		} else {
			const value = this.getJobInfo(ids);
			jobInfo.push(value);
			subscriptions.add(value.subjectHandler.subscribe(observer));
		}

		this.addJobsToWatch(jobInfo);

		if (!this.pollingSubscription) {
			this.enablePolling();
		}

		return subscriptions;
	}

	/**
	 * Add jobs to watchlist.
	 *
	 * @param jobInfo Jobs data.
	 */
	private addJobsToWatch(jobInfo: ISchedulerUiJobInfo[]): void {
		jobInfo.forEach((job) => {
			if (!this.watchedJobs[job.id]) {
				this.watchedJobs[job.id] = job;
}
		});
	}
}
