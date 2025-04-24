/*
 * Copyright(c) RIB Software GmbH
 */

import {Injectable} from '@angular/core';
import {FieldType, UiCommonLookupTypeDataService} from '@libs/ui/common';

@Injectable({
    providedIn: 'root'
})
export class PpsItemLookupService<IEntity extends object> extends UiCommonLookupTypeDataService<IEntity> {
    public constructor() {
        super('PPSItem', {
            valueMember: 'Id',
            displayMember: 'Code',
            uuid: '9f3f15ec583e45c3af5f3ed9907e15ad',
            gridConfig: {
                columns: [{
                    id: 'Code',
                    model: 'Code',
                    type: FieldType.Code,
                    label: {text: 'Code', key: 'cloud.common.entityCode'},
                    sortable: true,
                }, {
                    id: 'Description',
                    model: 'DescriptionInfo.Translated',
                    type: FieldType.Translation,
                    label: {text: 'Description', key: 'cloud.common.entityDescription'},
                    sortable: true,
                }],
            }
        });
    }
}