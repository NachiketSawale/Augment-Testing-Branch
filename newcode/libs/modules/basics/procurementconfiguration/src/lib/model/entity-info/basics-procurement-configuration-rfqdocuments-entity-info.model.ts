/*
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo } from '@libs/ui/business-base';
import { prefixAllTranslationKeys } from '@libs/platform/common';
import { LookupSimpleEntity } from '@libs/ui/common';
import {
	Rubric,
    BasicsSharedLookupOverloadProvider,
    BasicsSharedCustomizeLookupOverloadProvider,
} from '@libs/basics/shared';
import { BasicsProcurementConfigurationRfqDocumentsDataService } from '../../services/basics-procurement-configuration-rfqdocuments-data.service';
import { get } from 'lodash';
import { IPrcConfig2documentEntity } from '../entities/prc-config-2-document-entity.interface';



export const BASICS_PROCUREMENT_CONFIGURATION_RFQDOCUMENTS_ENTITY_INFO = EntityInfo.create<IPrcConfig2documentEntity>({
    grid: {
        title: {text: 'WizardConfig Documents', key: 'basics.procurementconfiguration.rfqdocuments'}

    },
    dataService: ctx => ctx.injector.get(BasicsProcurementConfigurationRfqDocumentsDataService),
    dtoSchemeId: {moduleSubModule: 'Basics.ProcurementConfiguration', typeName: 'PrcConfig2documentDto'},
    permissionUuid: '55649966e0a64adcb2e2118d33f9587b',
    layoutConfiguration:
        {
            groups: [
                {
                    gid: 'basicData',
                    title: {
                        key: 'cloud.common.entityProperties',
                        text: 'Basic Data'
                    },
                    attributes: [
                        'BasRubricFk',
                        'PrcDocumenttypeFk',
                        'PrjDocumenttypeFk',
                        'BasClerkdocumenttypeFk',
                        'SlsDocumenttypeFk'
                    ]
                }
            ],
            labels: {
                ...prefixAllTranslationKeys('basics.procurementconfiguration.', {
                    'BasRubricFk': {
                        'key': 'entityBasRubricFk',
                        'text': 'Module'
                    },
                    'PrcDocumenttypeFk': {
                        'key': 'entityPrcDocumenttypeFk',
                        'text': 'Procurement Document Type'
                    },
                    'PrjDocumenttypeFk': {
                        'key': 'entityPrjDocumenttypeFk',
                        'text': 'Project Document Type'
                    },
                    'BasClerkdocumenttypeFk': {
                        'key': 'entityBasClerkdocumenttypeFk',
                        'text': 'Clerk Document Type'
                    },
                    'SlsDocumenttypeFk': {
                        'key': 'entitySalesDocumenttypeFk',
                        'text': 'Sales Document Type'
                    }
                })
            },
            overloads: {
                BasRubricFk: BasicsSharedLookupOverloadProvider.provideSimpleModuleLookupOverload({
                    execute(item: LookupSimpleEntity, context): boolean {
                        const id = get(item, 'Id') as unknown as number;
                        const conditions = [
                            Rubric.Requisition,
                            Rubric.RFQs,
                            Rubric.Quotation,
                            Rubric.Contract,
                            Rubric.PerformanceEntrySheets,
                            Rubric.Invoices,
                            Rubric.Package,
                            Rubric.ProcurementStructure,
                            Rubric.Project,
                            Rubric.Clerk,
                            Rubric.Bid,
                            Rubric.Order,
                            Rubric.Bill,
                            Rubric.WIP
                        ];
                        return conditions.includes(id);
                    }
                }),
                PrcDocumenttypeFk: BasicsSharedCustomizeLookupOverloadProvider.provideProcurementDocumentTypeLookupOverload(true),               
                PrjDocumenttypeFk: BasicsSharedCustomizeLookupOverloadProvider.provideProjectDocumentTypeLookupOverload(true),
                BasClerkdocumenttypeFk: BasicsSharedCustomizeLookupOverloadProvider.provideClerkDocumentTypeLookupOverload(true),
                SlsDocumenttypeFk: BasicsSharedCustomizeLookupOverloadProvider.provideSalesDocumentTypeLookupOverload(true),
            }
        }
});
