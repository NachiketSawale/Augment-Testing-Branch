/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import { createLookup, FieldOverloadSpec, FieldType, ILayoutConfiguration, ILookupContext, ServerSideFilterValueType } from '@libs/ui/common';
import { ProcurementPackageLookupService } from '@libs/procurement/shared';
import { PlatformLazyInjectorService, prefixAllTranslationKeys } from '@libs/platform/common';
import { BasicsSharedAddressDialogComponent, BasicsSharedClerkLookupService, BasicsSharedCurrencyLookupService, BasicsSharedCustomizeLookupOverloadProvider, BasicsSharedLookupOverloadProvider, BasicsSharedProcurementConfigurationLookupService, BasicsSharedProcurementStructureLookupService, createFormDialogLookupProvider } from '@libs/basics/shared';
import { ProcurementOrderProposalContractConfigFilterService } from './filter/procurment-order-proposal-contract-config-filter.service';
import { ProcurementOrderProposalRequisitionConfigFilterService } from './filter/procurment-order-proposal-requisition-config-filter.service';
import { ProjectSharedLookupService } from '@libs/project/shared';
import { ProcurementPackageHeaderProjectFilterService } from '@libs/procurement/package';
import { IProcurementPackageLookupEntity, IProjectStockLookupEntity } from '@libs/basics/interfaces';
import { ProcurementProjectStockLookupService } from '@libs/procurement/common';
import { IOrderProposalEntity } from '../model/entities/order-proposal-entity.interface';
import { BUSINESSPARTNER_RELATED_LOOKUP_PROVIDER_TOKEN } from '@libs/businesspartner/interfaces';

/**
 * The layout service for ProcurementOrderProposals entity container
 */
@Injectable({
    providedIn: 'root'
})
export class ProcurementOrderProposalsGridLayoutService {

    private readonly lazyInjector = inject(PlatformLazyInjectorService);

    public async generateLayout(): Promise<ILayoutConfiguration<IOrderProposalEntity>> {

        const bpRelatedLookupProvider = await this.lazyInjector.inject(BUSINESSPARTNER_RELATED_LOOKUP_PROVIDER_TOKEN);

        const getSubsidiaryLookupOverload = (bpGetter: (entity: IOrderProposalEntity) => number | undefined, supplierGetter: (entity: IOrderProposalEntity) => number | undefined): FieldOverloadSpec<IOrderProposalEntity> => {
            return bpRelatedLookupProvider.getSubsidiaryLookupOverload({
                serverFilterKey: 'order-businesspartner-main-evaluation-subsidiary-filter',
                displayMember: 'AddressLine',
                showClearButton: true,
                restrictToBusinessPartners: bpGetter,
                restrictToSuppliers: supplierGetter
            });
        };

        const getSupplierLookupOverload = (bpGetter: (entity: IOrderProposalEntity) => number | undefined, subsidiaryGetter: (entity: IOrderProposalEntity) => number | undefined, useAdditionalFields?: boolean): FieldOverloadSpec<IOrderProposalEntity> => {
            return bpRelatedLookupProvider.getSupplierLookupOverload({
                serverFilterKey: 'prc-order-subcontactor-supplier-filter',
                displayMember: 'Code',
                showClearButton: true,
                restrictToBusinessPartners: bpGetter,
                restrictToSubsidiaries: subsidiaryGetter,
                ...(useAdditionalFields !== undefined ? { useAdditionalFields: useAdditionalFields } : {}),
            });
        };

        const getContactLookupOverload = (bpGetter: (entity: IOrderProposalEntity) => number | undefined, subsidiaryGetter: (entity: IOrderProposalEntity) => number | undefined): FieldOverloadSpec<IOrderProposalEntity> => {
            return bpRelatedLookupProvider.getContactLookupOverload({
                serverFilterKey: 'prc-order-req-contact-filter',
                displayMember: 'FullName',
                restrictToBusinessPartners: bpGetter,
                restrictToSubsidiaries: subsidiaryGetter
            });
        };

        return {
            groups: [
                {
                    gid: 'baseGroup',
                    title: {
                        text: 'Basic Data',
                        key: 'cloud.common.entityProperties'
                    },
                    attributes: ['PrcConfigurationFk', 'PrcConfigurationReqFk', 'BasClerkPrcFk', 'BasClerkReqFk', 'PrcPackageFk', 'Description',
                        'BusinessPartnerFk', 'SubsidiaryFk', 'SupplierFk', 'ContactFk', 'IsLive', 'LeadTime', 'Tolerance', 'Log',
                        'DeliveryAddressFk', 'ProposedQuantity']
                },
                {
                    gid: 'stockData',
                    title: {
                        text: 'Stock Header',
                        key: 'procurement.stock.title.header'
                    },
                    attributes: ['ProjectFk', 'PrjStockFk', 'StockValuationRuleFk', 'StockAccountingTypeFk', 'CurrencyFk', 'ClerkFk',
                        'StockTotal', 'StockProvisionTotal', 'StockTotalReceipt', 'StockTotalConsumed', 'StockTotalValue', 'StockProvisionReceipt', 'StockProvisionConsumed',
                        'StockTotalProvision', 'StockExpenseTotal', 'StockExpenseConsumed', 'StockExpenses']
                },
                {
                    gid: 'StockTotalData',
                    title: {
                        text: 'Stock Total',
                        key: 'procurement.stock.title.stocktotal'
                    },
                    attributes: ['CatalogCode', 'CatalogDescription', 'PrcStructureFk', 'MaterialCode', 'Description1', 'Description2', 'Specification', 'Quantity', 'Uom', 'Total', 'ProvisionTotal', 'ProvisionPercent', 'ProvisionPeruom', 'Islotmanagement',
                        'MinQuantity', 'MaxQuantity', 'QuantityReceipt', 'QuantityConsumed', 'TotalQuantity', 'TotalReceipt', 'TotalConsumed',
                        'TotalValue', 'ProvisionReceipt', 'ProvisionConsumed', 'TotalProvision', 'ExpenseTotal', 'ExpenseConsumed', 'Expenses', 'QuantityReserved', 'QuantityAvailable', 'OrderProposalStatus', 'LastTransactionDays',
                        'QuantityOnOrder', 'QuantityTotal', 'PendingQuantity', 'TotalQuantityByPending']
                }
            ],
            labels: {
                ...prefixAllTranslationKeys('procurement.orderproposals.', {
                    PrcConfigurationFk: {
                        text: 'Contract Configuration',
                        key: 'header.ContractConfiguration'
                    },
                    PrcConfigurationReqFk: {
                        text: 'Requisition Configuration',
                        key: 'header.ReqConfiguration'
                    },
                    IsLive: {
                        text: 'IsLive',
                        key: 'header.IsLive'
                    },
                    LeadTime: {
                        text: 'LeadTime',
                        key: 'header.LeadTime'
                    },
                    Tolerance: {
                        text: 'Tolerance',
                        key: 'header.Tolerance'
                    },
                    Log: {
                        text: 'Log',
                        key: 'header.Log'
                    },
                    DeliveryAddressFk: {
                        text: 'Delivery Address',
                        key: 'header.DeliveryAddress'
                    },
                    ProposedQuantity: {
                        text: 'Proposed Quantity',
                        key: 'header.ProposedQuantity'
                    },
                }),
                ...prefixAllTranslationKeys('procurement.stock.', {
                    PrcStructureFk: {
                        text: 'Structure',
                        key: 'stocktotal.PrcStructure'
                    },
                    CatalogCode: {
                        text: 'Material Catalog',
                        key: 'stocktotal.materialcatalog'
                    },
                    CatalogDescription: {
                        text: 'Material Catalog description',
                        key: 'stocktotal.materialcatalogdescription'
                    },
                    MaterialCode: {
                        text: 'Material Code',
                        key: 'stocktotal.MdcMaterialFk'
                    },
                    Description1: {
                        text: 'Material Description1',
                        key: 'stocktotal.MdcMaterialdescription1'
                    },
                    Description2: {
                        text: 'Further Description',
                        key: 'stocktotal.MdcMaterialFurtherdescription'
                    },
                    Quantity: {
                        text: 'Quantity',
                        key: 'stocktotal.Quantity'
                    },
                    Uom: {
                        text: 'Uom',
                        key: 'stocktotal.BasUomFk'
                    },
                    Total: {
                        text: 'Total',
                        key: 'stocktotal.Total'
                    },
                    ProvisionTotal: {
                        text: 'Provision Total',
                        key: 'stocktotal.ProvisionTotal'
                    },
                    ProvisionPercent: {
                        text: 'Provision Percent',
                        key: 'stocktotal.ProvisionPercent'
                    },
                    ProvisionPeruom: {
                        text: 'Provision Per Uom',
                        key: 'stocktotal.ProvisionPeruom'
                    },
                    Islotmanagement: {
                        text: 'Is Lot Management',
                        key: 'stocktotal.IslotManagement'
                    },
                    MinQuantity: {
                        text: 'Min Quantity',
                        key: 'stocktotal.MinQuantity'
                    },
                    MaxQuantity: {
                        text: 'Max Quantity',
                        key: 'stocktotal.MaxQuantity'
                    },
                    QuantityReceipt: {
                        text: 'Total Quantity(Receipt)',
                        key: 'stocktotal.QuantityReceipt'
                    },
                    QuantityConsumed: {
                        text: 'Total Quantity(Consumed)',
                        key: 'stocktotal.QuantityConsumed'
                    },
                    TotalQuantity: {
                        text: 'Total Quantity(Difference)',
                        key: 'stocktotal.TotalQuantity'
                    },
                    TotalReceipt: {
                        text: 'Total Value(Receipt)',
                        key: 'stocktotal.TotalReceipt'
                    },
                    TotalConsumed: {
                        text: 'Total Value(Consumed)',
                        key: 'stocktotal.TotalConsumed'
                    },
                    TotalValue: {
                        text: 'Total Value(Difference)',
                        key: 'stocktotal.TotalValue'
                    },
                    ProvisionReceipt: {
                        text: 'Total Provision(Receipt)',
                        key: 'stocktotal.ProvisionReceipt'
                    },
                    ProvisionConsumed: {
                        text: 'Total Provision(Consumed)',
                        key: 'stocktotal.ProvisionConsumed'
                    },
                    TotalProvision: {
                        text: 'Total Provision(Difference)',
                        key: 'stocktotal.TotalProvision'
                    },
                    ExpenseTotal: {
                        text: 'Expense(Receipt)',
                        key: 'stocktotal.ExpenseTotal'
                    },
                    ExpenseConsumed: {
                        text: 'Expense(Consumed)',
                        key: 'stocktotal.ExpenseConsumed'
                    },
                    Expenses: {
                        text: 'Expenses(Difference)',
                        key: 'stocktotal.Expenses'
                    },
                    QuantityReserved: {
                        text: 'Quantity Reserved',
                        key: 'stocktotal.QuantityReserved'
                    },
                    QuantityAvailable: {
                        text: 'Quantity Available',
                        key: 'stocktotal.QuantityAvailable'
                    },
                    OrderProposalStatus: {
                        text: 'Order Proposal',
                        key: 'stocktotal.OrderProposalStatuses'
                    },
                    LastTransactionDays: {
                        text: 'Last Transaction(Days)',
                        key: 'stocktotal.LastTransactionDays'
                    },
                    QuantityOnOrder: {
                        text: 'Quantity On Order',
                        key: 'stocktotal.QuantityOnOrder'
                    },
                    QuantityTotal: {
                        text: 'Quantity Total',
                        key: 'stocktotal.QuantityTotal'
                    },
                    PendingQuantity: {
                        text: 'Pending Quantity',
                        key: 'stocktotal.PendingQuantity'
                    },
                    TotalQuantityByPending: {
                        text: 'Total Quantity(Pending)',
                        key: 'stocktotal.TotalQuantityByPending'
                    },
                    ContactFk: {
                        text: 'Contact',
                        key: 'orderProposal.Contact'
                    },
                    PrjStockFk: {
                        text: 'Stock Code',
                        key: 'header.stockCode'
                    },
                    StockValuationRuleFk: {
                        text: 'Stock Valuation Rule',
                        key: 'header.PrjStockvaluationruleFk'
                    },
                    StockAccountingTypeFk: {
                        text: 'Stock Accounting Type',
                        key: 'header.PrjStockaccountingtypeFk'
                    },
                    CurrencyFk: {
                        text: 'Currency',
                        key: 'header.BasCurrencyFk'
                    },
                    ClerkFk: {
                        text: 'Clerk',
                        key: 'header.BasClerkFk'
                    },
                    StockTotal: {
                        text: 'Total',
                        key: 'header.total'
                    },
                    StockProvisionTotal: {
                        text: 'Provision Total',
                        key: 'header.Provision_Total'
                    },
                    StockTotalReceipt: {
                        text: 'Total Value(Receipt)',
                        key: 'stocktotal.TotalReceipt'
                    },
                    StockTotalConsumed: {
                        text: 'Total Value(Consumed)',
                        key: 'stocktotal.TotalConsumed'
                    },
                    StockTotalValue: {
                        text: 'Total Value(Difference)',
                        key: 'stocktotal.TotalValue'
                    },
                    StockProvisionReceipt: {
                        text: 'Total Provision(Receipt)',
                        key: 'stocktotal.ProvisionReceipt'
                    },
                    StockProvisionConsumed: {
                        text: 'Total Provision(Consumed)',
                        key: 'stocktotal.ProvisionConsumed'
                    },
                    StockTotalProvision: {
                        text: 'Total Provision(Difference)',
                        key: 'stocktotal.TotalProvision'
                    },
                    StockExpenseTotal: {
                        text: 'Expense(Receipt)',
                        key: 'stocktotal.ExpenseTotal'
                    },
                    StockExpenseConsumed: {
                        text: 'Expense(Consumed)',
                        key: 'stocktotal.ExpenseConsumed'
                    },
                    StockExpenses: {
                        text: 'Expenses(Difference)',
                        key: 'stocktotal.Expenses'
                    },
                }),
                ...prefixAllTranslationKeys('cloud.common.', {
                    BasClerkPrcFk: {
                        text: 'Responsible',
                        key: 'entityResponsible'
                    },
                    BasClerkReqFk: {
                        text: 'Requisition Owner',
                        key: 'entityRequisitionOwner'
                    },
                    PrcPackageFk: {
                        text: 'Package',
                        key: 'entityPackage'
                    },
                    Description: {
                        text: 'Description',
                        key: 'entityDescription'
                    },
                    BusinessPartnerFk: {
                        text: 'Business Partner',
                        key: 'entityBusinessPartner'
                    },
                    SubsidiaryFk: {
                        text: 'Subsidiary',
                        key: 'entitySubsidiary'
                    },
                    SupplierFk: {
                        text: 'Supplier Description',
                        key: 'entitySupplierDescription'
                    },
                    ProjectFk: {
                        text: 'Project No.',
                        key: 'entityProjectNo'
                    },
                }),
            },
            overloads: {
                CatalogCode: {
                    //TODO: navigator basics.materialcatalog
                    readonly: true
                },
                CatalogDescription: {
                    readonly: true,
                },
                PrcStructureFk: {
                    readonly: true,
                    //TODO : navigator to basics.procurementstructure
                    grid: {
                        type: FieldType.Lookup,
                        lookupOptions: createLookup({
                            dataServiceToken: BasicsSharedProcurementStructureLookupService,
                            descriptionMember: 'Code',
                        }),
                    },
                    form: {
                        type: FieldType.Lookup,
                        lookupOptions: createLookup({
                            dataServiceToken: BasicsSharedProcurementStructureLookupService,
                            showDescription: true,
                            descriptionMember: 'Description',
                        })
                    }
                },
                MaterialCode: {
                    //TODO : navigator basics.material
                    readonly: true
                },
                Description1: {
                    readonly: true
                },
                Description2: {
                    readonly: true
                },
                Quantity: {
                    readonly: true
                },
                Uom: {
                    readonly: true
                },
                Total: {
                    readonly: true,
                    type: FieldType.Money,
                },
                ProvisionTotal: {
                    readonly: true,
                    type: FieldType.Money,
                },
                ProvisionPercent: {
                    readonly: true,
                    type: FieldType.Money,
                },
                ProvisionPeruom: {
                    readonly: true,
                    type: FieldType.Money,
                },
                Islotmanagement: {
                    readonly: true
                },
                MinQuantity: {
                    readonly: true
                },
                MaxQuantity: {
                    readonly: true
                },
                QuantityReceipt: {
                    readonly: true,
                },
                QuantityConsumed: {
                    readonly: true,
                },
                TotalQuantity: {
                    readonly: true,
                },
                TotalReceipt: {
                    readonly: true,
                    type: FieldType.Money,
                },
                TotalConsumed: {
                    readonly: true,
                    type: FieldType.Money,
                },
                TotalValue: {
                    readonly: true,
                    type: FieldType.Money,
                },
                ProvisionReceipt: {
                    readonly: true,
                    type: FieldType.Money,
                },
                ProvisionConsumed: {
                    readonly: true,
                    type: FieldType.Money,
                },
                TotalProvision: {
                    readonly: true,
                    type: FieldType.Money,
                },
                ExpenseTotal: {
                    readonly: true,
                    type: FieldType.Money,
                },
                ExpenseConsumed: {
                    readonly: true,
                    type: FieldType.Money,
                },
                Expenses: {
                    readonly: true,
                    type: FieldType.Money,
                },
                QuantityReserved: {
                    readonly: true,
                    type: FieldType.Quantity,
                },
                QuantityAvailable: {
                    readonly: true,
                    type: FieldType.Quantity,
                },
                LastTransactionDays: {
                    readonly: true
                },
                QuantityOnOrder: {
                    readonly: true
                },
                QuantityTotal: {
                    readonly: true
                },
                Specification: {
                    readonly: true
                },
                PendingQuantity: {
                    readonly: true
                },
                TotalQuantityByPending: {
                    readonly: true
                },
                PrcConfigurationFk: {
                    readonly: true,
                    grid: {
                        type: FieldType.Lookup,
                        lookupOptions: createLookup({
                            dataServiceToken: BasicsSharedProcurementConfigurationLookupService,
                            descriptionMember: 'DescriptionInfo.Translated',
                            serverSideFilterToken: ProcurementOrderProposalContractConfigFilterService

                        }),
                    },
                    form: {
                        type: FieldType.Lookup,
                        lookupOptions: createLookup({
                            dataServiceToken: BasicsSharedProcurementConfigurationLookupService,
                            serverSideFilterToken: ProcurementOrderProposalContractConfigFilterService
                        }),
                    },

                },
                PrcConfigurationReqFk: {
                    readonly: true,
                    grid: {
                        type: FieldType.Lookup,
                        lookupOptions: createLookup({
                            dataServiceToken: BasicsSharedProcurementConfigurationLookupService,
                            descriptionMember: 'DescriptionInfo.Translated',
                            serverSideFilterToken: ProcurementOrderProposalRequisitionConfigFilterService

                        }),
                    },
                    form: {
                        type: FieldType.Lookup,
                        lookupOptions: createLookup({
                            dataServiceToken: BasicsSharedProcurementConfigurationLookupService,
                            serverSideFilterToken: ProcurementOrderProposalRequisitionConfigFilterService
                        }),
                    },
                },
                BasClerkPrcFk: {
                    readonly: true,
                    grid: BasicsSharedLookupOverloadProvider.providerBasicsClerkLookupOverload(false),
                    form: BasicsSharedLookupOverloadProvider.providerBasicsClerkLookupOverload(true),
                },
                BasClerkReqFk: {
                    readonly: true,
                    grid: BasicsSharedLookupOverloadProvider.providerBasicsClerkLookupOverload(false),
                    form: BasicsSharedLookupOverloadProvider.providerBasicsClerkLookupOverload(true),
                },
                PrcPackageFk: {
                    readonly: true,
                    type: FieldType.Lookup,
                    lookupOptions: createLookup({
                        dataServiceToken: ProcurementPackageLookupService,
                        showDescription: true,
                        descriptionMember: 'Description',
                        //TODO: ServerSide filter 
                        serverSideFilter: {
                            key: '',
                            execute(context: ILookupContext<IProcurementPackageLookupEntity, IOrderProposalEntity>): ServerSideFilterValueType | Promise<ServerSideFilterValueType> {
                                return { ProjectFk: context.entity?.ProjectFk ?? null };
                            },
                        },
                    })
                },
                Description: {
                    readonly: true
                },
                BusinessPartnerFk: bpRelatedLookupProvider.getBusinessPartnerLookupOverload({
                    showClearButton: true,
                    displayMember: 'BusinessPartnerName1',
                }),
                SubsidiaryFk: getSubsidiaryLookupOverload(
                    (e) => e.BusinessPartnerFk,
                    (e) => e.SupplierFk,
                ),

                SupplierFk: getSupplierLookupOverload(
                    (e) => e.BusinessPartnerFk,
                    (e) => e.SubsidiaryFk,
                ),
                ContactFk: getContactLookupOverload(
                    (e) => e.BusinessPartnerFk,
                    (e) => e.SubsidiaryFk,
                ),
                DeliveryAddressFk: {
                    type: FieldType.CustomComponent,
                    componentType: BasicsSharedAddressDialogComponent,
                    providers: createFormDialogLookupProvider({
                        foreignKey: 'DeliveryAddressFk',
                        showDescription: true,
                        descriptionMember: 'AddressLine',
                        showClearButton: true,
                        createOptions: {
                            titleField: 'cloud.common.entityAddress',
                        }
                    }),
                },
                PrjStockFk: {
                    type: FieldType.Lookup,
                    lookupOptions: createLookup<IOrderProposalEntity, IProjectStockLookupEntity>({
                        dataServiceToken: ProcurementProjectStockLookupService,
                    }),
                    additionalFields: [
                        {
                            displayMember: 'Description',
                            label: {
                                key: 'procurement.stock.header.PrjStockDescription',
                            },
                            column: true,
                            singleRow: true,
                        },
                    ],
                    readonly: true,
                },
                ProjectFk: {
                    //TODO: navigator project.main
                    readonly: true,
                    type: FieldType.Lookup,
                    lookupOptions: createLookup({
                        dataServiceToken: ProjectSharedLookupService,
                        serverSideFilterToken: ProcurementPackageHeaderProjectFilterService
                    }),
                    additionalFields: [
                        {
                            displayMember: 'ProjectName',
                            label: {
                                key: 'cloud.common.entityProjectName',
                            },
                            column: true,
                            singleRow: true,
                        },
                    ],
                },
                StockValuationRuleFk: BasicsSharedCustomizeLookupOverloadProvider.provideProjectStockValuationRuleReadonlyLookupOverload(),

                StockAccountingTypeFk: BasicsSharedCustomizeLookupOverloadProvider.provideAuthenticationTypeReadonlyLookupOverload(),

                CurrencyFk: {
                    readonly: true,
                    grid: {
                        width: 100,
                        lookupOptions: createLookup({
                            dataServiceToken: BasicsSharedCurrencyLookupService,
                            showDescription: true,
                            descriptionMember: 'Currency',
                        })

                    },
                    form: {
                        lookupOptions: createLookup({
                            dataServiceToken: BasicsSharedCurrencyLookupService,
                            showDescription: true,
                            descriptionMember: 'Currency',
                            showClearButton: true,
                        })
                    }
                },
                ClerkFk: {
                    grid: {
                        type: FieldType.Lookup,
                        lookupOptions: createLookup({
                            dataServiceToken: BasicsSharedClerkLookupService,
                            showDescription: true,
                            descriptionMember: 'Code'
                        }),
                    },
                    form: {
                        type: FieldType.Lookup,
                        lookupOptions: createLookup({
                            dataServiceToken: BasicsSharedClerkLookupService,
                            showDescription: true,
                            descriptionMember: 'Description',
                            showClearButton: true,
                        }),
                    }
                },
                StockTotal: {
                    readonly: true,
                    type: FieldType.Money,
                },
                StockProvisionTotal: {
                    readonly: true,
                    type: FieldType.Money,
                },
                StockTotalReceipt: {
                    readonly: true,
                    type: FieldType.Money,
                },
                StockTotalConsumed: {
                    readonly: true,
                    type: FieldType.Money,
                },
                StockTotalValue: {
                    readonly: true,
                    type: FieldType.Money,
                },
                StockProvisionReceipt: {
                    readonly: true,
                    type: FieldType.Money,
                },
                StockProvisionConsumed: {
                    readonly: true,
                    type: FieldType.Money,
                },
                StockTotalProvision: {
                    readonly: true,
                    type: FieldType.Money,
                },
                StockExpenseTotal: {
                    readonly: true,
                    type: FieldType.Money,
                },
                StockExpenseConsumed: {
                    readonly: true,
                    type: FieldType.Money,
                },
                StockExpenses: {
                    readonly: true,
                    type: FieldType.Money,
                },
            }
        };
    }
}