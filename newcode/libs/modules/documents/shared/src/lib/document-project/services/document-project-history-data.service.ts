/*
 * Copyright(c) RIB Software GmbH
 */
import { DataServiceFlatLeaf, IDataServiceChildRoleOptions, IDataServiceEndPointOptions, IDataServiceOptions, ServiceRole } from '@libs/platform/data-access';
import { IDocumentProjectHistoryEntity } from '../../model/entities/document-project-history-entity.interface';
import { IDocumentProjectEntity } from '../../model/entities/document-project-entity.interface';
import { DocumentProjectDataRootService } from '../services/document-project-data-root.service';
import { DocumentComplete } from '../../model/document-complete.class';
import { ISearchResult } from '@libs/platform/common';
import { get } from 'lodash';
import { Injectable } from '@angular/core';
import { MainDataDto } from '@libs/basics/shared';

/**
 * Document History data service
 */

@Injectable({
    providedIn: 'root'
})
export class DocumentProjectHistoryDataService extends DataServiceFlatLeaf<IDocumentProjectHistoryEntity, IDocumentProjectEntity, DocumentComplete> {

    private static cacheMap: Map<string, DocumentProjectHistoryDataService> = new Map();

    public static getInstance(moduleName: string, parentService: DocumentProjectDataRootService<object>): DocumentProjectHistoryDataService {
        let instance = this.cacheMap.get(moduleName);
        if (!instance) {
            instance = new DocumentProjectHistoryDataService(parentService);
            this.cacheMap.set(moduleName, instance);
        }
        return instance;
    }
    public constructor(
        parentService: DocumentProjectDataRootService<object>) {
        const options: IDataServiceOptions<IDocumentProjectHistoryEntity> = {
            apiUrl: 'documentsproject/history',
            readInfo:<IDataServiceEndPointOptions>{
                endPoint: 'list',
                usePost: false
            },
            roleInfo: <IDataServiceChildRoleOptions<IDocumentProjectHistoryEntity, IDocumentProjectEntity, DocumentComplete>>{
                role: ServiceRole.Leaf,
                itemName: 'ProjectDocumentHistory',
                parent: parentService
            }
        };
        super(options);
    }

	public override takeOverUpdated(updated: DocumentComplete): void {

	}

    protected override provideLoadPayload() {
        const parent = this.getSelectedParent();
        if (parent) {
            return {
                mainItemId: parent.Id
            };
        }else{
            throw new Error(
                'There should be a selected parent Document record to load'
            );
        }
    }
    protected override onLoadByFilterSucceeded(loaded: object): ISearchResult<IDocumentProjectHistoryEntity> {
	    const dto = new MainDataDto(loaded);
		 const fr = get(loaded, 'FilterResult')!;
        return {
            FilterResult: fr,
            dtos: dto.getValueAs<IDocumentProjectHistoryEntity[]>('Main')!
        };
    }

    protected override onLoadSucceeded(loaded: object): IDocumentProjectHistoryEntity[] {
	    const dto = new MainDataDto(loaded);
	    return dto.getValueAs<IDocumentProjectHistoryEntity[]>('Main')!;
    }
}
