/*
 * Copyright(c) RIB Software GmbH
 */

import { CompleteIdentification, IEntityIdentification } from '@libs/platform/common';
import { PrcItemScopeDetailDataService } from './prc-item-scope-detail-data.service';
import { BasicsScopeDetailReadonlyProcessor } from '@libs/basics/shared';
import { IPrcItemEntity, IPrcItemScopeDetailEntity } from '../../model/entities';
import { PrcCommonItemComplete } from '../../model/procurement-common-item-complete.class';


export class PrcItemScopeDetailReadonlyProcessor<
	PT extends IPrcItemEntity,
	PU extends PrcCommonItemComplete,
	HT extends IEntityIdentification,
	HU extends CompleteIdentification<HT>
> extends BasicsScopeDetailReadonlyProcessor<IPrcItemScopeDetailEntity> {
	public constructor(protected dataService: PrcItemScopeDetailDataService<PT, PU, HT, HU>) {
		super(dataService);
	}

	protected override readonlyEntity(item: IPrcItemScopeDetailEntity): boolean {
		return this.dataService.scopeService.isReadonly();
	}
}