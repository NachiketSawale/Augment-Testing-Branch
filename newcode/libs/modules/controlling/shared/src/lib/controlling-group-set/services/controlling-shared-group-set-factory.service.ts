/*
 * Copyright(c) RIB Software GmbH
 */


import { ControllingSharedGroupSetDataService } from './controlling-shared-group-set-data.service';
import { ControllingUnitGroupSetCompleteIdentification, ControllingUnitGroupSetParentServiceFlatTypes, IControllingUnitdGroupSetEntity, IControllingUnitGroupSetEntityIdentification } from '@libs/controlling/interfaces';
import { Injectable, ProviderToken, runInInjectionContext } from '@angular/core';
import { ServiceLocator } from '@libs/platform/common';


export interface IControllingSharedGroupSetServiceInterface<PT extends IControllingUnitGroupSetEntityIdentification> {
	getBasItemTypeId(parent: PT): number | null | undefined;
}

@Injectable({
	providedIn: 'root',
})
export class DynamicControllingGroupSetFactoryService {
	public createDynamicService<PT extends IControllingUnitGroupSetEntityIdentification, PU extends ControllingUnitGroupSetCompleteIdentification<PT>>(
		parentServiceToken: ProviderToken<ControllingUnitGroupSetParentServiceFlatTypes<PT, PU>>,
		methods?: Record<keyof IControllingSharedGroupSetServiceInterface<PT>, (parent: PT) => number | null | undefined>
	): ControllingSharedGroupSetDataService<IControllingUnitdGroupSetEntity, PT, PU> {
		return runInInjectionContext(ServiceLocator.injector, () => {
			const parentService = ServiceLocator.injector.get(parentServiceToken);
			const service = new ControllingSharedGroupSetDataService<IControllingUnitdGroupSetEntity, PT, PU>(parentService);
			if (methods) {
				for (const key of Object.keys(methods)) {
					if (typeof methods[key as keyof IControllingSharedGroupSetServiceInterface<PT>] === 'function') {
						service[key as keyof IControllingSharedGroupSetServiceInterface<PT>] =
							methods[key as keyof IControllingSharedGroupSetServiceInterface<PT>].bind(service);
					}
				}
			}
			return service;
		});
	}
}


