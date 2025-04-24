/*
 * Copyright(c) RIB Software GmbH
 */

import { FieldType, IGridConfiguration, ILookupContext, LookupEvent, UiCommonLookupTypeDataService, createLookup } from '@libs/ui/common';
import { Injectable } from '@angular/core';
import { ICostCodeEntity, IBasicsUomEntity, ICostcodePriceListEntity, IBasicsCustomizeCostCodeTypeEntity } from '@libs/basics/interfaces';
import { BasicsSharedUomLookupService } from './basics-uom-lookup.service';
import { BasicsSharedCurrencyLookupService } from './currency-lookup.service';
import { CurrencyEntity } from './entities/currency-entity.class';
import { BasicsCostCodesPriceListSelectionLookupService } from './basics-cost-code-price-list-selection-lookup.service';
import { BasicsSharedCostCodeTypeLookupService } from './customize/basics/basics-shared-cost-code-type-lookup.service';

/**
 * Cost code lookup service
 */
@Injectable({
    providedIn: 'root'
})

// TODO - THIS FILE SHOULD BE MIGRATED TO BASICS COST CODDE MODULE ONCE ALL THE IMPLEMENTATION IS CHANGED TO USE LAZY INJECTION USING BASICS_COST_CODES_LOOKUP_PROVIDER_TOKEN
export class BasicsSharedCostCodeLookupService<TEntity extends object> extends UiCommonLookupTypeDataService<ICostCodeEntity, TEntity> {
    /**
     * The constructor
     */
    public configuration!: IGridConfiguration<ICostCodeEntity>;

    private processItem: (item: ICostCodeEntity) => void = (item) => {
        const costCodeList: ICostCodeEntity[] = [];
        costCodeList.push(item);
        this.keepRawDayWorkRate(costCodeList);
    };

    public constructor() {
        super('costcode', {
            uuid: '71a0b76babc841a7baa8bf43460ce7c1',
            idProperty: 'Id',
            valueMember: 'Id',
            displayMember: 'Code',
            gridConfig: {
                treeConfiguration: {
                    parent: (entity) => {
                        if (entity.CostCodeParentFk) {
                            return this.configuration?.items?.find((item) => item.Id === entity.CostCodeParentFk) || null;
                        }
                        return null;
                    },
                    children: (entity) => entity.CostCodes ?? [],
                    collapsed: true
                },
                columns: [
                    {
                        id: 'code',
                        model: 'Code',
                        type: FieldType.Code,
                        label: {
                            text: 'Code',
                            key: 'cloud.common.entityCode'
                        },
                        visible: true,
                        sortable: false,
                        width: 70,
                        readonly: true
                    },
                    {
                        id: 'desc',
                        model: 'DescriptionInfo',
                        type: FieldType.Translation,
                        label: {
                            text: 'Description',
                            key: 'cloud.common.entityDescription'
                        },
                        visible: true,
                        sortable: false,
                        width: 100,
                        readonly: true
                    },
                    {
                        id: 'uomFk',
                        model: 'UomFk',
                        type: FieldType.Lookup,
                        label: {
                            text: 'Uom',
                            key: 'cloud.common.entityUoM'
                        },
                        lookupOptions: createLookup<ICostCodeEntity, IBasicsUomEntity>({
                            dataServiceToken: BasicsSharedUomLookupService,
                            showClearButton: true,
                        }),
                        visible: true,
                        sortable: false,
                        width: 50,
                        readonly: true
                    },
                    {
                        id: 'rate',
                        model: 'Rate',
                        type: FieldType.Money,
                        label: {
                            text: 'Unit Rate',
                            key: 'cloud.common.entityUnitRate'
                        },
                        visible: true,
                        sortable: false,
                        width: 70,
                        readonly: true
                    },
                    {
                        id: 'currencyFk',
                        model: 'CurrencyFk',
                        type: FieldType.Lookup,
                        label: {
                            text: 'Currency',
                            key: 'cloud.common.entityCurrency'
                        },
                        lookupOptions: createLookup<ICostCodeEntity, CurrencyEntity>({
                            dataServiceToken: BasicsSharedCurrencyLookupService,
                            showClearButton: true,
                        }),
                        visible: true,
                        sortable: false,
                        width: 80,
                        readonly: true
                    },
                    {
                        id: 'isLabour',
                        model: 'IsLabour',
                        type: FieldType.Boolean,
                        label: {
                            text: 'Is Labour',
                            key: 'basics.costcodes.isLabour'
                        },
                        visible: true,
                        sortable: false,
                        width: 100,
                        readonly: true
                    },
                    {
                        id: 'isRate',
                        model: 'IsRate',
                        type: FieldType.Boolean,
                        label: {
                            text: 'Is Rate',
                            key: 'basics.costcodes.isRate'
                        },
                        visible: true,
                        sortable: false,
                        width: 100,
                        readonly: true
                    },
                    {
                        id: 'factorCosts',
                        model: 'FactorCosts',
                        type: FieldType.Decimal,
                        label: {
                            text: 'Factor Costs',
                            key: 'basics.costcodes.factorCosts'
                        },
                        visible: true,
                        sortable: false,
                        width: 100,
                        readonly: true
                    },
                    {
                        id: 'realFactorCosts',
                        model: 'RealFactorCosts',
                        type: FieldType.Decimal,
                        label: {
                            text: 'Real Factor Costs',
                            key: 'basics.costcodes.realFactorCosts'
                        },
                        visible: true,
                        sortable: false,
                        width: 100,
                        readonly: true
                    },
                    {
                        id: 'ractorQuantity',
                        model: 'FactorQuantity',
                        type: FieldType.Decimal,
                        label: {
                            text: 'Factor Quantity',
                            key: 'basics.costcodes.factorQuantity'
                        },
                        visible: true,
                        sortable: false,
                        width: 100,
                        readonly: true
                    },
                    {
                        id: 'realFactorQuantity',
                        model: 'RealFactorQuantity',
                        type: FieldType.Decimal,
                        label: {
                            text: 'Real Factor Quantity',
                            key: 'basics.costcodes.realFactorQuantity'
                        },
                        visible: true,
                        sortable: false,
                        width: 100,
                        readonly: true
                    },
                    {
                        id: 'costCodeTypeFk',
                        model: 'CostCodeTypeFk',
                        type: FieldType.Lookup,
                        label: {
                            text: 'Type',
                            key: 'basics.costcodes.entityType'
                        },
                        lookupOptions: createLookup<ICostCodeEntity, IBasicsCustomizeCostCodeTypeEntity>({
                            dataServiceToken: BasicsSharedCostCodeTypeLookupService,
                            showClearButton: true
                        }),
                        visible: true,
                        sortable: false,
                        width: 100,
                        readonly: true
                    },
                    {
                        id: 'dayWorkRate',
                        model: 'DayWorkRate',
                        type: FieldType.Money,
                        label: {
                            text: 'DayWork Rate',
                            key: 'basics.costcodes.dayWorkRate'
                        },
                        visible: true,
                        sortable: false,
                        width: 100,
                        readonly: true
                    },
                    {
                        id: 'remark',
                        model: 'Remark',
                        type: FieldType.Remark,
                        label: {
                            text: 'Remark',
                            key: 'cloud.common.entityRemark'
                        },
                        visible: true,
                        sortable: false,
                        width: 100,
                        readonly: true
                    },
                    {
                        id: 'CostCodePriceListFk',
                        model: 'CostCodePriceListFk',
                        type: FieldType.Lookup,
                        label: {
                            text: 'Price Version',
                            key: 'basics.costcodes.costCodePriceListFk'
                        },
                        lookupOptions: createLookup<ICostCodeEntity, ICostcodePriceListEntity>({
                            dataServiceToken: BasicsCostCodesPriceListSelectionLookupService,
                            events: [
                                {
                                    name: 'onSelectedItemChanged', handler: (e => {
                                        if (e && e.context.entity) {
                                            const selectedItem = (e as LookupEvent<ICostcodePriceListEntity, ICostCodeEntity>).selectedItem as ICostcodePriceListEntity;
                                            if (selectedItem) {
                                                e.context.entity.DayWorkRate = selectedItem.SalesPrice;
                                            } else {
                                                e.context.entity.DayWorkRate = e.context.entity.RawDayWorkRate;
                                                e.context.entity.CostCodePriceListFk = null;
                                            }

                                        }
                                    }),
                                }
                            ],
                            showClearButton: true,
                            serverSideFilter:
                            {
                                key: '',
                                execute(context: ILookupContext<ICostcodePriceListEntity, ICostCodeEntity>) {
                                    return {
                                        costCodeId: context.entity?.Id
                                    };
                                }
                            }
                        }),
                        readonly: false,
                        visible: true,
                        sortable: false,
                        width: 100
                    }
                ],
                skipPermissionCheck: true
            },
            dialogOptions: {
                headerText: {
                    text: 'Cost Codes',
                }
            },
            showDialog: true
        });
        this.dataProcessors.push(
            {
                processItem: this.processItem
            }
        );
    }

    public keepRawDayWorkRate(dataList: ICostCodeEntity[]) {
        dataList.forEach((item) => {
            if (!item.RawDayWorkRate) {
                item.RawDayWorkRate = item.DayWorkRate;
            }
            if (item.CostCodes && item.CostCodes.length > 0) {
                this.keepRawDayWorkRate(item.CostCodes);
            }
        });
        return dataList;
    }
}