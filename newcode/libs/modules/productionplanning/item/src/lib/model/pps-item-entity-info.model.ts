/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import {createLookup, FieldType, IGridTreeConfiguration} from '@libs/ui/common';
import {prefixAllTranslationKeys} from '@libs/platform/common';
import {EntityInfo} from '@libs/ui/business-base';
import {BusinessPartnerLookupService} from '@libs/businesspartner/shared';
import {
    BasicsSharedLookupOverloadProvider,
    BasicsSharedClerkLookupService,
    BasicsSharedMaterialGroupLookupService,
    BasicsSharedMaterialLookupService,
    BasicsSharedUomLookupService,
    BasicsSharedPpsItemStatusLookupService,
    BasicsSharedPpsItemTypeLookupService
} from '@libs/basics/shared';
import {
    IBasicsClerkEntity,
    IBasicsCustomizePpsItemStatusEntity,
    IBasicsCustomizePpsItemTypeEntity
} from '@libs/basics/interfaces';
import {PpsItemDataService} from '../services/pps-item-data.service';
import {IPPSItemEntity} from './entities/pps-item-entity.interface';
import {PPS_ITEM_BEHAVIOR_TOKEN} from '../behaviors/pps-item-behavior.service';
import {PPS_ITEM_STRUCTURE_BEHAVIOR_TOKEN} from '../behaviors/pps-item-structure-behavior.service';
import { IBusinessPartnerSearchMainEntity } from '@libs/businesspartner/interfaces';

export const PPS_ITEM_ENTITY_INFO: EntityInfo = EntityInfo.create<IPPSItemEntity>({
    grid: {
        containerUuid: '3598514b62bc409ab6d05626f7ce304b',
        title: {key: 'productionplanning.item.listTitle'},
        behavior: PPS_ITEM_BEHAVIOR_TOKEN
    },
    tree: {
        containerUuid: '5907fffe0f9b44588254c79a70ba3af1',
        title: 'productionplanning.item.treeTitle',
        behavior: PPS_ITEM_STRUCTURE_BEHAVIOR_TOKEN,
        treeConfiguration: ctx => {
            const service = ctx.injector.get(PpsItemDataService);
            return {
                parent: function (entity: IPPSItemEntity) {
                    return service.parentOf(entity);
                },
                children: function (entity: IPPSItemEntity) {
                    return service.childrenOf(entity);
                }
            } as IGridTreeConfiguration<IPPSItemEntity>;
        },
    },
    form: {
        title: {key: 'productionplanning.item.detailTitle'},
        containerUuid: '2ded3fea233f40f4a00a5d9636297df8',
    },
    dataService: ctx => ctx.injector.get(PpsItemDataService),
    dtoSchemeId: {moduleSubModule: 'ProductionPlanning.Item', typeName: 'PPSItemDto'},
    permissionUuid: '5907fffe0f9b44588254c79a70ba3af1',
    layoutConfiguration: {
        groups: [
            {
                gid: 'stateInfoGroup',
                attributes: ['IsUpstreamDefined', 'IsTransportPlanned', 'PPSItemStatusFk']
            },
            {
                gid: 'baseGroup',
                attributes: ['Code', 'DescriptionInfo', 'Reference', 'ProjectFk', 'PPSHeaderFk', 'OrdHeaderFk',
                    'ClerkTecFk', 'EngDrawingDefFk', 'EngDrawingStatusFk', 'IsLive', 'LgmJobFk', 'BusinessPartnerFk',
                    'BusinessPartnerOrderFk', 'ItemTypeFk', 'UserDefinedIcon', 'Comment', 'Userflag1', 'Userflag2']
            },
            {
                gid: 'itemProduction',
                attributes: ['SiteFk', 'MaterialGroupFk', 'MdcMaterialFk', 'Quantity', 'UomFk', 'OpenQuantity',
                    'AssignedQuantity', 'PrjLocationFk', 'ProductionOrder', 'ProductDescriptionFk', 'ProductDescriptionCode']
            },
            {
                gid: 'userDefTextGroup',
                attributes: ['Userdefined1', 'Userdefined2', 'Userdefined3', 'Userdefined4', 'Userdefined5']
            },
        ],
        overloads: {
            IsUpstreamDefined: {
                // type: FieldType.ImageSelecte,
                readonly: true,
            },
            IsTransportPlanned: {
                type: FieldType.Boolean,
                readonly: true,
            },
            PPSHeaderFk: {
                readonly: true,
                // todo lookup
            },
            OrdHeaderFk: {
                readonly: true,
                // todo lookup navigator additional columns
            },
            PPSItemStatusFk: {
                type: FieldType.Lookup,
                lookupOptions: createLookup<IPPSItemEntity, IBasicsCustomizePpsItemStatusEntity>({
                    dataServiceToken: BasicsSharedPpsItemStatusLookupService,
                    displayMember: 'Code',
                    // show icon
                })
            },
            EngDrawingStatusFk: BasicsSharedLookupOverloadProvider.provideEngineeringDrawingStatusReadonlyLookupOverload(),
            ClerkTecFk: {
                type: FieldType.Lookup,
                lookupOptions: createLookup<IPPSItemEntity, IBasicsClerkEntity>({
                    dataServiceToken: BasicsSharedClerkLookupService,
                    showClearButton: true
                })
            },
            SiteFk: {
                // lookup
            },
            MaterialGroupFk: {
                type: FieldType.Lookup,
                lookupOptions: createLookup({
                    dataServiceToken: BasicsSharedMaterialGroupLookupService,
                    showDescription: true,
                    descriptionMember: 'DescriptionInfo.Translated'
                })
            },
            UomFk: {
                type: FieldType.Lookup,
                lookupOptions: createLookup({
                    dataServiceToken: BasicsSharedUomLookupService,
                    showClearButton: true,
                })
            },
            PrjLocationFk: {
                // lookup
            },
            /* todo for additional column branchpath after platform supports feature of additional columns
            code maybe used: PpsCommonLookupOverloadProvider.provideLocationInfoReadonlyLookupOverload(),
            relevant old angularjs code:
            {
                afterId: 'prjlocationfk',
                id: 'branchpath',
                field: 'PrjLocationFk',
                name: '*Location Full Description',
                name$tr$: 'productionplanning.common.branchPath',
                formatter: 'select',
                formatterOptions: {
                    serviceName: 'productionplanningCommonLocationInfoService',
                    valueMember: 'Id',
                    displayMember: 'BranchPath'
                },
                readonly: true
            }
            */
            Quantity: {
                // disallowNegative: true
            },
            OpenQuantity: {
                type: FieldType.Quantity,
                readonly: true,
            },
            AssignedQuantity: {
                type: FieldType.Quantity,
                readonly: true,
            },
            LgmJobFk: {
                // lookup
            },
            BusinessPartnerFk: {
                type: FieldType.Lookup,
                lookupOptions: createLookup<IPPSItemEntity, IBusinessPartnerSearchMainEntity>({
                    dataServiceToken: BusinessPartnerLookupService,
                    displayMember: 'BusinessPartnerName1',
                    readonly: true,
                })
            },
            BusinessPartnerOrderFk: {
                type: FieldType.Lookup,
                lookupOptions: createLookup<IPPSItemEntity, IBusinessPartnerSearchMainEntity>({
                    dataServiceToken: BusinessPartnerLookupService,
                    displayMember: 'BusinessPartnerName1',
                    readonly: true,
                })
            },
            MdcMaterialFk: {
                visible: true,
                type: FieldType.Lookup,
                lookupOptions: createLookup({
                    dataServiceToken: BasicsSharedMaterialLookupService,
                    showClearButton: true,
                    readonly: false,
                    // editable and event handler
                })
            },
            EngDrawingDefFk: {
                // navigator
                // lookup
            },
            ItemTypeFk: {
                type: FieldType.Lookup,
                lookupOptions: createLookup<IPPSItemEntity, IBasicsCustomizePpsItemTypeEntity>({
                    dataServiceToken: BasicsSharedPpsItemTypeLookupService,
                    displayMember: 'DescriptionInfo.Translated',
                    // show icon
                })
            },
            ProjectFk: {
                // readonly lookup
            },
            UserDefinedIcon: {
                // type: FieldType.ImageSelect
                // lookup
            },
            ProductDescriptionFk: {
                // navigator
                // lookup
                // create options
            },
        },
        labels: {
            ...prefixAllTranslationKeys('cloud.common.', {
                PPSItemStatusFk: 'entityStatus',
                BusinessPartnerFk: 'businessPartner',
                ProjectFk: 'entityProject',
                Userdefined1: {key: 'entityUserDefined', params: {p_0: '1'}},
                Userdefined2: {key: 'entityUserDefined', params: {p_0: '2'}},
                Userdefined3: {key: 'entityUserDefined', params: {p_0: '3'}},
                Userdefined4: {key: 'entityUserDefined', params: {p_0: '4'}},
                Userdefined5: {key: 'entityUserDefined', params: {p_0: '5'}},
            }),
            ...prefixAllTranslationKeys('logistic.job.', {
                LgmJobFk: 'titleLogisticJob',
            }),
            ...prefixAllTranslationKeys('basics.common.', {
                Comment: 'entityCommentText',
            }),
            ...prefixAllTranslationKeys('basics.material.', {
                MdcMaterialFk: 'record.material',
            }),
            ...prefixAllTranslationKeys('productionplanning.common.', {
                itemProduction: 'header.production',
                PrjLocationFk: 'prjLocationFk',
                contactsGroup: 'contactsGroup',
                OrdHeaderFk: 'ordHeaderFk',
            }),
            ...prefixAllTranslationKeys('productionplanning.item.', {
                IsUpstreamDefined: 'isUpstreamDefined',
                IsTransportPlanned: 'isTransportPlanned',
                BusinessPartnerOrderFk: 'businessPartnerOrder',
                Reference: 'reference',
                baseGroup: 'baseGroup',
                PPSHeaderFk: 'headerFk',
                ClerkTecFk: 'clerkFk',
                SiteFk: 'siteFk',
                MaterialGroupFk: 'materialGroupFk',
                IsLive: 'isLive',
                Quantity: 'quantity',
                OpenQuantity: 'upstreamItem.openQuantity',
                AssignedQuantity: 'assignedQuantity',
                UomFk: 'uomFk',
                ProductDescriptionFk: 'productDescription',
                ProductDescriptionCode: 'ppsProductTemplateCode',
                EngDrawingDefFk: 'defaultDrawing',
                EngDrawingStatusFk: 'drawingStatus',
                ProductionOrder: 'entityProductionOrder',
                ItemTypeFk: 'entityItemType',
                UserDefinedIcon: 'userDefinedIcon',
                Userflag1: 'userflag1',
                Userflag2: 'userflag2',
            }),
        }
    }
});