/*
 * Copyright(c) RIB Software GmbH
 */

import {IBeserveSearchResultBaseEntity} from './beserve-result-base.interface';
import {IBeserveUpdateAddressDataEntity} from './beserve-update-address-data-entity.interface';

export interface IBeserveUpdateAddressResultEntity extends IBeserveSearchResultBaseEntity<IBeserveUpdateAddressDataEntity[]>{
}
