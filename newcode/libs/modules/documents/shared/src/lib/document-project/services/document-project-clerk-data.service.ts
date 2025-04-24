/*
 * Copyright(c) RIB Software GmbH
 */
import { Injectable} from '@angular/core';
import {DocumentProjectDataRootService} from '../services/document-project-data-root.service';
import {DocumentComplete} from '../../model/document-complete.class';
import {BasicsSharedClerkDataService,IBasicsClerkEntity} from '@libs/basics/shared';
import {IDocumentProjectEntity} from '../../model/entities/document-project-entity.interface';

/**
 * Document Project Clerk Authorization data service
 */
@Injectable({
    providedIn: 'root'
})

export class DocumentProjectClerkDataService extends BasicsSharedClerkDataService<IBasicsClerkEntity,IDocumentProjectEntity,DocumentComplete>{

    private static cacheMap: Map<string, DocumentProjectClerkDataService> = new Map();

    public static getInstance(moduleName: string, parentService: DocumentProjectDataRootService<object>): DocumentProjectClerkDataService {
        let instance = this.cacheMap.get(moduleName);
        if (!instance) {
            instance = new DocumentProjectClerkDataService(parentService);
            this.cacheMap.set(moduleName, instance);
        }
        return instance;
    }

    public constructor(parentService: DocumentProjectDataRootService<object>) {
        super(parentService,
            {
            apiUrl: 'basics/common/clerk',
            itemName:'',
            Qualifier: 'documents.project.clerk',
            filter:''
        }
        );
    }

    public override registerByMethod(): boolean {
        return true;
    }

    public override registerModificationsToParentUpdate(parentUpdate: DocumentComplete, modified: IBasicsClerkEntity[], deleted: IBasicsClerkEntity[]): void {
        if (modified && modified.some(() => true)) {
            parentUpdate.ClerkDataToSave = modified;
        }

        if (deleted && deleted.some(() => true)) {
            parentUpdate.ClerkDataToDelete = deleted;
        }
    }

    public override getSavedEntitiesFromUpdate(complete: DocumentComplete): IBasicsClerkEntity[] {
        if (complete && complete.ClerkDataToSave) {
            return complete.ClerkDataToSave;
        }
        return [];
    }
}
