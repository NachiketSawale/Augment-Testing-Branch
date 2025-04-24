/*
 * Copyright(c) RIB Software GmbH
 */

import {Injectable} from '@angular/core';
import {FieldType, UiCommonLookupTypeLegacyDataService} from '@libs/ui/common';
import {IMaterialScopeEntity} from '@libs/basics/interfaces';

/**
 * Material scope lookup service
 */
@Injectable({
    providedIn: 'root'
})
export class MaterialScopeLookupService extends UiCommonLookupTypeLegacyDataService<IMaterialScopeEntity> {
    public constructor() {
        super('MaterialScope', {
            idProperty: 'Id',
            valueMember: 'MatScope',
            displayMember: 'MatScope',
            uuid: '9243ddcf1b5f7b6473c37a2796f62385',
	         disableInput: true,
            gridConfig: {
                columns: [
                    {
                        id: 'MatScope',
                        model: 'MatScope',
                        type: FieldType.Text,
                        label: { key: 'basics.material.entityMatScope', text: 'Material Scope' },
                        sortable: true,
                        width: 100,
                        readonly: true,
	                     visible: true
                    },
                    {
                        id: 'desc',
                        model: 'DescriptionInfo.Translated',
                        type: FieldType.Translation,
                        label: { key: 'cloud.common.entityDescription', text: 'Description' },
                        sortable: true,
                        width: 120,
                        readonly: true,
	                     visible: true
                    }
                ]
            }
        });
    }
}