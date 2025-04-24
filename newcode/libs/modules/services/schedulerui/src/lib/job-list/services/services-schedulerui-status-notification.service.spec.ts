/*
 * Copyright(c) RIB Software GmbH
 */

import { TestBed } from '@angular/core/testing';
import { PlatformHttpServiceMock } from '@test/jest-shared';
import { PlatformHttpService } from '@libs/platform/common';
import { ServicesScheduleruiStatusNotificationService } from './services-schedulerui-status-notification.service';
import { ServicesSchedulerUiStatusNotificationConfigService } from './status-notification-config.service';

describe('ServicesScheduleruiStatusNotificationService', () => {
	let service: ServicesScheduleruiStatusNotificationService;

	const httpMock = new PlatformHttpServiceMock();

	const STATE_RUNNING = 2;
	const STATE_ABORTED = 3;
	const STATE_COMPLETED = 4;

	function getJobState(jobId: number, state: number) {
		return {
			j: jobId,
			s: state
		};
	}

	beforeEach(() => {
		TestBed.configureTestingModule({
			providers: [{
				provide: PlatformHttpService,
				useValue: httpMock
			}, {
				provide: ServicesSchedulerUiStatusNotificationConfigService,
				useValue: {
					pollingInterval: 50
				}
			}]
		});

		service = TestBed.inject(ServicesScheduleruiStatusNotificationService);
	});

	it('should be created', () => {
		expect(service).toBeTruthy();
	});

	it('should process a single job state', async () => {
		const JOB_ID = 23784;

		let isJobFinished = false;

		let serverCallCount = 0;

		httpMock.setMockResponse('GET', 'services/scheduler/job/jobstates', options => {
			expect(options.params['jobIds']).toBeTruthy();
			expect(Array.isArray(options.params['jobIds'])).toBeTruthy();
			const jobIds = options.params['jobIds'] as number[];
			expect(jobIds).toHaveLength(1);
			expect(jobIds[0]).toBe(JOB_ID);

			serverCallCount++;

			return [getJobState(JOB_ID, isJobFinished ? STATE_COMPLETED : STATE_RUNNING)];
		});

		let callCount = 0;

		// register with service - job is active

		const subs = service.register(JOB_ID, data => {
			expect(data.jobId).toBe(JOB_ID);
			expect(data.isFinal).toBe(isJobFinished);

			callCount++;
		});

		await new Promise(r => setTimeout(r, 400));

		// up to now, the job has been active

		expect(serverCallCount).toBeGreaterThan(1);
		expect(callCount).toBe(1);

		serverCallCount = 0;
		callCount = 0;

		isJobFinished = true;

		await new Promise(r => setTimeout(r, 300));

		// now, the job has finished

		expect(serverCallCount).toBe(1);
		expect(callCount).toBe(1);

		subs.unsubscribe();
	}, 5000);

	it('should process multiple job states', async () => {
		const JOB1_ID = 87924;
		const JOB2_ID = 12839;
		const JOB3_ID = 16606;

		const isJobFinished: [boolean, boolean, boolean] = [false, false, false];

		let serverCallCount = 0;

		httpMock.setMockResponse('GET', 'services/scheduler/job/jobstates', options => {
			expect(options.params['jobIds']).toBeTruthy();
			expect(Array.isArray(options.params['jobIds'])).toBeTruthy();
			const jobIds = options.params['jobIds'] as number[];

			expect(jobIds.length).toBeLessThanOrEqual(3);
			expect(jobIds.length).toBeGreaterThanOrEqual(2);

			if (jobIds.length > 2) {
				expect(jobIds).toContain(JOB1_ID);
			}
			expect(jobIds).toContain(JOB2_ID);
			expect(jobIds).toContain(JOB3_ID);

			serverCallCount++;

			const result = [
				getJobState(JOB2_ID, isJobFinished[1] ? STATE_COMPLETED : STATE_RUNNING),
				getJobState(JOB3_ID, isJobFinished[2] ? STATE_COMPLETED : STATE_RUNNING)
			];
			if (jobIds.length > 2) {
				result.splice(0, 0, getJobState(JOB1_ID, isJobFinished[0] ? STATE_COMPLETED : STATE_RUNNING));
			}
			return result;
		});

		let callCount: [number, number, number] = [0, 0, 0];

		// register with service

		const subs = service.register([JOB1_ID, JOB2_ID, JOB3_ID], data => {
			expect(data.jobId === JOB1_ID || data.jobId === JOB2_ID || data.jobId === JOB3_ID).toBeTruthy();

			switch (data.jobId) {
				case JOB1_ID:
					expect(data.isFinal).toBe(isJobFinished[0]);
					callCount[0]++;
					break;
				case JOB2_ID:
					expect(data.isFinal).toBe(isJobFinished[1]);
					callCount[1]++;
					break;
				case JOB3_ID:
					expect(data.isFinal).toBe(isJobFinished[2]);
					callCount[2]++;
					break;
			}
		});

		await new Promise(r => setTimeout(r, 400));

		// up to now, all jobs are active

		expect(serverCallCount).toBeGreaterThan(1);
		expect(callCount[0]).toBe(1);
		expect(callCount[1]).toBe(1);
		expect(callCount[2]).toBe(1);

		serverCallCount = 0;
		callCount = [0, 0, 0];

		isJobFinished[0] = true;

		await new Promise(r => setTimeout(r, 400));

		// by now, job 1 has ended

		expect(serverCallCount).toBeGreaterThan(1);
		expect(callCount[0]).toBe(1);
		expect(callCount[1]).toBe(0);
		expect(callCount[2]).toBe(0);

		serverCallCount = 0;
		callCount = [0, 0, 0];

		isJobFinished[1] = true;
		isJobFinished[2] = true;

		await new Promise(r => setTimeout(r, 300));

		// by now, the other two jobs have ended

		expect(serverCallCount).toBe(1);
		expect(callCount[0]).toBe(0);
		expect(callCount[1]).toBe(1);
		expect(callCount[2]).toBe(1);

		subs.unsubscribe();
	}, 10000);

	it('should process several registrations for multiple overlapping job states', async () => {
		const JOB1_ID = 87924;
		const JOB2_ID = 12839;
		const JOB3_ID = 16606;

		const isJobFinished: [boolean, boolean, boolean] = [false, false, false];

		let serverCallCount = 0;

		httpMock.setMockResponse('GET', 'services/scheduler/job/jobstates', options => {
			expect(options.params['jobIds']).toBeTruthy();
			expect(Array.isArray(options.params['jobIds'])).toBeTruthy();
			const jobIds = options.params['jobIds'] as number[];

			expect(jobIds.length).toBeLessThanOrEqual(3);
			expect(jobIds.length).toBeGreaterThanOrEqual(2);

			serverCallCount++;

			const result: {j: number, s: number}[] = [];

			if (jobIds.includes(JOB1_ID)) {
				result.push(getJobState(JOB1_ID, isJobFinished[0] ? STATE_COMPLETED : STATE_RUNNING));
			}
			if (jobIds.includes(JOB2_ID)) {
				result.push(getJobState(JOB2_ID, isJobFinished[1] ? STATE_COMPLETED : STATE_RUNNING));
			}
			if (jobIds.includes(JOB3_ID)) {
				result.push(getJobState(JOB3_ID, isJobFinished[2] ? STATE_COMPLETED : STATE_RUNNING));
			}

			expect(jobIds).toHaveLength(result.length);

			return result;
		});

		let call1Count: [number, number] = [0, 0];

		// register once with service

		const subs1 = service.register([JOB1_ID, JOB2_ID], data => {
			expect(data.jobId === JOB1_ID || data.jobId === JOB2_ID).toBeTruthy();

			switch (data.jobId) {
				case JOB1_ID:
					expect(data.isFinal).toBe(isJobFinished[0]);
					call1Count[0]++;
					break;
				case JOB2_ID:
					expect(data.isFinal).toBe(isJobFinished[1]);
					call1Count[1]++;
					break;
			}
		});

		let call2Count: [number, number] = [0, 0];

		// register again with service for an overlapping set of job IDs

		const subs2 = service.register([JOB2_ID, JOB3_ID], data => {
			expect(data.jobId === JOB2_ID || data.jobId === JOB3_ID).toBeTruthy();

			switch (data.jobId) {
				case JOB2_ID:
					expect(data.isFinal).toBe(isJobFinished[1]);
					call2Count[0]++;
					break;
				case JOB3_ID:
					expect(data.isFinal).toBe(isJobFinished[2]);
					call2Count[1]++;
					break;
			}
		});

		await new Promise(r => setTimeout(r, 400));

		// up to now, all jobs are active

		expect(serverCallCount).toBeGreaterThan(1);
		expect(call1Count[0]).toBe(1);
		expect(call1Count[1]).toBe(1);
		expect(call2Count[0]).toBe(1);
		expect(call2Count[1]).toBe(1);

		serverCallCount = 0;
		call1Count = [0, 0];
		call2Count = [0, 0];

		isJobFinished[0] = true;

		await new Promise(r => setTimeout(r, 400));

		// by now, job 1 has ended

		expect(serverCallCount).toBeGreaterThan(1);
		expect(call1Count[0]).toBe(1);
		expect(call1Count[1]).toBe(0);
		expect(call2Count[0]).toBe(0);
		expect(call2Count[1]).toBe(0);

		serverCallCount = 0;
		call1Count = [0, 0];
		call2Count = [0, 0];

		isJobFinished[1] = true;
		isJobFinished[2] = true;

		await new Promise(r => setTimeout(r, 300));

		// by now, the other two jobs have ended

		expect(serverCallCount).toBe(1);
		expect(call1Count[0]).toBe(0);
		expect(call1Count[1]).toBe(1);
		expect(call2Count[0]).toBe(1);
		expect(call2Count[1]).toBe(1);

		subs1.unsubscribe();
		subs2.unsubscribe();
	}, 10000);
});
