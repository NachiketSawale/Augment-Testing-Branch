/*
 * Copyright(c) RIB Software GmbH
 */
import {Injectable} from '@angular/core';
import {FieldType, LookupSimpleEntity, UiCommonLookupTypeLegacyDataService} from '@libs/ui/common';

@Injectable({
    providedIn: 'root'
})

export class BasicsSharedProcurementConfigurationTotalKindLookupService<TEntity extends object> extends UiCommonLookupTypeLegacyDataService<LookupSimpleEntity, TEntity> {

    /**
     * constructor
     */
    public constructor() {
        super('PrcTotalKind', {
            uuid: 'a42c5a8e7e394e979740831026cceb57',
            idProperty: 'Id',
            valueMember: 'Id',
            displayMember: 'Description',
            gridConfig: {
                columns: [
                    {
                        id: 'Description',
                        model: 'Description',
                        type: FieldType.Description,
                        label: {text: 'Description', key: 'cloud.common.entityDescription'},
                        sortable: true,
                        visible: true,
                        readonly: true
                    }
                ]
            }
        });
    }
}
