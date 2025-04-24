/*
 * Copyright(c) RIB Software GmbH
 */

import {
    createLookup,
    FieldType,
    IGridConfiguration, ILookupSearchRequest, ILookupSearchResponse, LookupSearchResponse,
    UiCommonLookupTypeDataService
} from '@libs/ui/common';
import {IBasicsCustomizeCostCodeTypeEntity, IBasicsUomEntity} from '@libs/basics/interfaces';
import {
    BasicsSharedCostCodeTypeLookupService,
    BasicsSharedCurrencyLookupService,
    BasicsSharedUomLookupService,
    CurrencyEntity
} from '@libs/basics/shared';
import {EstimateProjectCostCodesEntity} from '../model/estimate-project-cost-codes-entity.class';
import {isNull, isUndefined} from 'lodash';
import {inject, Injectable} from '@angular/core';
import {map, Observable} from 'rxjs';
import {EstimateMainContextService} from '../common/services/estimate-main-context.service';
import {PlatformConfigurationService} from '@libs/platform/common';

@Injectable({
    providedIn: 'root'
})
export class EstimateShareCostCodesLookupService<TEntity extends object> extends UiCommonLookupTypeDataService<EstimateProjectCostCodesEntity, TEntity>{
    public configuration!: IGridConfiguration<EstimateProjectCostCodesEntity>;

    private readonly estimateMainContextService = inject(EstimateMainContextService);
    protected readonly configurationService = inject(PlatformConfigurationService);

    /**
     * The constructor
     */
    public constructor() {
        super('mdcprjcostcodes',{
            uuid: '353cb6c50ba84ca9b82e695911fa6cdb',
            idProperty: 'Id',
            valueMember: 'Id',
            displayMember: 'Code',
            isClientSearch: true,
            disableDataCaching: false,
            autoComplete: true,
            isExactSearch: false,
            gridConfig: {
                treeConfiguration: {
                    parent: (entity) => {
                        if (entity.CostCodeParentFk) {
                            return this.configuration?.items?.find((item) => item.Id === entity.CostCodeParentFk) || null;
                        }
                        return null;
                    },
                    children: (entity) => entity.ProjectCostCodes ?? [],
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
                        id: 'description',
                        model: 'Description',
                        type: FieldType.Description,
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
                            key: 'cloud.common.entityUom'
                        },
                        lookupOptions: createLookup<EstimateProjectCostCodesEntity, IBasicsUomEntity>({
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
                        lookupOptions: createLookup<EstimateProjectCostCodesEntity, CurrencyEntity>({
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
                        lookupOptions: createLookup<EstimateProjectCostCodesEntity, IBasicsCustomizeCostCodeTypeEntity>({
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
                    // TODO: logisticJobLookup
                    // {
                    //     id: 'lgmjobfk',
                    //     field: 'LgmJobFk',
                    //     name: 'Job',
                    //     width: 50,
                    //     name$tr$: 'logistic.job.entityJob',
                    //     formatter: 'lookup',
                    //     formatterOptions: basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
                    //         dataServiceName: 'logisticJobLookupByProjectDataService',
                    //         cacheEnable: true,
                    //         additionalColumns: true,
                    //         filter: function () {
                    //             return estimateMainService.getSelectedProjectId();
                    //         }
                    //     }).grid.formatterOptions
                    // }
                ],
                skipPermissionCheck: true
            },
            selectableCallback: function (selectItem) {
                return !(!isUndefined(selectItem.isMissingParentLevel) && selectItem.isMissingParentLevel);
            },
            dialogOptions: {
                id: '353cb6c50ba84ca9b82e695911fa6cdb',
                headerText: {
                    key: 'basics.costcodes.costCodes',
                    text: 'Cost Codes',
                },
                resizeable: true
            },
            // TODO: Missing estimateMainCommonService
            // events: [
            //     {
            //         name: 'onSelectedItemChanged',
            //         handler: function (e) {
            //             let selectedItem = angular.copy(args.selectedItem);
            //             estimateMainCommonService.setSelectedLookupItem(selectedItem);
            //         }
            //     }
            // ],
            showDialog: true
        });
    }

    /**
     * Get list
     */
    public override getList(): Observable<EstimateProjectCostCodesEntity[]> {

        const estHeaderFk = this.estimateMainContextService.getSelectedEstHeaderId();
        const projectId = this.estimateMainContextService.getProjectId();
        let url = 'estimate/main/lineitem/prjcostcodes?projectId=-1';
        if(!isUndefined(projectId) && estHeaderFk > 0){
            url = 'estimate/main/lineitem/prjestcostcodes?projectId=' + projectId + '&estHeaderFk=' + estHeaderFk;
        }else if(!isUndefined(projectId)){
            url = 'estimate/main/lineitem/prjcostcodes?projectId=' + projectId;
        }
        return new Observable(observer => {
            this.get(url).subscribe(list => {
                let entities = (list as unknown[]).map(e => this.mapEntity(e));

                entities = this.doneAction(entities);
                entities = this.handleList(entities);

                observer.next(entities);
            });
        });
    }

    private doneAction(list: EstimateProjectCostCodesEntity[]): EstimateProjectCostCodesEntity[]{
        list.forEach(item => {
            if (item && item.BasCostCode) {
                item.Code = item.BasCostCode.Code;
                item.DescriptionInfo = item.BasCostCode.DescriptionInfo;
            }
        });

        list.forEach(item => {
            item.ProjectCostCodes = null;
        });
        list = this.buildTree(list);
        return list;
    }

    // TODO: Missing estimateMainLookupService to do filter
    public override getSearchList(request: ILookupSearchRequest): Observable<ILookupSearchResponse<EstimateProjectCostCodesEntity>>{
        return this.getList().pipe(map(list => {
            return new LookupSearchResponse(list);
        }));
    }

    private buildTree(items: EstimateProjectCostCodesEntity[]) {
        const firstItem: EstimateProjectCostCodesEntity[] = [];
        items.forEach(item => {
            const parent = items.find(e => e.Id === item.CostCodeParentFk);
            if (parent) {
                if(!isUndefined(parent.ProjectCostCodes) && !isNull(parent.ProjectCostCodes) && !parent.ProjectCostCodes.find(e => e.Id === item.Id)){
                    parent.ProjectCostCodes?.push(item);
                }
            } else {
                firstItem.push(item);
            }
        });
        return firstItem;
    }
}