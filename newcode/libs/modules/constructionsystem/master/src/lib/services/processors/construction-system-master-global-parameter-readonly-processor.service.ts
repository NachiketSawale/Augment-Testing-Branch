/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { EntityReadonlyProcessorBase, ReadonlyFunctions } from '@libs/basics/shared';
import { ICosGlobalParamEntity, ParameterDataTypes } from '@libs/constructionsystem/shared';
import { ConstructionSystemMasterGlobalParameterDataService } from '../construction-system-master-global-parameter-data.service';

/**
 * Construction System Master Global Parameter readonly processor
 */
@Injectable({
	providedIn: 'root',
})
export class ConstructionSystemMasterGlobalParameterReadonlyProcessorService extends EntityReadonlyProcessorBase<ICosGlobalParamEntity> {
	/**
	 *The constructor
	 */
	public constructor(protected dataService: ConstructionSystemMasterGlobalParameterDataService) {
		super(dataService);
	}

	public override generateReadonlyFunctions(): ReadonlyFunctions<ICosGlobalParamEntity> {
		return {
			IsLookup: (info) => {
				if (info.item.CosParameterTypeFk === ParameterDataTypes.Boolean) {
					info.item.IsLookup = false;
					return true;
				} else {
					return false;
				}
			},
		};
	}
}
