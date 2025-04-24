/*
 * Copyright(c) RIB Software GmbH
 */
import {Injectable} from '@angular/core';
import {UiCommonLookupTypeLegacyDataService} from '@libs/ui/common';
import {ProcurementStructureEventTypeEntity} from './entities/procurement-structure-event-type-entity';


/*
 * Procurement Structure Event Type
 */
@Injectable({
    providedIn: 'root'
})
export class BasicsSharedProcurementStructureEventTypeLookupService<TEntity extends object> extends UiCommonLookupTypeLegacyDataService<ProcurementStructureEventTypeEntity, TEntity> {
    public constructor() {
        super('PrcEventType', {
            uuid: '2245d9ca5a864b7db2a6dc0e708107eb',
            valueMember: 'Id',
            displayMember: 'DescriptionInfo.Translated'
        });
    }
}