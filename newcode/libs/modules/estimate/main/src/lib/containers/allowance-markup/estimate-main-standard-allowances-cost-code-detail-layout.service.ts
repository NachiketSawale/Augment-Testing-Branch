/*
 * Copyright(c) RIB Software GmbH
 */

import {ILayoutConfiguration} from '@libs/ui/common';
import {prefixAllTranslationKeys} from '@libs/platform/common';
import {Injectable} from '@angular/core';
import { IEstAllMarkup2costcodeEntity } from '@libs/estimate/interfaces';

@Injectable({
    providedIn: 'root',
})
export class EstimateMainStandardAllowancesCostCodeDetailLayoutService{
    /*
    * Generate layout configuration
    */
    public async generateConfig():  Promise<ILayoutConfiguration<IEstAllMarkup2costcodeEntity>>{
        return {
            groups: [
                {
                    gid: 'basicData',
                    title: {
                        text: 'cloud.common.entityProperties',
                        key: 'Basic Data',
                    },
                    attributes: ['MdcCostCodeFk', 'DjcTotal', 'GcTotal', 'GaPerc', 'RpPerc', 'AmPerc','GcValue','GaValue','AmValue','RpValue','FmValue','AllowanceValue',
                        'GraPerc','DefMGraPerc','FinMGra','DefMGcPerc','FinMGc','DefMPerc','FinM','DjcTotalOp','DefMOp','FinMOp']
                },
            ],
            labels: {
                ...prefixAllTranslationKeys('estimate.main.', {
                    MdcCostCodeFk: { key: 'mdcCostCodeFk', text : 'MdcCostCode'},
                    DjcTotal: { key: 'djcTotal', text : 'DJC'},
                    GcTotal: { key: 'gcTotal', text : 'GC'},
                    GaPerc: { key: 'gaPerc', text : 'G&A[%]'},
                    RpPerc: { key: 'rpPerc', text : 'R&P[%]'},
                    AmPerc: { key: 'amPerc', text : 'AM[%]'},
                    GcValue: { key: 'gcValue', text : 'GcValue'},
                    GaValue: { key: 'gaValue', text : 'GaValue'},
                    AmValue: { key: 'amValue', text : 'AmValue'},
                    RpValue: { key: 'rpValue', text : 'RpValue'},
                    FmValue: { key: 'fmValue', text : 'FmValue'},
                    AllowanceValue: { key: 'allowanceValue', text : 'AllowanceValue'},
                    GraPerc: { key: 'graPerc', text : 'G&A+R&P+AM[%]'},
                    DefMGraPerc: { key: 'defMGraPerc', text : 'Def.M(G&A+R&P+AM)[%]'},
                    FinMGra: { key: 'finMGra', text : 'M(G&A+R&P+AM)[%]'},
                    DefMGcPerc: { key: 'defMGcPerc', text : 'Def.M(GC)[%]'},
                    FinMGc: { key: 'finMGc', text : 'M(GC)[%]'},
                    DefMPerc: { key: 'defMPerc', text : 'Def.M(Tot.)[%]'},
                    FinM: { key: 'finM', text : 'M(Tot.)[%]'},
                    DjcTotalOp: { key: 'djcTotalOp', text : 'DJC(O)'},
                    DefMOp: { key: 'defMOp', text : 'Def.M(GC)O-Items[%]'},
                    FinMOp: { key: 'finMOp', text : 'M(GC O-Items)[%]'}
                })
            },

            // todo
            // Lookup are not implemented
            overloads:{
                DjcTotal: {readonly: true},
                GcTotal: {readonly: true},
                GraPerc: {readonly: true},
                FinMGra: {readonly: true},
                FinM: {readonly: true},
                DjcTotalOp: {readonly: true},
                FinMOp: {readonly: true},
                FinMGc: {readonly: true},
                FmValue: {readonly: true},
                AllowanceValue: {readonly: true}
                // 'gcvalue':getAllowanceRoundingConfig(true, false),
                // 'gavalue':getAllowanceRoundingConfig(true, false),
                // 'amvalue':getAllowanceRoundingConfig(true, false),
                // 'rpvalue':getAllowanceRoundingConfig(true, false),
                // 'defmop':{
                //     grid: {
                //         editorOptions: {
                //             allownull: true
                //         }
                //     }
                // },
                // 'defmgraperc':{
                //     grid: {
                //         editorOptions: {
                //             allownull: true
                //         }
                //     }
                // },
                // 'defmgcperc':{
                //     grid: {
                //         editorOptions: {
                //             allownull: true
                //         }
                //     }
                // },
                // 'defmperc':{
                //     grid: {
                //         editorOptions: {
                //             allownull: true
                //         }
                //     }
                // }
            }
        };
    }
}