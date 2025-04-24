/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

import { DataServiceFlatRoot, ServiceRole, IDataServiceOptions, IDataServiceEndPointOptions, IDataServiceRoleOptions, EntityArrayProcessor } from '@libs/platform/data-access';

import { ServicesSchedulerUIJobComplete } from '../model/services-scheduler-uijob-complete.class';

import { PlatformConfigurationService } from '@libs/platform/common';
import { ServicesSchedulerUIJobModifyProcessorService } from './processors/services-schedulerui-job-modify-processor.service';

import { IJobEntity } from '../model/entities/job-entity.interface';
import { IParameterList } from '../model/entities/parameter-list.interface';
import { ISchedulerUITaskTypeLookup } from '../model/entities/scheduler-ui-task-type-lookup.interface';

@Injectable({
	providedIn: 'root'
})

/**
 * Services schedulerui job data service.
 */
export class ServicesSchedulerUIJobDataService extends DataServiceFlatRoot<IJobEntity, ServicesSchedulerUIJobComplete> {

	/**
	 * Used to inject http client.
	 */
	protected http = inject(HttpClient);

	/**
	 * Used to inject configuration service.
	 */
	private configurationService = inject(PlatformConfigurationService);

	/**
	 * used to initialized task parameter.
	 */
	public taskParameterMap: Map<string, IParameterList[]> = new Map<string, IParameterList[]>();

	/**
	 * used to initialized task type.
	 */
	public taskMap: Map<string, ISchedulerUITaskTypeLookup> = new Map<string, ISchedulerUITaskTypeLookup>();


	public constructor() {
		const options: IDataServiceOptions<IJobEntity> = {
			apiUrl: 'services/schedulerui/job',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'listFiltered',
				usePost: true
			},
			deleteInfo: <IDataServiceEndPointOptions>{
				endPoint: 'delete'
			},
			roleInfo: <IDataServiceRoleOptions<IJobEntity>>{
				role: ServiceRole.Root,
				itemName: 'Job',
			},
			//TODO:IncorporatedDataRead function, 
			//need to add sidebarSearch
		};

		super(options);
		this.processor.addProcessor([new EntityArrayProcessor<IJobEntity>(['Job']),
		new ServicesSchedulerUIJobModifyProcessorService(this),
		]);
	}

	public override createUpdateEntity(modified: IJobEntity | null): ServicesSchedulerUIJobComplete {
		const complete = new ServicesSchedulerUIJobComplete();
		if (modified !== null) {
			complete.Id = modified.Id as number;
			complete.Datas = [modified];
		}

		return complete;
	}

	/**
	 * Used to get all jobs data.
	 * @returns {Observable<ISchedulerUITaskTypeLookup[]>}
	 */
	public getAllTasks(): Observable<ISchedulerUITaskTypeLookup[]> {
		return this.http.get(this.configurationService.webApiBaseUrl + 'services/schedulerui/job/alltasks').pipe(map((res) => {
			console.log(res);
			this.mapTasks(res as ISchedulerUITaskTypeLookup[]);
			return res as ISchedulerUITaskTypeLookup[];
		}));
	}


	/**
	 * Used to map tasks and parameter tasks.
	 * @param {ISchedulerUITaskTypeLookup[]} tasks 
	 */
	public mapTasks(tasks: ISchedulerUITaskTypeLookup[]) {
		tasks.forEach((task) => {
			this.taskMap.set(task.Id as string, task);
			let i = 0;
			task.ParameterList.forEach((parameter => {
				parameter.Id = i++;
			}));
			this.taskParameterMap.set(task.Id as string, task.ParameterList);
		});
	}

	/**
	 * Used to get task data based on Id.
	 * @param {string} taskTypeId 
	 * @returns {ISchedulerUITaskTypeLookup | undefined} returns task type data
	 */
	public getTask(taskTypeId: string): ISchedulerUITaskTypeLookup | undefined {
		const taskTypeData = this.taskMap.get(taskTypeId);
		return taskTypeData ? taskTypeData : undefined;
	}
}












