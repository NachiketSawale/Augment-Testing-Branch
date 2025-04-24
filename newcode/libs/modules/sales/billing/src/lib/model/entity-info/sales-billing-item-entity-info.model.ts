/*
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo } from '@libs/ui/business-base';
import { SalesBillingItemDataService } from '../../services/sales-billing-item-data.service';
import { SalesBillingItemBehavior } from '../../behaviors/sales-billing-item-behavior.service';
import { IItemEntity } from '@libs/sales/interfaces';
import { SalesBillingLabels } from '../sales-billing-labels.class';
import { SalesCommonLabels } from '@libs/sales/common';
import { BasicsSharedCompanyContextService, BasicsSharedLookupOverloadProvider, BasicsSharedMaterialLookupService, BasicsSharedSalesTaxGroupLookupService, BasicsSharedUomLookupService, IMaterialSearchEntity } from '@libs/basics/shared';
import { createLookup, FieldType, ILayoutConfiguration, ILookupContext } from '@libs/ui/common';
import { IControllingUnitLookupEntity } from '@libs/controlling/interfaces';
import { IBasicsCustomizeSalesTaxGroupEntity } from '@libs/basics/interfaces';
import { PlatformConfigurationService } from '@libs/platform/common';
import { inject } from '@angular/core';
import { ProcurementSharedLookupOverloadProvider } from '@libs/procurement/shared';

/**
 * Entity info for sales billing Item
 */
export const SALES_BILLING_ITEM_ENTITY_INFO: EntityInfo = EntityInfo.create<IItemEntity>({
    grid: {
        title: { key: 'sales.billing.containerTitleItems' },
        behavior: ctx => ctx.injector.get(SalesBillingItemBehavior),
    },
    form: {
        title: { key: 'sales.billing.containerTitleItemDetail' },
        containerUuid: 'a0ac5d8ad3824c08bcc23d887cb45077',
    },
    dataService: ctx => ctx.injector.get(SalesBillingItemDataService),
    dtoSchemeId: { moduleSubModule: 'Sales.Billing', typeName: 'ItemDto' },
    permissionUuid: 'eb36fda6b4de4965b4e98ec012d0506b',
    layoutConfiguration: async ctx => {
        return <ILayoutConfiguration<IItemEntity>>{
            groups: [
                {
                    gid: 'basicData',
                    title: {
                        text: 'Basic Data',
                        key: 'cloud.common.entityProperties'
                    },
                    attributes: ['ItemNo', 'Description1', 'Description2', 'Specification',
                        'CostCodeFk', 'MdcMaterialFk', 'PrcPriceConditionFk', 'PriceExtra', 'PriceExtraOc',
                        'TotalPrice', 'TotalPriceOc', 'PriceGross', 'PriceGrossOc', 'TotalPriceGross', 'TotalPriceGrossOc', 'Total', 'TotalOc', 'TotalGross', 'TotalGrossOc',
                        'Quantity', 'UomFk', 'Price', 'PriceOc', 'AmountNet', 'AmountVat', 'AmountNetOc', 'AmountGross', 'AmountGrossOc',
                        'ControllingUnitFk', 'PrcStructureFk', 'TaxCodeFk', 'MdcSalesTaxGroupFk', 'ICInvHeaderCode']
                },
            ],
            labels: {
                ...SalesBillingLabels.getSalesBillingLabels(),
                ...SalesCommonLabels.getSalesCommonLabels(),
            },
            overloads: {
                ICInvHeaderCode: {
                    readonly: true,
                },
                AmountNet: {
                    readonly: true,
                    isTransient: true
                },
                AmountNetOc: {
                    readonly: true,
                    isTransient: true
                },
                AmountVat: {
                    readonly: true,
                    isTransient: true
                },
                AmountGross: {
                    readonly: true,
                    isTransient: true
                },
                AmountGrossOc: {
                    readonly: true,
                    isTransient: true
                },
                TotalPrice: {
                    readonly: true,
                    isTransient: true
                },
                TotalPriceOc: {
                    readonly: true,
                    isTransient: true
                },
                PriceExtra: {
                    readonly: true,
                },
                PriceExtraOc: {
                    readonly: true
                },
                TotalPriceGross: {
                    readonly: true
                },
                TotalPriceGrossOc: {
                    readonly: true
                },
                Total: {
                    readonly: true
                },
                TotalOc: {
                    readonly: true
                },
                TotalGross: {
                    readonly: true
                },
                TotalGrossOc: {
                    readonly: true
                },
                CostCodeFk: BasicsSharedLookupOverloadProvider.provideCostCodeReadonlyLookupOverload(),
                MdcMaterialFk: {
                    //TODO: navigator: {moduleName: 'basics.material'},
                    type: FieldType.Lookup,
                    lookupOptions: createLookup<IItemEntity, IMaterialSearchEntity>({
                        dataServiceToken: BasicsSharedMaterialLookupService,
                        showClearButton: true,
                    }),
                    additionalFields: [
                        {
                            id: 'Description',
                            displayMember: 'DescriptionInfo.Translated',
                            label: {
                                key: 'procurement.common.prcItemMaterialNo',
                                text: 'Material',
                            },
                            column: true,
                            singleRow: true,
                        },
                    ],
                },
                //TODO:cacheEnable: true
                UomFk: {
                    type: FieldType.Lookup,
                    lookupOptions: createLookup({
                        dataServiceToken: BasicsSharedUomLookupService,
                        showClearButton: false,
                    }),
                    additionalFields: [
                        {
                            displayMember: 'DescriptionInfo.Translated',
                            label: {
                                key: 'procurement.inventory.uomdes',
                                text: 'UoM-Description',
                            },
                            column: true,
                            singleRow: true,
                        },
                    ],
                },
                // TODO: Navigator controlling.structure    
                ControllingUnitFk: await ProcurementSharedLookupOverloadProvider.provideProcurementControllingUnitLookupOverload(ctx, {
                    projectGetter: (e) => e.BilHeaderEntity?.ProjectFk,
                    controllingUnitGetter: (e) => e.ControllingUnitFk,
                    lookupOptions: {
                        showClearButton: true,
                        serverSideFilter: {
                            key: 'sales-common-controlling-unit-filter',
                            execute: (context: ILookupContext<IControllingUnitLookupEntity, IItemEntity>) => {
                                return {
                                    ByStructure: true,
                                    ExtraFilter: false,
                                    PrjProjectFk: context.entity?.BilHeaderEntity?.ProjectFk,
                                    CompanyFk: inject(PlatformConfigurationService).getContext().clientId,
                                    FilterKey: 'sales.common.controlling.unit.filter.isBillingElement',
                                };
                            },
                        },
                    },
                }),
                PrcPriceConditionFk: BasicsSharedLookupOverloadProvider.providePriceConditionLookupOverload(true),
                //TODO: Navigator basics.procurementstructure
                PrcStructureFk: BasicsSharedLookupOverloadProvider.providerBasicsProcurementStructureLookupOverload(true),
                TaxCodeFk: BasicsSharedLookupOverloadProvider.provideTaxCodeListLookupOverload(true),
                MdcSalesTaxGroupFk: {
                    type: FieldType.Lookup,
                    lookupOptions: createLookup({
                        dataServiceToken: BasicsSharedSalesTaxGroupLookupService,
                        showClearButton: true,
                        serverSideFilter: {
                            key: 'saleTaxCodeByLedgerContext-filter',
                            async execute(context: ILookupContext<IBasicsCustomizeSalesTaxGroupEntity, IItemEntity>) {
                                const companyContextService = context.injector.get(BasicsSharedCompanyContextService);
                                await companyContextService.prepareLoginCompany();
                                const loginCompanyEntity = companyContextService.loginCompanyEntity;
                                return {
                                    LedgerContextFk: loginCompanyEntity ? loginCompanyEntity.LedgerContextFk : null,
                                };
                            },
                        }
                    }),
                    additionalFields: [
                        {
                            displayMember: 'DescriptionInfo.Translated',
                            label: {
                                key: 'basics.salestaxcode.salesTaxGroupDes',
                                text: 'Sales Tax Group Description',
                            },
                            column: true,
                            singleRow: true,
                        },
                    ]
                }
            },
        };
    }
});
