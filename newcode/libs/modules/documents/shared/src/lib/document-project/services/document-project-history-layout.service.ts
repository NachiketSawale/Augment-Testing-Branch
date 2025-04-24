/*
 * Copyright(c) RIB Software GmbH
 */
import { Injectable } from '@angular/core';
import {createLookup, FieldType, ILayoutConfiguration} from '@libs/ui/common';
import { prefixAllTranslationKeys } from '@libs/platform/common';
import {IDocumentProjectHistoryEntity} from '../../model/entities/document-project-history-entity.interface';
import {
    BasicsSharedClerkLookupService,
    BasicsSharedProjectDocumentOperationLookupService
} from '@libs/basics/shared';
import {
    IBasicsCustomizeProjectDocumentOperationEntity
} from '@libs/basics/interfaces';
/**
 * Document Project History layout service
 */
@Injectable({
    providedIn: 'root',
})
export class DocumentProjectHistoryLayoutService {
    public async generateConfig(): Promise<ILayoutConfiguration<IDocumentProjectHistoryEntity>> {
        return {
            groups: [
                {
                    gid: 'basicData',
                    title: {
                        text: 'Basic Data',
                        key: 'cloud.common.entityProperties'
                    },
                    attributes: [
                        'PrjDocumentRevision',
                        'PrjDocumentOperationFk',
                        'BasClerkFk',
                        'Remark'
                    ]
                }
            ],
            labels: {
                ...prefixAllTranslationKeys('documents.project.', {
                    PrjDocumentOperationFk:{key:'entityPrjDocumentOperation',text:'Operation'},
                    Remark:{key:'entityPrjDocumentRemark',text:'Remark'}
                }),
                ...prefixAllTranslationKeys('documents.project.Revisions.',{
                    PrjDocumentRevision: {key: 'Revision', text: 'Revision'},
                 }),
                ...prefixAllTranslationKeys('cloud.common.',{
                    BasClerkFk:{key:'entityClerk',text:'Clerk'},
                }),
            },
            overloads: {
                BasClerkFk: {
                    type: FieldType.Lookup,
                    lookupOptions: createLookup({
                        dataServiceToken: BasicsSharedClerkLookupService,
                        showDescription: true,
                        descriptionMember: 'Description'
                    }),
                    additionalFields: [
                        {
                            displayMember: 'Description',
                            label: {
                                text: 'Clerk-Description',
                            },
                            column: true,
                            row: false,
                            singleRow: true,
                        },
                    ],
                },
                PrjDocumentOperationFk:{
                    type: FieldType.Lookup,
                    lookupOptions: createLookup<IDocumentProjectHistoryEntity, IBasicsCustomizeProjectDocumentOperationEntity>({
                        dataServiceToken: BasicsSharedProjectDocumentOperationLookupService,
                        displayMember: 'DescriptionInfo.Translated'
                    }),
                    readonly: true,
                }
            },
            transientFields: [{
                id: 'PrjDocumentRevision',
                readonly: true,
                model: 'PrjDocumentRevision',
                type: FieldType.Integer
            }]
        };
    }
}