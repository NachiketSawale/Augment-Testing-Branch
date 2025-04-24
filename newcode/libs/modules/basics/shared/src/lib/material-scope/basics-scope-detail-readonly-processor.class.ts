/*
 * Copyright(c) RIB Software GmbH
 */

import { EntityReadonlyProcessorBase, ReadonlyFunctions } from '../readonly';
import { IMaterialScopeDetailEntity } from '@libs/basics/interfaces';

export class BasicsScopeDetailReadonlyProcessor<T extends IMaterialScopeDetailEntity> extends EntityReadonlyProcessorBase<T> {

	public generateReadonlyFunctions(): ReadonlyFunctions<T> {
		return {
			PrcStructureFk: {
				shared: ['UomFk'],
				readonly: e => !e.item.MaterialFk
			}
		};
	}

}