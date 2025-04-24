/*
 * Copyright(c) RIB Software GmbH
 */

import { EntityReadonlyProcessorBase, ReadonlyFunctions } from '@libs/basics/shared';
import { ConstructionSystemMasterHeaderDataService } from '../construction-system-master-header-data.service';
import { ICosHeaderEntity } from '@libs/constructionsystem/shared';

/**
 * Construction System Header readonly processor
 */
export class ConstructionSystemMasterHeaderReadonlyProcessorService extends EntityReadonlyProcessorBase<ICosHeaderEntity> {
	/**
	 *The constructor
	 */
	public constructor(protected dataService: ConstructionSystemMasterHeaderDataService) {
		super(dataService);
	}

	public override generateReadonlyFunctions(): ReadonlyFunctions<ICosHeaderEntity> {
		return {
			RubricCategoryFk: (info) => {
				return !(info.item.Version === 0); // todo-allen: The "readonly processor" is not working in the grid container.
			},
		};
	}
}
