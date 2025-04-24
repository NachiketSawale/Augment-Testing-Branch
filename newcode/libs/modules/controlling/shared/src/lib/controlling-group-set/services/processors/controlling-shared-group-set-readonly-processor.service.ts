/*
 * Copyright(c) RIB Software GmbH
 */

import { EntityReadonlyProcessorBase, ReadonlyFunctions } from '@libs/basics/shared';
import { ControllingSharedGroupSetDataService } from '../controlling-shared-group-set-data.service';
import { ControllingUnitGroupSetCompleteIdentification, IControllingUnitdGroupSetEntity, IControllingUnitGroupSetEntityIdentification } from '@libs/controlling/interfaces';

/**
 * Controlling Group Set entity readonly processor
 */
export class ControllingSharedGroupSetReadonlyProcessor<T extends IControllingUnitdGroupSetEntity,
	PT extends IControllingUnitGroupSetEntityIdentification, PU extends ControllingUnitGroupSetCompleteIdentification<PT>> extends EntityReadonlyProcessorBase<T> {

	/**
	 *The constructor
	 */
	public constructor(protected dataService: ControllingSharedGroupSetDataService<T, PT, PU>) {
		super(dataService);
	}

	public generateReadonlyFunctions(): ReadonlyFunctions<T> {
		return {
			ControllinggroupdetailFk: e => e.item.ControllinggroupFk === 0
		};
	}
}