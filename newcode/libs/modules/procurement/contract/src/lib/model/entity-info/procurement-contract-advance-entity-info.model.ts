/*
 * Copyright(c) RIB Software GmbH
 */

import {EntityInfo} from '@libs/ui/business-base';
import {ProcurementContractAdvanceDataService} from '../../services/procurement-contract-advance-data.service';
import {
    BasicsSharedContractAdvanceEntityInfo,
    BasicsSharedContractAdvanceLayout,
    mergeLayout
} from '@libs/basics/shared';
import {prefixAllTranslationKeys} from '@libs/platform/common';
import {createLookup, FieldType, UiCommonLookupDataFactoryService} from '@libs/ui/common';

export const PROCUREMENT_CONTRACT_ADVANCE_ENTITY_INFO: EntityInfo = BasicsSharedContractAdvanceEntityInfo.create({
    permissionUuid: '06e6c5040b5640ebbd18b99d77717014',
    formUuid: '3e550f8dc3d7421087c699e1a09c72af',
    dataServiceToken: ProcurementContractAdvanceDataService,
    moduleSubModule:'Procurement.Contract',
    typeName:'ConAdvanceDto',
    layout:async context => {
        return mergeLayout(await context.injector.get(BasicsSharedContractAdvanceLayout).generateConfig(), {
            groups: [
                {
                    gid: 'basicData',
                    attributes: ['PrcAdvanceTypeFk']
                }
            ],
            labels: {
                ...prefixAllTranslationKeys('procurement.contract.', {
                    PrcAdvanceTypeFk: {key: 'entityAdvanceType', text: 'Advance Type'}
                })
            },
            overloads: {
                PrcAdvanceTypeFk: {
                    type: FieldType.Lookup,
                    lookupOptions: createLookup({
                        dataService: context.injector.get(UiCommonLookupDataFactoryService).fromSimpleDataProvider('basics.lookup.prcadvancetype', {
                            uuid: '6385bdd89602476a86cecb953dacdf67',
                            valueMember: 'Id',
                            displayMember: 'Description',
                            showClearButton: false
                        })
                    })
                },
            }
        });
    }
});