/*
 * Copyright(c) RIB Software GmbH
 */

import { IInitializationContext, LazyInjectionToken } from '@libs/platform/common';
import { ILookupFieldOverload, ILookupOptions } from '@libs/ui/common';
import { IControllingUnitLookupEntity } from '../../model/lookup-entities/controlling-unit-lookup-entity.interface';

/**
 * Controlling unit lookup options
 */
export interface IControllingUnitLookupOptions<T extends object> {
	/**
	 * check if only allows to select accounting element
	 */
	checkIsAccountingElement?: boolean;
	/**
	 * project getter
	 * @param e container entity
	 */
	projectGetter?: (e: T) => number | undefined | null;
	/**
	 * controlling unit getter
	 * @param e container entity
	 */
	controllingUnitGetter?: (e: T) => number | undefined | null;
	/**
	 * Additional lookup options
	 */
	lookupOptions: Partial<ILookupOptions<IControllingUnitLookupEntity, T>>;
}

/**
 * The search form entity interface for controlling unit lookup
 */
export interface IControllingUnitLookupFormEntity {
	CompanyFk?: number | null;
	PrjProjectFk?: number | null;
}

/**
 * Provides controlling-unit-related lookups.
 */
export interface IControllingUnitLookupProvider {
	/**
	 * Generates a lookup field overload definition to pick a controlling unit.
	 */
	generateControllingUnitLookup<T extends object>(context: IInitializationContext, options?: IControllingUnitLookupOptions<T>): Promise<ILookupFieldOverload<T>>;

	/**
	 * Get search form entity interface for controlling unit lookup
	 */
	getSearchFormEntity(): IControllingUnitLookupFormEntity;
}

/**
 * A lazy injection to retrieve an object that generates controlling unit lookup field overloads.
 */
export const CONTROLLING_UNIT_LOOKUP_PROVIDER_TOKEN = new LazyInjectionToken<IControllingUnitLookupProvider>('controlling.shared.ControllingUnitLookupProvider');
