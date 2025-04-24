/*
 * Copyright(c) RIB Software GmbH
 */

import {CompleteIdentification} from '@libs/platform/common';
import {IPrcItemScopeDetailEntity} from './entities/prc-item-scope-detail-entity.interface';
import { Nullable } from '@libs/procurement/shared';

export class PrcItemScopeDetailComplete extends CompleteIdentification<IPrcItemScopeDetailEntity> {
    public MainItemId: Nullable<number>;

    public constructor(public PrcItemScopeDetail: Nullable<IPrcItemScopeDetailEntity>) {
        super();
        this.MainItemId = PrcItemScopeDetail?.Id;
    }

}