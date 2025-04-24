/*
 * Copyright(c) RIB Software GmbH
 */
import {inject, Injectable} from '@angular/core';
import {
	DataServiceFlatLeaf, IDataServiceChildRoleOptions,
	IDataServiceEndPointOptions
} from '@libs/platform/data-access';
import { ServiceRole } from '@libs/platform/data-access';
import { IDataServiceOptions } from '@libs/platform/data-access';
import {CompleteIdentification, PlatformConfigurationService} from '@libs/platform/common';
import {HttpClient} from '@angular/common/http';
import {IDocumentImportJob} from '../model/entities/document-import-job.interface';
import { IDocumentImportedLogInfo } from '../model/entities/document-info.interface';
import { DocumentsImportTaskDataService } from './documents-import-task-data.service';
import { firstValueFrom } from 'rxjs';

/**
 * document import logging data service
 */
@Injectable({
	providedIn: 'root'
})

export class DocumentsImportLoggingDataService extends DataServiceFlatLeaf<IDocumentImportedLogInfo, IDocumentImportJob,CompleteIdentification<IDocumentImportedLogInfo>> {
	private readonly configService = inject(PlatformConfigurationService);
	private readonly http = inject(HttpClient);
	public pageNum = -1;
	public isLastPage = false;

	public constructor(protected parentService:DocumentsImportTaskDataService) {
		const options: IDataServiceOptions<IDocumentImportedLogInfo> = {
			apiUrl: 'documents/documentsimport',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'getimportresult',
				usePost: false,
				prepareParam: ident => {
					return { jobId : ident.pKey1};
				}
			},
			roleInfo: <IDataServiceChildRoleOptions<IDocumentImportedLogInfo,IDocumentImportJob,CompleteIdentification<IDocumentImportedLogInfo>>>{
				role: ServiceRole.Leaf,
				itemName: 'IDocumentImportedLogInfo',
				parent:parentService
			}
		};

		super(options);
	}

	public canPrevious(){
		return this.pageNum <= 0;
	}

	public canNext(){
		return this.isLastPage || this.pageNum === -1;
	}

	public async getResultByPage(){
		const parentItem = this.parentService.getSelectedEntity();
		const responseData = await firstValueFrom(this.http.get(this.configService.webApiBaseUrl+'documents/documentsimport/getimportresultbypage?jobId='+parentItem?.Id+'&pageNum='+this.pageNum));
		if(responseData){
			const data = responseData as IDocumentImportedLogInfo[];
			this.isLastPage = data ? (data.length <= 0) : true;
			this.setList(data);
		}
	}

	public nextPage(){
		this.pageNum +=1;
		this.getResultByPage();
	}

	public prePage(){
		this.pageNum -= 1;
		this.getResultByPage();
	}
}