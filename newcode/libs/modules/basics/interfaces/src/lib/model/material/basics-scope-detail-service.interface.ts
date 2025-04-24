/*
 * Copyright(c) RIB Software GmbH
 */

import {LazyInjectionToken} from '@libs/platform/common';
import {
	IEntityList, IEntityProcessor,
	IEntityRuntimeDataRegistry,
	IValidationFunctions,
	IValidationService,
} from '@libs/platform/data-access';
import { IMaterialScopeDetailEntity } from '../entities/material/material-scope-detail-entity.interface';


/**
 * Basics ScopeDetail validation service interface, reused by prc item ScopeDetail container
 */
export interface IBasicsScopeDetailValidationService<T extends IMaterialScopeDetailEntity> extends IValidationService<T> {
	generateValidationFunctions(): IValidationFunctions<T>;
}

/**
 * Basics ScopeDetail data service interface
 */
export interface IBasicsScopeDetailDataService<T extends IMaterialScopeDetailEntity> extends IEntityRuntimeDataRegistry<T>, IEntityList<T> {
	readonly readonlyProcessor: IEntityProcessor<T>;

	/**
	 * Get exchange rate
	 */
	getExchangeRate(): number;

	/**
	 * Apply scope total to parent data item.
	 */
	applyScopeTotal(): Promise<void>;

	/**
	 * Reload scope detail price condition
	 */
	reloadPriceCondition(entity: T, priceConditionFk: number, priceListFk?: number): Promise<void>;
}

/**
 * Basics ScopeDetail validation service factory
 */
export interface IBasicsScopeDetailValidationServiceFactory<T extends IMaterialScopeDetailEntity> {
    create(dataService: IBasicsScopeDetailDataService<T>): IBasicsScopeDetailValidationService<T>;
}

export const BASICS_SCOPE_DETAIL_VALIDATION_SERVICE_FACTORY = new LazyInjectionToken<IBasicsScopeDetailValidationServiceFactory<IMaterialScopeDetailEntity>>('basics-scope-detail-validation-service-factory');