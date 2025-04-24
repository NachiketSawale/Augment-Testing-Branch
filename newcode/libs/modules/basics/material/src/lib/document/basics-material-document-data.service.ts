/*
 * Copyright(c) RIB Software GmbH
 */

import {Injectable} from '@angular/core';
import {
    IDataServiceChildRoleOptions,
    ServiceRole
} from '@libs/platform/data-access';
import {get} from 'lodash';
import {DocumentDataLeafService} from '@libs/documents/shared';
import { IMaterialEntity } from '@libs/basics/interfaces';
import { BasicsMaterialRecordDataService } from '../material/basics-material-record-data.service';
import { IMaterialDocumentEntity } from '../model/entities/material-document-entity.interface';
import { MaterialComplete } from '../model/complete-class/material-complete.class';

/**
 * The material document data service
 */
@Injectable({
    providedIn: 'root',
})
export class BasicsMaterialDocumentDataService extends DocumentDataLeafService<IMaterialDocumentEntity, IMaterialEntity, MaterialComplete> {

    public constructor(private parentService: BasicsMaterialRecordDataService) {
        super({
            apiUrl: 'basics/material/document',
            roleInfo: <IDataServiceChildRoleOptions<IMaterialDocumentEntity, IMaterialEntity, MaterialComplete>>{
                role: ServiceRole.Leaf,
                itemName: 'MaterialDocument',
                parent: parentService
            },
            createInfo: {
                prepareParam: ident => {
                    const material = parentService.getSelection()[0];
                    return {
                        PKey1: material.Id
                    };
                }
            },
            readInfo: {
                endPoint: 'listbyparent',
                usePost: true
            }
        });
    }



    protected override provideLoadPayload(): object {
        const contract = this.parentService.getSelection()[0];
        return {
            PKey1: contract.Id
        };
    }

    protected override onLoadSucceeded(loaded: object): IMaterialDocumentEntity[] {
        if (loaded) {
            return get(loaded, 'Main', []);
        }
        return [];
    }

    public override registerByMethod(): boolean {
        return true;
    }

    public override registerModificationsToParentUpdate(parentUpdate: MaterialComplete, modified: IMaterialDocumentEntity[], deleted: IMaterialDocumentEntity[]): void {
        if (modified && modified.some(() => true)) {
            parentUpdate.MaterialDocumentToSave = modified;
        }

        if (deleted && deleted.some(() => true)) {
            parentUpdate.MaterialDocumentToDelete = deleted;
        }
    }

    public override getSavedEntitiesFromUpdate(complete: MaterialComplete): IMaterialDocumentEntity[] {
        if (complete && complete.MaterialDocumentToSave) {
            return complete.MaterialDocumentToSave;
        }

        return [];
    }

    public override isParentFn(parentKey: IMaterialEntity, entity: IMaterialDocumentEntity): boolean {
		return entity.MdcMaterialFk === parentKey.Id;
	}
}