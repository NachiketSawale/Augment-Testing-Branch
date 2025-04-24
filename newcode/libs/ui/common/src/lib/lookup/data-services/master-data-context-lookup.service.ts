/*
 * Copyright(c) RIB Software GmbH
 */
import {Injectable} from '@angular/core';
import {LookupSimpleEntity} from '../model/lookup-simple-entity';
import {UiCommonLookupSimpleDataService} from '../services/lookup-simple-data.service';

/**
 * todo: the sample of simple lookup data service base on simple lookup data provider, maybe removed from here later.
 */
@Injectable({
    providedIn: 'root'
})
export class UiCommonMasterDataContextLookupService<TEntity extends object = object> extends UiCommonLookupSimpleDataService<LookupSimpleEntity, TEntity> {
    public constructor() {
        super('basics.customize.masterdatacontext', {
            uuid: '',
            valueMember: 'id',
            displayMember: 'description'
        });
    }
}