/*
 * Copyright(c) RIB Software GmbH
 */

import { LazyInjectionToken } from '@libs/platform/common';
import { ICommonLookupOptions, ILookupServerSideFilter, TypedConcreteFieldOverload } from '@libs/ui/common';
import { IDfmDefectEntity } from '../entities/dfm-defect-entity.interface';

export type RestrictToProjectId<T> = number | ((item: T) => number | undefined | null);

/**
 * Options for defect lookups.
 */
export interface IDefectLookupOptions<T extends object> extends ICommonLookupOptions {
	/**
	 * If set, will list only defect from the listed set of project.
	 */
	restrictToProjectId?: RestrictToProjectId<T>;
	/**
	 * custom serverSide filter
	 */
	customServerSideFilter?: ILookupServerSideFilter<IDfmDefectEntity, T>;
	/**
	 * boolean, read only.
	 */
	readonly?: boolean;
}

/**
 * Provides model-related lookups.
 */
export interface IDefectProvider {
	/**
	 * Generates a lookup field overload definition to pick defect.
	 *
	 * @param options The options to apply to the lookup.
	 *
	 * @returns The lookup field overload.
	 */
	generateDefectLookup<T extends object>(options?: IDefectLookupOptions<T>): TypedConcreteFieldOverload<T>;
}

/**
 * A lazy injection to retrieve an object that generates defect lookup field overloads.
 */
export const DEFECT_LOOKUP_PROVIDER_TOKEN = new LazyInjectionToken<IDefectProvider>('defect.main.DefectLookupProvider');
