/*
 * Copyright(c) RIB Software GmbH
 */
import {Injectable} from '@angular/core';
import { UiCommonLookupTypeLegacyDataService } from '@libs/ui/common';
import {IProjectDocumentTypeEntity} from '../model/entities/project-document-type-entity.interface';

/*
 * Document Shared Document Type
 * IBasicsSharedProjectDocumentTypeLookupService is not be used ,because current lookup service's dropdown list only display the description
 */
@Injectable({
    providedIn: 'root'
})
export class DocumentSharedDocumentTypeLookupService<TEntity extends object = object> extends UiCommonLookupTypeLegacyDataService<IProjectDocumentTypeEntity, TEntity> {
    public constructor() {
        super('ProjectDocumentTypeLookup', {
            uuid: '1f190327b43242c9b94bd7846da1d2b9',
            valueMember: 'Id',
            displayMember: 'DescriptionInfo.Translated'
        });
    }
}