/*
 * Copyright(c) RIB Software GmbH
 */

import {FieldType, UiCommonLookupTypeDataService} from '@libs/ui/common';
import {IEstHeaderEntity} from '@libs/estimate/interfaces';
import {Injectable} from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class EstimateShareDocumentProjectLookupService<TEntity extends object> extends UiCommonLookupTypeDataService<IEstHeaderEntity, TEntity> {

    /**
     * constructor
     */
    public constructor() {
        super('EstimateMainHeader',{
            uuid: '434bdad9cbdc4909a68f501cb672c575',
            idProperty: 'Id',
            valueMember: 'Id',
            displayMember: 'Code',
            descriptionMember: 'DescriptionInfo.Translated',
            gridConfig: {
                uuid: '434bdad9cbdc4909a68f501cb672c575',
                columns: [
                    {
                        id: 'Code',
                        model: 'Code',
                        type: FieldType.Description,
                        label: { text: 'Reference', key: 'cloud.common.entityCode' },
                        sortable: true,
                        visible: true,
                    },
                    {
                        id: 'DescriptionInfo',
                        model: 'DescriptionInfo',
                        type: FieldType.Translation,
                        label: { text: 'Description', key: 'cloud.common.entityDescription' },
                        sortable: true,
                        visible: true,
                    },
                ],
            },
            showDescription: true,
            popupOptions: {
                minWidth: 340,
                height: '200px'
            }
        });
    }
}