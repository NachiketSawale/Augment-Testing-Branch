/*
 * Copyright(c) RIB Software GmbH
 */

import { ProviderToken } from '@angular/core';
import { PropertyPath } from '@libs/platform/common';
import { IEntityModification } from '@libs/platform/data-access';
import { ILookupReadonlyDataService, LookupInputType, TransientFieldSpec } from '@libs/ui/common';

/**
 * A function type that retrieves a lookup key from an entity.
 * @template T - The type of the entity.
 * @param e - The entity from which to retrieve the lookup key.
 * @returns The lookup key, which can be a number, string, IIdentificationData, null, or undefined.
 */
export type LookupKeyGetter<T> = (e: T) => LookupInputType;

/**
 * Lookup transient field specification.
 * @template T - The type of the container entity.
 * @template TL - The type of the lookup entity.
 */
export type LookupTransientFieldSpec<T extends object, TL extends object> = TransientFieldSpec<T> & {
	/**
	 * The model path to the lookup field.
	 */
	lookupModel?: PropertyPath<TL>;
};

/**
 * Configuration interface for lookup fields in a container layout.
 */
export interface ILookupLayoutConfig<T extends object> {
	/**
	 * The group ID to merge the fields into.
	 */
	gid?: string;

	/**
	 * Function to get the lookup key from an entity.
	 */
	lookupKeyGetter: LookupKeyGetter<T>;

	/**
	 * The service to notify about entity updates.
	 */
	dataService: IEntityModification<T> | ProviderToken<IEntityModification<T>>;
}

/**
 * Configuration interface for lookup fields in a container layout.
 * @template T - The type of the entity.
 * @template TL - The type of the lookup entity.
 */
export interface ILookupFieldsConfig<T extends object, TL extends object> extends ILookupLayoutConfig<T> {
	/**
	 * The lookup fields to merge.
	 */
	lookupFields: LookupTransientFieldSpec<T, TL>[];

	/**
	 * The service to retrieve lookup data.
	 */
	lookupService: ILookupReadonlyDataService<TL, T> | ProviderToken<ILookupReadonlyDataService<TL, T>>;
}
