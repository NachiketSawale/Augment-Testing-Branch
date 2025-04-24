/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import {Injectable} from '@angular/core';
import {ILayoutConfiguration} from '@libs/ui/common';
import {prefixAllTranslationKeys} from '@libs/platform/common';
import {IEstAllowanceAreaEntity} from '@libs/estimate/interfaces';

@Injectable({
    providedIn: 'root'
})
export class EstimateMainAllowanceAreaLayoutService{
    /*
    * Generate layout configuration
    */
    public async generateConfig(): Promise<ILayoutConfiguration<IEstAllowanceAreaEntity>> {
        return {
            groups: [
                {
                    gid: 'basicData',
                    title: {
                        text: 'cloud.common.entityProperties',
                        key: 'Basic Data',
                    },
                    attributes: ['Code', 'DjcTotal', 'GcTotal'],
                },
            ],
            labels: {
                ...prefixAllTranslationKeys('cloud.common.', {
                    Code: {
                        key: 'entityCode',
                        text: 'Code'
                    }
                }),
                ...prefixAllTranslationKeys('estimate.main.', {
                    DjcTotal: { key: 'DjcTotal', text : 'DJC'},
                    GcTotal: { key: 'GcTotal', text : 'GC'},
                })
            },

            // todo
            // Lookup are not implemented
            overloads:{
                DjcTotal: {readonly: true},
                GcTotal: {readonly: true}
            }
        };
    }
}