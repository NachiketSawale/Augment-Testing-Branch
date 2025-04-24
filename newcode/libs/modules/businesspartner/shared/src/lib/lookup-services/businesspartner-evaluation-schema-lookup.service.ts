/*
 * Copyright(c) RIB Software GmbH
 */

import { LookupSimpleEntity, UiCommonLookupTypeDataService } from '@libs/ui/common';
import {Injectable} from '@angular/core';
/**
 * Business Partner Evaluation Schema Lookup Service
 */
@Injectable({
    providedIn: 'root'
})
export class BusinesspartnerSharedEvaluationSchemaLookupService<TEntity extends object> extends UiCommonLookupTypeDataService<LookupSimpleEntity, TEntity> {
    /**
     * constructor
     */
    public constructor() {
        super('EvaluationSchema', {
            uuid: '77c8012f12d742e09f9e484154fe7f88',
            idProperty: 'Id',
            valueMember: 'Id',
            displayMember: 'DescriptionInfo.Translated',
        });
    }
}