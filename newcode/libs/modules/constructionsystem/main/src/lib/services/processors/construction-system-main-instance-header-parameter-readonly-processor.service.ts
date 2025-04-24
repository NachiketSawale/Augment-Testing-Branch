/*
 * Copyright(c) RIB Software GmbH
 */
import { Injectable } from '@angular/core';
import { EntityReadonlyProcessorBase, ReadonlyFunctions } from '@libs/basics/shared';
import { ConstructionSystemMainInstanceHeaderParameterDataService } from '../construction-system-main-instance-header-parameter-data.service';
import { IInstanceHeaderParameterEntity } from '../../model/entities/instance-header-parameter-entity.interface';
import { ServiceLocator } from '@libs/platform/common';
import { ConstructionSystemMainGlobalParameterLookupService } from '../lookup/construction-system-main-global-parameter-lookup.service';

/**
 * Construction System Master Global Parameter readonly processor
 */
@Injectable({
	providedIn: 'root',
})
export class ConstructionSystemMainInstanceParameterReadonlyProcessorService extends EntityReadonlyProcessorBase<IInstanceHeaderParameterEntity> {
	private readonly globalParameterLookupService = ServiceLocator.injector.get(ConstructionSystemMainGlobalParameterLookupService);
	/**
	 *The constructor
	 */
	public constructor(protected dataService: ConstructionSystemMainInstanceHeaderParameterDataService) {
		super(dataService);
	}

	public override generateReadonlyFunctions(): ReadonlyFunctions<IInstanceHeaderParameterEntity> {
		return {
			ParameterValueVirtual: (info) => {
				return !this.globalParameterLookupService.cache.getList().find((item) => item.Id === info.item.CosGlobalParamFk);
			},
		};
	}
}
