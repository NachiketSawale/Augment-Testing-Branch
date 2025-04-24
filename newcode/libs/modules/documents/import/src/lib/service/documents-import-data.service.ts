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
import {CompleteIdentification, ISearchResult, PlatformConfigurationService} from '@libs/platform/common';
import {IDocumentOrphan} from '../model/entities/document-import.interface';
import {firstValueFrom} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {IDocumentImportJob} from '../model/entities/document-import-job.interface';
import {MainDataDto} from '@libs/basics/shared';
import {get} from 'lodash';

/**
 * document import data service
 */
@Injectable({
    providedIn: 'root'
})

export class DocumentsImportDataService extends DataServiceFlatRoot<IDocumentOrphan, CompleteIdentification<IDocumentOrphan>> {
    private readonly configService = inject(PlatformConfigurationService);
    private readonly http = inject(HttpClient);
    public constructor() {
        const options: IDataServiceOptions<IDocumentOrphan> = {
            apiUrl: 'documents/documentsimport',
            readInfo: <IDataServiceEndPointOptions>{
                endPoint: 'list',
                usePost: true
            },
            roleInfo: <IDataServiceRoleOptions<IDocumentOrphan>>{
                role: ServiceRole.Root,
                itemName: 'Documentorphan'
            }
        };

        super(options);
    }

    protected override provideLoadByFilterPayload(): object {
        return {};
    }
    protected override onLoadByFilterSucceeded(loaded: object): ISearchResult<IDocumentOrphan>{
        const fr = get(loaded, 'FilterResult')!;
        const dto = new MainDataDto<IDocumentOrphan>(loaded);
        return {
            FilterResult: fr,
            dtos: dto.Main
        };
    }

    public async assignment(){
        const orphanDtos = this.getList();
        if (orphanDtos.length > 0){
            const res = await firstValueFrom(this.http.post(this.configService.webApiBaseUrl+'documents/documentsimport/reimport',orphanDtos));
            const importData = res as unknown as IDocumentImportJob;
            if(importData){
                //todo-documentsImportWizardImportService available then uncomment below code -https://rib-40.atlassian.net/browse/DEV-14480
                //documentsImportWizardImportService.importTaskCreateComplete(importData);
            }
            this.refreshAllLoaded();
        }
    }
}
