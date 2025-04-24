/*
 * Copyright(c) RIB Software GmbH
 */
import { Injectable } from '@angular/core';

import { FieldType, UiCommonLookupEndpointDataService } from '@libs/ui/common';
import { IBasIndexRateFactorEntity } from '@libs/basics/interfaces';
/**
 * Uom Lookup Service
 */
@Injectable({
    providedIn: 'root'
})
export class BasicsSharedIndexRateFactorLookupService<TEntity extends object = object> extends UiCommonLookupEndpointDataService<IBasIndexRateFactorEntity, TEntity> {
    public constructor() {
        super({
            httpRead: { route: 'basics/indexheader/', endPointRead: 'ratefactorlist' }
        }, {
            uuid: '830d68f417d34e928e2bc60ad511de33',
            valueMember: 'Id',
            displayMember: 'DescriptionInfo.Description',
            gridConfig: {
                columns: [
                    {
                        id: 'Description',
                        model: 'DescriptionInfo',
                        type: FieldType.Translation,
                        label: {text: 'Rate/Factor', key: 'Rate/Factor'},
                        sortable: true,
                        visible: true,
                        readonly: true
                    }
                ]
            }
        });
    }
}