/*
 * Copyright(c) RIB Software GmbH
 */
import {inject, Injectable} from '@angular/core';
import { prefixAllTranslationKeys, PlatformLazyInjectorService } from '@libs/platform/common';
import {
    ILayoutConfiguration,
    UiCommonLookupDataFactoryService
} from '@libs/ui/common';
import {
    BasicsSharedLookupOverloadProvider
} from '@libs/basics/shared';
import { IPrcStructure2EvaluationEntity } from '../model/entities/prc-structure-2-evaluation-entity.interface';
import { BUSINESSPARTNER_RELATED_LOOKUP_PROVIDER_TOKEN } from '@libs/businesspartner/interfaces';

/**
 * Procurement structure evaluation layout service
 */
@Injectable({
    providedIn: 'root',
})
export class BasicsProcurementStructureEvaluationLayoutService {

    private lookupFactory = inject(UiCommonLookupDataFactoryService);
    private readonly lazyInjector = inject(PlatformLazyInjectorService);

    /**
     * Generate layout config
     */
    public async generateLayout(): Promise<ILayoutConfiguration<IPrcStructure2EvaluationEntity>> {
        const bpRelatedLookupProvider = await this.lazyInjector.inject(BUSINESSPARTNER_RELATED_LOOKUP_PROVIDER_TOKEN);
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
                        'BpdEvaluationSchemaFk'
                    ]
                }
            ],
            labels: {
                ...prefixAllTranslationKeys('cloud.common.', {
                    'CompanyFk': {
                        text: 'Company',
                        key: 'entityCompany'
                    }
                }),
                ...prefixAllTranslationKeys('basics.procurementstructure.', {
                    'BpdEvaluationSchemaFk': {
                        text: 'Evaluation Schema',
                        key: 'evaluationSchema'
                    }
                }),
            },
            overloads: {
                CompanyFk: BasicsSharedLookupOverloadProvider.provideCompanyReadOnlyLookupOverload(), 
                BpdEvaluationSchemaFk: bpRelatedLookupProvider.getBusinessPartnerEvaluationSchemaLookupOverload(),
            }
        };
    }
}