/*
 * Copyright(c) RIB Software GmbH
 */

import { LazyInjectionToken } from '@libs/platform/common';
import { ICommonLookupOptions, ILookupServerSideFilter, TypedConcreteFieldOverload } from '@libs/ui/common';
import { IHsqCheckListEntity } from '../entities/hsq-check-list-entity.interface';

export type RestrictToProjectIds<T> = number[] | number | ((item: T) => number[] | number | undefined | null);

/**
 * Options for checklist lookups.
 */
export interface IChecklistLookupOptions<T extends object> extends ICommonLookupOptions {
	/**
	 * If set, will list only checklist from the listed set of projects.
	 */
	restrictToProjectIds?: RestrictToProjectIds<T>;
	/**
	 * custom serverSide filter
	 */
	customServerSideFilter?: ILookupServerSideFilter<IHsqCheckListEntity, T>;
	/**
	 * boolean, read only.
	 */
	readonly?: boolean;
}

/**
 * Provides model-related lookups.
 */
export interface IChecklistLookupProvider {
	/**
	 * Generates a lookup field overload definition to pick checklist.
	 *
	 * @param options The options to apply to the lookup.
	 *
	 * @returns The lookup field overload.
	 */
	generateChecklistLookup<T extends object>(options?: IChecklistLookupOptions<T>): TypedConcreteFieldOverload<T>;
}

/**
 * A lazy injection to retrieve an object that generates checklist lookup field overloads.
 */
export const CHECKLIST_LOOKUP_PROVIDER_TOKEN = new LazyInjectionToken<IChecklistLookupProvider>('hsqe.checklist.ChecklistLookupProvider');
