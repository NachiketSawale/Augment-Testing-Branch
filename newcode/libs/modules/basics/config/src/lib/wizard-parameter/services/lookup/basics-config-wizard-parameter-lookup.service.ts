/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable, inject } from '@angular/core';

import { FieldType, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IWizardParameterLookup } from '../../model/entities/wizard-parameter-lookup.interface';
import { BasicsConfigWizardXGroupDataService } from '../../../wizard-to-group/services/basics-config-wizard-xgroup-data.service';


@Injectable({
    providedIn: 'root'
})


/**
 * Lookup Service for BasicsConfigWizardParameterLookupService from 
 * customize module
 */
export class BasicsConfigWizardParameterLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IWizardParameterLookup, T> {
    /**
     * Used to inject wizard group data service.
     */
    private wizard2GroupDataService = inject(BasicsConfigWizardXGroupDataService);

    public constructor() {
        super(
            {
                httpRead: {
                    route: 'basics/config/wizardparameter/',
                    endPointRead: 'listTypeG',
                    usePostForRead: false,
                },
                filterParam: true,
                prepareListFilter: () => {
                    return 'mainItemId=' + this.filter();
                }
            },
            {
                uuid: '103908ea1ef04f5d8ec0682593459e61',
                idProperty: 'Id',
                valueMember: 'Id',
                displayMember: 'Name',
                gridConfig: {
                    columns: [
                        {
                            id: 'Name',
                            model: 'Name',
                            width: 300,
                            type: FieldType.Description,
                            label: {
                                text: 'Wizard Parameter Name',
                                key: 'basics.config.entityWizardParameterName'
                            },
                            sortable: true,
                            visible: true,
                            readonly: true
                        },
                    ]
                },
                showDialog: false,
                showGrid: true
            });
    }

    /**
     * Used to get id of wizard to group entity
     * @returns {number}
     */
    private filter(): number {
        let mainItemId = 0;
        const selected = this.wizard2GroupDataService.getSelection()[0];
        if (selected) {
            mainItemId = selected.WizardFk as number;
        }
        return mainItemId;
    }
}
