/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityProcessor } from '@libs/platform/data-access';
import { CompleteIdentification, IEntityIdentification } from '@libs/platform/common';
import { IPrcItemEntity, IPrcItemScopeDetailEntity } from '../../model/entities';
import { PrcCommonItemComplete } from '../../model/procurement-common-item-complete.class';
import { PrcItemScopeDetailDataService } from './prc-item-scope-detail-data.service';

export class PrcItemScopeDetailTotalProcessor<
	PT extends IPrcItemEntity,
	PU extends PrcCommonItemComplete,
	HT extends IEntityIdentification,
	HU extends CompleteIdentification<HT>
> implements IEntityProcessor<IPrcItemScopeDetailEntity> {

	public constructor(private dataService: PrcItemScopeDetailDataService<PT, PU, HT, HU>) {

	}

	public process(toProcess: IPrcItemScopeDetailEntity): void {
		this.dataService.scopeDetailCalculator.calculateTotal(toProcess);
		this.calculateTotalQuantity(toProcess);
	}

	public revertProcess(toProcess: IPrcItemScopeDetailEntity): void {

	}

	public calculateTotalQuantity(toProcess: IPrcItemScopeDetailEntity) {
		const prcItem = this.dataService.scopeService.selectedPrcItem!;
		toProcess.TotalQuantity = this.dataService.calculationService.round(this.dataService.roundingType.TotalQuantity, prcItem.Quantity * toProcess.Quantity);
	}
}