/*
 * Copyright(c) RIB Software GmbH
 */

import { EntityReadonlyProcessorBase, ReadonlyFunctions } from '../../readonly';
import { ICashProjectionDetailEntity } from '../models/entities/cash-projection-detail-entity.interface';
import { BasicsSharedCashFlowDataService } from '../services/basics-shared-cash-flow-data.service';

export class BasicsSharedCashFlowReadonlyProcessor<T extends ICashProjectionDetailEntity, PT extends object> extends EntityReadonlyProcessorBase<T> {
	public constructor(protected dataService: BasicsSharedCashFlowDataService<T, PT>) {
		super(dataService);
	}

	public generateReadonlyFunctions(): ReadonlyFunctions<ICashProjectionDetailEntity> {
		return {
			CumCost: {
				shared: ['CumCash', 'PeriodCost', 'PeriodCash'],
				readonly: (e) => e.item.ActPeriodCash > 0 || e.item.ActPeriodCost > 0,
			},
		};
	}
}
