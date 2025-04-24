/*
 * Copyright(c) RIB Software GmbH
 */

import {Injectable} from '@angular/core';
import {UiCommonLookupTypeLegacyDataService} from '../services/lookup-type-legacy-data.service';
import {StateEntity} from './entities/state-entity';

/**
 * State lookup service
 */
@Injectable({
  providedIn: 'root'
})
export class UiCommonStateLookupService<TEntity extends object> extends UiCommonLookupTypeLegacyDataService<StateEntity, TEntity> {
  public constructor() {
    super('State', {
      uuid: '',
      idProperty: 'Id',
      valueMember: 'Id',
      displayMember: 'Description'
    });
  }
}