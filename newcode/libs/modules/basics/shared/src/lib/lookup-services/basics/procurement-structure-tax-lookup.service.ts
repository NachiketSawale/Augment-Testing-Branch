/*
 * Copyright(c) RIB Software GmbH
 */

import {Injectable} from '@angular/core';
import {UiCommonLookupTypeDataService} from '@libs/ui/common';
import {IPrcStructureTaxEntity} from '@libs/basics/interfaces';

@Injectable({
    providedIn: 'root'
})
export class BasicsSharedPrcStructureTaxLookupService extends UiCommonLookupTypeDataService<IPrcStructureTaxEntity> {
    public constructor() {
        super('PrcStructureTax', {
            uuid: '79c86bdccdcd9608a57fe0224ac8dc44',
            valueMember: 'Id',
            displayMember: 'CommentText'
        });
    }
}