/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import {Injectable} from '@angular/core';
import {ILayoutConfiguration} from '@libs/ui/common';
import {prefixAllTranslationKeys} from '@libs/platform/common';
import { IEstAllowanceEntity } from '@libs/estimate/interfaces';

@Injectable({
    providedIn: 'root'
})
export class EstimateMainStandardAllowancesLayoutService{
    /*
 * Generate layout configuration
 */
    public async generateConfig(): Promise<ILayoutConfiguration<IEstAllowanceEntity>> {
        return {
            groups: [
                {
                    gid: 'basicData',
                    title: {
                        text: 'cloud.common.entityProperties',
                        key: 'Basic Data',
                    },
                    attributes: ['IsActive', 'Code', 'DescriptionInfo', 'MdcAllowanceTypeFk', 'MdcMarkUpCalcTypeFk','IsOneStep','IsBalanceFp',
                                    'QuantityTypeFk','MarkUpGa','MarkUpRp','MarkUpAm','MdcAllAreaGroupTypeFk']
                }
            ],
            labels: {
                // Prefix all translation keys for the estimate main module and cloud common module
                ...prefixAllTranslationKeys('project.main.', {
                    IsActive: { key: 'entityIsActive', text: 'IsActive' },
                }),
                ...prefixAllTranslationKeys('cloud.common.', {
                    Code: {
                        key: 'entityCode',
                        text: 'Code'
                    },
                    DescriptionInfo: {
                        key: 'entityDescription',
                        text: 'Description'
                    },
                }),
                ...prefixAllTranslationKeys('estimate.main.', {
                    IsActive: { key: 'IsActive', text : 'Is Active'},
                    MdcAllowanceTypeFk: { key: 'mdcAllowanceTypeFk', text : 'Allowance Type'},
                    MdcMarkUpCalcTypeFk: { key: 'mdcMarkUpCalcTypeFk', text : 'Markup Calculation Type'},
                    IsOneStep: { key: 'isOneStep', text : 'Single step Allowance'},
                    QuantityTypeFk: { key: 'quantityType', text : 'Quantity Type'},
                    IsBalanceFp: { key: 'isBalanceFP', text : 'Level out differences from FP items'},
                    MarkUpGa: { key: 'markupGA', text : 'G&A[%]'},
                    MarkUpAm: { key: 'markupAM', text : 'AM[%]'},
                    MarkUpRp: { key: 'markupRP', text : 'R&P[%]'},
                    MdcAllAreaGroupTypeFk: { key: 'areaWise', text : 'Area Wise'}
                })
            },

            // todo
            // Lookup are not implemented
            // 'overloads': {
            //     'code': {
            //         grid: {
            //             editor: 'directive',
            //             formatter: 'code',
            //             required: true,
            //             editorOptions: {
            //                 showClearButton: true,
            //                 directive: 'estimate-main-allowance-code-lookup',
            //                 lookupField: 'Code',
            //                 gridOptions: {
            //                     multiSelect: false
            //                 },
            //                 isTextEditable: true
            //             }
            //         }
            //     },
            //     'mdcmarkupcalctypefk': basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.customize.markupcalculationtype', 'Description',{
            //         events: [
            //             {
            //                 name: 'onSelectedItemChanged',
            //                 handler: function (e, args) {
            //                     $injector.get('estimateMainStandardAllowancesDataService').reCalculateWhenMarkUpCalcTypeChange(args);
            //                 }
            //             }]
            //     }),
            //     'mdcallowancetypefk':basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.customize.allowancetype', 'Description',{
            //         filterKey : 'AllowanceTypeChangeFilter',
            //         events: [
            //             {
            //                 name: 'onSelectedItemChanged',
            //                 handler: function (e, args) {
            //                     let lookupItem = args.selectedItem;
            //                     let allowance = $injector.get('estimateMainStandardAllowancesDataService').getSelected();
            //                     allowance.MdcAllowanceTypeFk = lookupItem.Id;
            //                     allowance.MdcAllAreaGroupTypeFk = lookupItem.Id === 3 ? 1 : null;
            //                     $injector.get('estStandardAllowancesCostCodeDetailDataService').refreshColumns('e4a0ca6ff2214378afdc543646e6b079',allowance);
            //                 }
            //             }]}),
            //     'quantitytypefk':basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.customize.quantitytype', 'Code', {filterKey: 'AllowanceFilter'}),
            //     'mdcallareagrouptypefk':basicsLookupdataConfigGenerator.provideReadOnlyConfig('basics.customize.allareagrouptype', 'Code')
            // }
        };
    }
}