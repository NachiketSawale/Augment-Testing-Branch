/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, UiCommonLookupTypeLegacyDataService} from '@libs/ui/common';
import {IQtoFormulaTypeEntity} from '../../model/entities/qto-formula-type-entity.interface';

/**
 * Qto Formula type lookup service
 */
@Injectable({
    providedIn: 'root'
})
export class QtoFormulaTypeLookupService<TEntity extends object> extends UiCommonLookupTypeLegacyDataService<IQtoFormulaTypeEntity, TEntity> {

    public constructor() {
        super('QtoFormulaType', {
            uuid: '96c21ba22802481eafcc51363b2c8f33',
            idProperty: 'Id',
            valueMember: 'Id',
            displayMember: 'Description',
            gridConfig: {
                columns: [
                    {
                        id: 'Description',
                        model: 'Description',
                        type: FieldType.Translation,
                        label: { text: 'Description', key: 'cloud.common.entityDescription' },
                        sortable: true,
                        visible: true,
                        readonly: true
                    }
                ]
            }
        });
    }
}
