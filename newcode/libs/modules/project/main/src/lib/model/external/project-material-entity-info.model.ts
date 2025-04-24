/*
 * Copyright(c) RIB Software GmbH
 */

import {IInitializationContext, prefixAllTranslationKeys} from '@libs/platform/common';
import {EntityInfo} from '@libs/ui/business-base';
import {
    ProjectMaterialBehavior,
    ProjectMaterialDataService,
    ProjectMaterialValidationService
} from '@libs/project/material';
import {createLookup, FieldType, ILookupContext} from '@libs/ui/common';
import {
	BasicsSharedCo2SourceLookupService,
	BasicsSharedCurrencyLookupService,
	BasicsSharedLookupOverloadProvider, BasicsSharedMaterialCatalogLookupService,
	BasicsSharedMaterialDiscountGroupLookupService,
	BasicsSharedMaterialGroupLookupService,
	BasicsSharedProcurementStructureLookupService,
	BasicsSharedTaxCodeLookupService,
	BasicsSharedUomLookupService,
	Co2SourceEntity, BasicsSharedCostTypeLookupService, BasicsSharedPriceConditionLookupService,
} from '@libs/basics/shared';
import {IPrjMaterialEntity} from '@libs/project/interfaces';
import {IMaterialDiscountGroupLookupEntity} from '@libs/basics/interfaces';
import * as entities from '@libs/basics/interfaces';

export const projectMaterialEntityInfo: EntityInfo = EntityInfo.create<IPrjMaterialEntity>({
    grid: {
        title: {text: 'Material'},
        behavior: (ctx) => ctx.injector.get(ProjectMaterialBehavior)
    },
    form: {
        title: { text: 'Material Details' },
        containerUuid: '9b3839487a6445cdb63d307dbf9de780',
    },
    dtoSchemeId: { moduleSubModule: 'Project.Material', typeName: 'PrjMaterialDto' },
    description: {
        text: 'Project Material',
        key: 'cloud.desktop.moduleDisplayNameMaterial',
    },
    dataService: (ctx: IInitializationContext) => {
        return ctx.injector.get(ProjectMaterialDataService);
    },
    // todo: after validation can work fine, show cancel this cancel operation
    validationService: ctx => ctx.injector.get(ProjectMaterialValidationService),
    permissionUuid: '486bac686fa942449b4effcb8b2de308',
    layoutConfiguration: {
        groups: [
            {
                gid: 'default',
                attributes: [
                    'Code',
                    'DescriptionInfo',
                    'DescriptionInfo2',
                    'UomFk',
                    'MdcEstCostTypeFk',
                    'EstCostTypeFk',
                    'MdcEstimatePrice',
                    'EstimatePrice',
                    'BasCurrencyFk',
                    'RetailPrice',
                    'ListPrice',
                    'Discount',
                    'Charges',
                    'Cost',
                    'PriceUnit',
                    'BasUomPriceUnitFk',
                    'PriceExtra',
                    'FactorPriceUnit',
                    'FactorHour',
                    'PrcPriceConditionFk',
                    'MaterialDiscountGroupFk',
                    'MdcTaxCodeFk',
                    'CommentText',
                    'LgmJobFk',
                    'MdcDayWorkRate',
                    'DayWorkRate',
                    'Co2Source',
                    'Co2SourceFk',
                    'Co2Project',
                    'MaterialGroupFk',
                    'MaterialCatalogFk',
                    'PrcStructureFk'
                ],
            },
        ],
        overloads: {
            Code:{ readonly: true},
            BasCurrencyFk: {
                readonly: true,
                type: FieldType.Lookup,
                lookupOptions: createLookup({
                    dataServiceToken: BasicsSharedCurrencyLookupService,
                    showDescription: true,
                    descriptionMember: 'Currency'
                })
            },
            MdcTaxCodeFk: {
                readonly: true,
                type: FieldType.Lookup,
                lookupOptions: createLookup({
                    dataServiceToken: BasicsSharedTaxCodeLookupService,
                    showClearButton: true,
                    showDescription: true,
                    descriptionMember: 'Description'
                })
            },
            PrcStructureFk: {
                type: FieldType.Lookup,
                readonly: true,
                lookupOptions: createLookup({
                    dataServiceToken: BasicsSharedProcurementStructureLookupService,
                    showClearButton: true
                })
            },
            UomFk: BasicsSharedLookupOverloadProvider.provideUoMReadonlyLookupOverload(),
            DescriptionInfo:{ readonly: true},
            DescriptionInfo2:{ readonly: true},
            EstCostTypeFk:{
                readonly: true,
                type: FieldType.Lookup,
                lookupOptions:  createLookup<IPrjMaterialEntity, entities.IBasicsCustomizeCostTypeEntity>( {
                    dataServiceToken: BasicsSharedCostTypeLookupService,
                    showClearButton: false
                })
            },
            MdcEstCostTypeFk:{
                readonly: true,
                type: FieldType.Lookup,
                lookupOptions:  createLookup<IPrjMaterialEntity, entities.IBasicsCustomizeCostTypeEntity>( {
                    dataServiceToken: BasicsSharedCostTypeLookupService,
                    showClearButton: false
                })
            },
            MdcEstimatePrice:{ readonly: true},
            RetailPrice:{ readonly: true},
            Cost:{ readonly: true},
            BasUomPriceUnitFk:{
                type: FieldType.Lookup,
                lookupOptions: createLookup({
                    dataServiceToken: BasicsSharedUomLookupService
                }),
                readonly: true
            },
            PrcPriceConditionFk: {
	            type: FieldType.Lookup,
	            lookupOptions: createLookup({
		            dataServiceToken: BasicsSharedPriceConditionLookupService,
		            showClearButton: true
	            })
            },
            FactorHour:{ readonly: true},
            MaterialDiscountGroupFk:{
                type: FieldType.Lookup,
                lookupOptions: createLookup({
                    dataServiceToken: BasicsSharedMaterialDiscountGroupLookupService,
                    clientSideFilter: {
                        execute(item: IMaterialDiscountGroupLookupEntity, context: ILookupContext<IMaterialDiscountGroupLookupEntity, IPrjMaterialEntity>): boolean {
                            return (item.MaterialCatalogFk === context.entity?.MaterialCatalogFk);
                        }
                    },
                    showDescription: true,
                    descriptionMember: 'DescriptionInfo.Translated',
                    showClearButton: true,
                    showDialog: false
                }),
                readonly: true
            },
            LgmJobFk:{
                // todo: change to lookup type
                readonly: true
            },
            MdcDayWorkRate:{ readonly: true},
            Co2Source:{ readonly: true},
            Co2SourceFk:{
                readonly: true,
                type: FieldType.Lookup,
                lookupOptions: createLookup({
                    dataServiceToken: BasicsSharedCo2SourceLookupService,
                    clientSideFilter: {
                        execute(item: Co2SourceEntity): boolean {
                            return item.IsLive;
                        }
                    }
                })
            },
            MaterialGroupFk:{
                readonly: true,
                type: FieldType.Lookup,
                lookupOptions: createLookup({
                    dataServiceToken: BasicsSharedMaterialGroupLookupService,
                    showDescription: true,
                    descriptionMember: 'DescriptionInfo.Translated'
                })
            },
            MaterialCatalogFk:{
                type: FieldType.Lookup,
                lookupOptions: createLookup({
                    dataServiceToken: BasicsSharedMaterialCatalogLookupService,
                    showDescription: true,
                    descriptionMember: 'DescriptionInfo.Translated'
                }),
                readonly: true
            }
        },
        labels: {
            ...prefixAllTranslationKeys('cloud.common.', {
                Code: {key: 'entityCode'},
                DescriptionInfo: {key: 'entityDescription'},
                UomFk: {key: 'entityUoM'},
                BasCurrencyFk: {key: 'entityCurrency'},
                PrcStructureFk: {key: 'entityStructureCode'}
            }),
            ...prefixAllTranslationKeys('basics.common.', {
                Co2Source: {key: 'sustainabilty.entityCo2Source'},
                Co2SourceFk: {key: 'sustainabilty.entityBasCo2SourceFk'},
                Co2Project: {key: 'sustainabilty.entityCo2Project'}
            }),
            ...prefixAllTranslationKeys('project.material.', {
                FactorHour: { key: 'factorHour' },
                EstimatePrice: {key: 'prjEstimatePrice'},
                RetailPrice: {key: 'prjRetailPrice'},
                ListPrice: {key: 'prjListPrice'},
                Charges: {key: 'prjCharges'},
                Discount: {key: 'prjDiscount'},
                PriceUnit: {key: 'prjPriceUnit'},
                PriceExtra: {key: 'prjPriceExtra'},
                Cost: {key: 'prjCost'},
                FactorPriceUnit: {key: 'prjFactorPriceUnit'},
                BasUomPriceUnitFk: {key: 'prjBasUomPriceUnitFk'},
                PrcPriceConditionFk: {key: 'prjPrcPriceConditionFk'},
                MaterialDiscountGroupFk: {key: 'prjMdcMaterialDiscountGroupFk'},
                MdcTaxCodeFk: {key: 'prjMdcTaxCodeFk'},
                CommentText: {key: 'prjComment'}
            }),
            ...prefixAllTranslationKeys('project.costcodes.', {
                EstCostTypeFk: {key: 'costType'},
                LgmJobFk: {key: 'lgmJobFk'},
                DayWorkRate: {key: 'dayWorkRate'}
            }),
            ...prefixAllTranslationKeys('basics.material.', {
                MaterialGroupFk: {key: 'record.materialGroup', text: 'Material Group'},
                MaterialCatalogFk: {key: 'record.materialCatalog', text: 'Material Catalog'},
                MdcEstCostTypeFk: {key: 'record.estCostTypeFk', text: 'Cost Type'},
                MdcEstimatePrice: {key: 'record.estimatePrice', text: 'Estimate Price'},
                MdcDayWorkRate: {key: 'record.dayworkRate'},
                DescriptionInfo2: {key: 'record.furtherDescription', text: 'Further Description'}
            })
        },
    }
});