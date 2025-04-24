/*
 * Copyright(c) RIB Software GmbH
 */
import {inject, Injectable} from '@angular/core';
import {
	DataServiceFlatRoot,
	IDataServiceEndPointOptions,
	IDataServiceRoleOptions
} from '@libs/platform/data-access';
import { ServiceRole } from '@libs/platform/data-access';
import { IDataServiceOptions } from '@libs/platform/data-access';
import {CompleteIdentification, PlatformConfigurationService} from '@libs/platform/common';
import {firstValueFrom} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {IDocumentImportJob} from '../model/entities/document-import-job.interface';
import { number } from 'mathjs';

/**
 * document import task data service
 */
@Injectable({
	providedIn: 'root'
})

export class DocumentsImportTaskDataService extends DataServiceFlatRoot<IDocumentImportJob, CompleteIdentification<IDocumentImportJob>> {
	private readonly configService = inject(PlatformConfigurationService);
	private readonly http = inject(HttpClient);
	public constructor() {
		const options: IDataServiceOptions<IDocumentImportJob> = {
			apiUrl: 'documents/documentsimport',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'getimportjobs',
				usePost: false
			},
			roleInfo: <IDataServiceRoleOptions<IDocumentImportJob>>{
				role: ServiceRole.Root,
				itemName: 'IDocumentImportJob'
			}
		};

		super(options);
	}

	public async loadData(): Promise<void> {
		const responseData = await firstValueFrom(this.http.get(this.configService.webApiBaseUrl + 'documents/documentsimport/getimportjobs'));
		if (responseData) {
			const data = responseData as IDocumentImportJob[];
			data.forEach((e=>{
				this.formatJobStatusAndProgress(e);
			}));
			this.setList(data);
		}
	}

	public deleteOneTask(){
		const selectedEntity = this.getSelectedEntity();
		if(selectedEntity) {
			const entityList = this.getList();
			const newEntityList = entityList.filter(e => e.Id !== selectedEntity.Id);
			this.setList(newEntityList);
			this.deleteFn(selectedEntity.Id);
		}
	}

	public deleteAllTask(){
		const allSelectedEntities = this.getList();
		if(allSelectedEntities) {
			const ids = allSelectedEntities.map(e=>e.Id);
			this.setList([]);
			this.deleteFn(ids);
		}
	}

	public async deleteFn(ids: number[]|number){
		await firstValueFrom(this.http.post(this.configService.webApiBaseUrl + 'documents/documentsimport/deletetask',{JobIds:ids}));
	}

	public jobStateMappings: { [key: number]: string } = {
		0: 'Waiting',
		1: 'Starting',
		2: 'Running',
		3: 'Stopped',
		4: 'Finished',
		5: 'Repetitive',
		6: 'Stopping',
		7: 'Finished'
	};

	public formatJobStatusAndProgress(job: IDocumentImportJob){
		job.ProgressValue = job.ProgressValue+'%';
		const input =number(job.JobState);
		job.JobState = this.jobStateMappings[input] ?? '';
	}

}
