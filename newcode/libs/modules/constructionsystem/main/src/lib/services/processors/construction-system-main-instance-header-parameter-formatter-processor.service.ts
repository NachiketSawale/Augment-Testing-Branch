/*
 * Copyright(c) RIB Software GmbH
 */
import { IEntityProcessor } from '@libs/platform/data-access';
import { IInstanceHeaderParameterEntity } from '../../model/entities/instance-header-parameter-entity.interface';
import { ServiceLocator } from '@libs/platform/common';
import { ConstructionSystemMainGlobalParameterLookupService } from '../lookup/construction-system-main-global-parameter-lookup.service';
import { Injectable } from '@angular/core';
import { ConstructionSystemSharedParameterTypeHelperService } from '@libs/constructionsystem/shared';
@Injectable({
	providedIn: 'root',
})
export class ConstructionSystemMainInstanceHeaderParameterFormatterProcessor<T extends IInstanceHeaderParameterEntity> implements IEntityProcessor<T> {
	private readonly constructionSystemSharedParameterTypeHelperService = ServiceLocator.injector.get(ConstructionSystemSharedParameterTypeHelperService);
	public process(toProcess: T): void {
		const globalParameterLookupService = ServiceLocator.injector.get(ConstructionSystemMainGlobalParameterLookupService);
		globalParameterLookupService.getList().subscribe((globalParameters) => {
			const globalParameter = globalParameters.find((item) => item.Id === toProcess.CosGlobalParamFk);
			if (globalParameter) {
				if (globalParameter.IsLookup) {
					toProcess.ParameterValueVirtual = toProcess.ParameterValueVirtual ? Number(toProcess.ParameterValueVirtual) : null;
					toProcess.ParameterValue = toProcess.ParameterValueVirtual;
				} else {
					toProcess.ParameterValueVirtual = this.constructionSystemSharedParameterTypeHelperService.convertValue(toProcess.CosParameterTypeFk, toProcess.ParameterValueVirtual);
				}
			}
		});
	}
	public revertProcess(toProcess: T): void {}
}
