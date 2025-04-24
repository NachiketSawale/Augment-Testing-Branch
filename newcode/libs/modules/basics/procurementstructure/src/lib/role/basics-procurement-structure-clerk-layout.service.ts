/*
 * Copyright(c) RIB Software GmbH
 */
import { Injectable } from '@angular/core';
import { prefixAllTranslationKeys } from '@libs/platform/common';
import { ILayoutConfiguration } from '@libs/ui/common';
import { BasicsSharedCustomizeLookupOverloadProvider, BasicsSharedLookupOverloadProvider} from '@libs/basics/shared';
import { IPrcStructure2clerkEntity } from '../model/entities/prc-structure-2-clerk-entity.interface';
/**
 * Procurement structure clerk layout service
 */
@Injectable({
    providedIn: 'root',
})
export class BasicsProcurementStructureClerkLayoutService {

    /**
     * Generate layout config
     */
    public async generateLayout(): Promise<ILayoutConfiguration<IPrcStructure2clerkEntity>> {

        return {
            groups: [
                {
                    gid: 'basicData',
                    title: {
                        text: 'Basic Data',
                        key: 'cloud.common.entityProperties'
                    },
                    attributes: [
                        'CompanyFk',
                        'ClerkRoleFk',
                        'ClerkFk',
                        'CommentText'
                    ]
                }
            ],
            labels: {
                ...prefixAllTranslationKeys('cloud.common.', {
                    'CompanyFk': {
                        text: 'Company',
                        key: 'entityCompany'
                    },
                    'ClerkRoleFk': {
                        text: 'Clerk Role',
                        key: 'entityClerkRole'
                    },
                    'ClerkFk': {
                        text: 'Clerk Code',
                        key: 'entityClerk'
                    },
                    CommentText: {
                        text: 'Comment',
                        key: 'entityCommentText'
                    }
                })
            },
            overloads: {
                CompanyFk: BasicsSharedLookupOverloadProvider.provideCompanyReadOnlyLookupOverload(), 
                ClerkRoleFk: BasicsSharedCustomizeLookupOverloadProvider.provideClerkRoleLookupOverload(false), 
                ClerkFk: BasicsSharedLookupOverloadProvider.providerBasicsClerkLookupOverload(false), 
            }
        };
    }
}