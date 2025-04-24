/*
 * Copyright(c) RIB Software GmbH
 */


import { inject, Injectable, Injector, runInInjectionContext } from '@angular/core';
import {
	IMaterialScopeDetailEntity,
	IBasicsScopeDetailDataService,
	IBasicsScopeDetailValidationService,
	IBasicsScopeDetailValidationServiceFactory,
	BASICS_SCOPE_DETAIL_VALIDATION_SERVICE_FACTORY,
} from '@libs/basics/interfaces';
import { LazyInjectable } from '@libs/platform/common';
import { BasicsScopeDetailValidationService } from './basics-scope-detail-validation-service.class';

/**
 * Basics scope detail validation service factory
 */
@Injectable({
	providedIn: 'root'
})
@LazyInjectable({
	token: BASICS_SCOPE_DETAIL_VALIDATION_SERVICE_FACTORY,
	useAngularInjection: true,
})
export class BasicsScopeDetailValidationServiceFactory<T extends IMaterialScopeDetailEntity> implements IBasicsScopeDetailValidationServiceFactory<T> {
	private readonly injector = inject(Injector);

	public create(dataService: IBasicsScopeDetailDataService<T>): IBasicsScopeDetailValidationService<T> {
		return runInInjectionContext(this.injector, () => {
			return new BasicsScopeDetailValidationService(dataService);
		});
	}
}