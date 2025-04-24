/*
 * Copyright(c) RIB Software GmbH
 */

import {
    EntityInfo,
    ISplitGridConfiguration,
    SplitGridConfigurationToken,
    SplitGridContainerComponent
} from '@libs/ui/business-base';
import {prefixAllTranslationKeys} from '@libs/platform/common';
import {FieldType} from '@libs/ui/common';
import { BasicsSharedLookupOverloadProvider } from '@libs/basics/shared';
import {BasicsProcurementStructureInterCompanyDataService} from './basics-procurement-structure-intercompany-data.service';
import {BasicsProcurementStructureInterCompanyHeaderDataService} from './basics-procurement-structure-intercompany-header-data.service';
import { IMdcContextEntity } from '../model/entities/mdc-context-entity.interface';
import { IInterCompanyStructureEntity } from '../model/entities/inter-company-structure-entity.interface';



export const PROCUREMENT_STRUCTURE_INTER_COMPANY_ENTITY_INFO = EntityInfo.create<IInterCompanyStructureEntity>({
    form: {
        containerUuid: '82e1719253c2421393e0c77fd55caeb1',
        title: {text: 'Intercompany Structure Details', key: 'basics.procurementstructure.interCompanyDetailContainerTitle'},
    },
    grid: {
        title: {
            text: '',
            key: 'basics.procurementstructure.interCompanyContainerTitle'
        },
        containerType: SplitGridContainerComponent,
        providers: ctx => [
            {
                provide: SplitGridConfigurationToken,
                useValue: <ISplitGridConfiguration<IInterCompanyStructureEntity, IMdcContextEntity>>{
                    parent: {
                        uuid: '8708d4b939b944fba20f850cbe937186',
                        columns: [
                            {
                                id: 'id',
                                model: 'Id',
                                type: FieldType.Integer,
                                label: {
                                    text: 'Id',
                                    key: 'basics.procurementstructure.entityId'
                                },
                                sortable: true,
                                visible: true,
                                readonly: true,
                            }, {
                                id: 'description',
                                model: 'DescriptionTranslateType.Translated',
                                type: FieldType.Description,
                                label: {
                                    text: 'Description',
                                    key: 'basics.procurementstructure.entityMdcContextFk'
                                },
                                sortable: true,
                                visible: true,
                                readonly: true,
                            }
                        ],
                        dataServiceToken: BasicsProcurementStructureInterCompanyHeaderDataService
                    }
                }
            }
        ]
    },
    permissionUuid: '87ab146c2fc54357897c20538bb3847c',
    dataService: ctx => ctx.injector.get(BasicsProcurementStructureInterCompanyDataService),
    dtoSchemeId: {moduleSubModule: 'Basics.ProcurementStructure', typeName: 'InterCompanyStructureDto'},
    layoutConfiguration: {
        groups: [
            {
                'gid': 'basicData',
                'title': {
                    'key': 'cloud.common.entityProperties',
                    'text': 'Basic Data'
                },
                'attributes': [
                    'PrcStructureFk',
                    'PrcStructureToFk'
                ]
            }
        ],
        labels: {
            ...prefixAllTranslationKeys('basics.procurementstructure.', {
                'PrcStructureFk': {
                    'key': 'entityPrcStructureFk',
                    'text': 'Procurement Structure'
                },
                'PrcStructureToFk': {
                    'key': 'entityPrcStructureToFk',
                    'text': 'To Procurement Structure'
                }
            })
        },
        overloads: {
            PrcStructureFk: BasicsSharedLookupOverloadProvider.providerBasicsProcurementStructureLookupOverload(true), 
            PrcStructureToFk: BasicsSharedLookupOverloadProvider.providerBasicsProcurementStructureLookupOverload(true), 
        }
    }
});