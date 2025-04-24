/*
 * Copyright(c) RIB Software GmbH
 */

import { EntityReadonlyProcessorBase, ReadonlyFunctions } from '@libs/basics/shared';
import { IPrcItemEntity, IPrcItemScopeEntity } from '../model/entities';
import { PrcCommonItemComplete } from '../model/procurement-common-item-complete.class';
import { PrcItemScopeDataService } from './prc-item-scope.data.service';
import { CompleteIdentification, IEntityIdentification } from '@libs/platform/common';

export class PrcItemScopeReadonlyProcessor<
	PT extends IPrcItemEntity,
	PU extends PrcCommonItemComplete,
	HT extends IEntityIdentification,
	HU extends CompleteIdentification<HT>
> extends EntityReadonlyProcessorBase<IPrcItemScopeEntity> {

	public constructor(protected dataService: PrcItemScopeDataService<PT, PU, HT, HU>) {
		super(dataService);
	}

	public override generateReadonlyFunctions(): ReadonlyFunctions<IPrcItemScopeEntity> {
		return {
			MatScope: info => !this.dataService.selectedPrcItem?.MdcMaterialFk
		};
	}

	protected override readonlyEntity(item: IPrcItemScopeEntity): boolean {
		return this.dataService.isReadonly();
	}
}