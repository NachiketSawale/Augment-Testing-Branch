/*
 * Copyright(c) RIB Software GmbH
 */

import { CompleteIdentification, IEntityIdentification } from '@libs/platform/common';
import {
	EntityReadonlyProcessorBase, ReadonlyFunctions
} from '@libs/basics/shared';
import { IProcurementCommonEventsEntity } from '../../model/entities/procurement-common-events-entity.interface';
import { ProcurementCommonEventsDataService } from '../../services/procurement-common-events-data.service';

/**
 * Procurement events entity readonly processor
 */
export class ProcurementCommonEventsReadonlyProcessor<T extends IProcurementCommonEventsEntity, PT extends IEntityIdentification, PU extends CompleteIdentification<PT>> extends EntityReadonlyProcessorBase<T> {

	/**
	 *The constructor
	 */
	public constructor(protected dataService: ProcurementCommonEventsDataService<T, PT, PU>, protected isReadonly: boolean) {
		super(dataService);
	}

	public generateReadonlyFunctions(): ReadonlyFunctions<T> {
		return {
			PrcEventTypeFk: {
				shared: ['StartCalculated', 'EndCalculated', 'StartOverwrite', 'EndOverwrite', 'StartActual', 'EndActual', 'StartRelevant', 'EndRelevant', 'StartActualBool', 'EndActualBool', 'CommentText'],
				readonly: e => this.isReadonly
			}
		};
	}

	protected override readonlyEntity(item: T): boolean {
		return this.isReadonly;
	}
}