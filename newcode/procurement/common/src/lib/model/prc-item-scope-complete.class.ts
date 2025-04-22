/*
 * Copyright(c) RIB Software GmbH
 */

import {CompleteIdentification} from '@libs/platform/common';
import {IPrcItemScopeEntity} from './entities/prc-item-scope-entity.interface';
import {IPrcItemScopeDetailEntity} from './entities/prc-item-scope-detail-entity.interface';
import {PrcItemScopeDetailComplete} from './prc-item-scope-detail-complete.class';
import { Nullable } from '@libs/procurement/shared';

export class PrcItemScopeComplete extends CompleteIdentification<IPrcItemScopeEntity> {
    public MainItemId: Nullable<number>;
    public PrcItemScopeDetailToDelete?: Array<IPrcItemScopeDetailEntity>;
    public PrcItemScopeDetailToSave?: Array<PrcItemScopeDetailComplete>;

    public constructor(public PrcItemScope: Nullable<IPrcItemScopeEntity>) {
        super();
        this.MainItemId = PrcItemScope?.Id;
    }
}