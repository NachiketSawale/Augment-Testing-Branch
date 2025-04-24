/*
 * Copyright(c) RIB Software GmbH
 */

import {LazyInjectionToken} from '@libs/platform/common';
import {
    IEntityList,
    IEntityRuntimeDataRegistry,
    IValidationFunctions,
    IValidationService,
} from '@libs/platform/data-access';
import { IMaterialScopeEntity } from '../entities/material/material-scope-entity.interface';

/**
 * Basics scope validation service interface, reused by prc item scope container
 */
export interface IBasicsScopeValidationService<T extends IMaterialScopeEntity> extends IValidationService<T> {
    generateValidationFunctions(): IValidationFunctions<T>;
}

/**
 * Basics scope data service interface
 */
export type IBasicsScopeDataService<T extends IMaterialScopeEntity> = IEntityRuntimeDataRegistry<T> & IEntityList<T>;

/**
 * Basics scope validation service factory
 */
export interface IBasicsScopeValidationServiceFactory<T extends IMaterialScopeEntity> {
    create(dataService: IBasicsScopeDataService<T>): IBasicsScopeValidationService<T>;
}

export const BASICS_SCOPE_VALIDATION_SERVICE_FACTORY = new LazyInjectionToken<IBasicsScopeValidationServiceFactory<IMaterialScopeEntity>>('basics-scope-validation-service-factory');