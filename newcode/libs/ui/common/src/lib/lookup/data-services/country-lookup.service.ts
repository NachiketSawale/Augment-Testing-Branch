/*
 * Copyright(c) RIB Software GmbH
 */

import {Injectable} from '@angular/core';
import {UiCommonLookupTypeLegacyDataService} from '../services/lookup-type-legacy-data.service';
import {CountryEntity} from './entities/country-entity';

/**
 * Country lookup service
 */
@Injectable({
  providedIn: 'root'
})
export class UiCommonCountryLookupService<TEntity extends object> extends UiCommonLookupTypeLegacyDataService<CountryEntity, TEntity> {
  public constructor() {
    super('country', {
      uuid: '',
      idProperty: 'Id',
      valueMember: 'Id',
      displayMember: 'Description'
    });
  }
}