/*
 * Copyright(c) RIB Software GmbH
 */

import { IBeserveSearchResultDataEntity } from './beserve-search-result-data-entity.interface';
import {IBeserveSearchResultBaseEntity} from './beserve-result-base.interface';

export interface IBeserveSearchResultEntity extends IBeserveSearchResultBaseEntity<IBeserveSearchResultDataEntity[]>{
}
