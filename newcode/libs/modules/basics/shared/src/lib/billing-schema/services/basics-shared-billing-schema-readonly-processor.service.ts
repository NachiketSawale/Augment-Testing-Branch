/*
 * Copyright(c) RIB Software GmbH
 */

import { CompleteIdentification, IEntityIdentification } from '@libs/platform/common';
import { ICommonBillingSchemaEntity } from '../model/interfaces/common-billing-schema-entity.interface';
import { CommonBillingSchemaDataService } from '../services/basics-shared-billing-schema.service';
import { EntityReadonlyProcessorBase } from '../../readonly/model/entity-readonly-processor-base.class';
import { ReadonlyFunctions } from '../../readonly/model/readonly-functions.model';

/**
 * basics common billing schema readonly processor
 */
export class CommonBillingSchemaReadonlyProcessorService<T extends ICommonBillingSchemaEntity, PT extends IEntityIdentification, PU extends CompleteIdentification<PT>> extends EntityReadonlyProcessorBase<T> {
	/**
	 *The constructor
	 */
	public constructor(protected dataService: CommonBillingSchemaDataService<T, PT, PU>) {
		super(dataService);
	}

	public generateReadonlyFunctions(): ReadonlyFunctions<T> {
		return {
			Value: (e) => {
				return !e.item.IsEditable;
			},
			ControllingUnitFk: (e) => {
				return !e.item.HasControllingUnit;
			},

		};
	}

	/*
	 * Is whole entity readonly? override this method if the subclass had its own logic
	 */
	protected override readonlyEntity(item: T): boolean {
		return this.dataService.isParentEntityReadyOnly();
	}

}
