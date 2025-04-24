/*
 * Copyright(c) RIB Software GmbH
 */
import {Injectable} from '@angular/core';
import { LookupSimpleEntity, UiCommonLookupTypeLegacyDataService } from '@libs/ui/common';

/**
 * ProcurementConfiguration module tab service
 */
@Injectable({
    providedIn: 'root'
})
export class BasicsSharedProcurementConfigurationModuleTabLookupService<TEntity extends object> extends UiCommonLookupTypeLegacyDataService<LookupSimpleEntity, TEntity> {
    public constructor() {
        super('ModuleTab', {
            uuid: '2c8cc1a0e2b34f2180d890c7c5422217',
            idProperty: 'Id',
            valueMember: 'Id',
            displayMember: 'DescriptionInfo.Translated'
        });
    }
}