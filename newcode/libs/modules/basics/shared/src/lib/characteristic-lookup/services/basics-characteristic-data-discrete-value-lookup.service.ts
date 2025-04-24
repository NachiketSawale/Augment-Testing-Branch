/*
 * Copyright(c) RIB Software GmbH
 */
import { Injectable } from '@angular/core';
import {
    FieldType, UiCommonLookupEndpointDataService,
} from '@libs/ui/common';
import { ICharacteristicValueEntity } from '@libs/basics/interfaces';
@Injectable({
    providedIn: 'root'
})
export class BasicsSharedCharacteristicDataDiscreteValueLookupService<TEntity extends object> extends UiCommonLookupEndpointDataService<ICharacteristicValueEntity, TEntity> {
    public constructor() {
        super(
            {
                httpRead: {
                    route: 'basics/characteristic/discretevalue/',
                    endPointRead: 'list'
                }
            },
            {
                uuid: '7722fd2ce68a4bf187b6e90052c1ef24',
                idProperty: 'Id',
                valueMember: 'Id',
                displayMember: 'DescriptionInfo.Translated',
                gridConfig: {
                    columns: [
                        {
                            id: 'desc',
                            model: 'DescriptionInfo',
                            type: FieldType.Translation,
                            label: {text: 'Description', key: 'cloud.common.entityDescription'},
                            sortable: true,
                            visible: true,
                            readonly: true,
                        },
                    ]
                },
                showGrid: true,
                disableDataCaching: true
            });
    }
}