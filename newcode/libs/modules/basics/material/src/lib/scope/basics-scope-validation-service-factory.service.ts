/*
 * Copyright(c) RIB Software GmbH
 */


import {inject, Injectable, Injector, runInInjectionContext} from '@angular/core';
import {
	IMaterialScopeEntity,
	IBasicsScopeDataService,
	IBasicsScopeValidationService,
	IBasicsScopeValidationServiceFactory,
	BASICS_SCOPE_VALIDATION_SERVICE_FACTORY,
} from '@libs/basics/interfaces';
import { LazyInjectable } from '@libs/platform/common';
import {BasicsScopeValidationService} from './basics-scope-validation-service.class';

/**
 * Basics scope validation service
 */
@Injectable({
	providedIn: 'root'
})
@LazyInjectable({
	token: BASICS_SCOPE_VALIDATION_SERVICE_FACTORY,
	useAngularInjection: true,
})
export class BasicsScopeValidationServiceFactory<T extends IMaterialScopeEntity> implements IBasicsScopeValidationServiceFactory<T> {
	private readonly injector = inject(Injector);

	public create(dataService: IBasicsScopeDataService<T>): IBasicsScopeValidationService<T> {
		return runInInjectionContext(this.injector, () => {
			return new BasicsScopeValidationService(dataService);
		});
	}
}