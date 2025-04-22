/*
 * Copyright(c) RIB Software GmbH
 */

import {
	FeatureKey,
	IReadOnlyFeatureSource,
	FeatureRetrievalFunc
} from '../index';

/**
 * A storage for key-identified features.
 *
 * @group Feature Registry
 */
export class FeatureRegistry implements IReadOnlyFeatureSource {

	private readonly items = new Map<object, object>();

	/**
	 * Registers a new feature on the registry.
	 * The feature is defined by its identifying key and a factory function that supplies the value.
	 *
	 * @typeParam T The type of the feature.
	 *
	 * @param key The key that identifies the feature.
	 * @param retrieve A factory function that supplies the feature instance.
	 * @param overwriteExisting If set to `true`, registering a `key` that already exists in the registry will cause the
	 *   previously registered feature retrieval function to be overwritten.
	 *   If set to `false`, an exception will be thrown in that situation.
	 *
	 * @throws If `key` already exists in the registry and `overwriteExisting` is `false`.
	 */
	public registerFeature<T extends object>(key: FeatureKey<T>, retrieve: FeatureRetrievalFunc<T>, overwriteExisting: boolean = false) {
		if (!overwriteExisting && this.items.has(key)) {
			throw new Error(`The specified key (${key.description}) has already been registered on this feature registry.`);
		}

		this.items.set(key, retrieve);
	}

	/**
	 * Checks whether the registry contains a given feature.
	 *
	 * @typeParam T The type of the feature.
	 *
	 * @param key The key that identifies the feature.
	 *
	 * @returns A value that indicates whether `key` is known to the registry.
	 */
	public hasFeature<T extends object>(key: FeatureKey<T>): boolean {
		return this.items.has(key);
	}

	/**
	 * Retrieves the function that supplies a given feature.
	 *
	 * When a given feature is requested, the feature retrieval function will be executed.
	 * Note that the feature registry does not perform any kind of caching.
	 * If you wish to reuse a value or ensure the feature is a singleton instance, you will need to take care of this yourself.
	 *
	 * @typeParam T the type of the feature.
	 *
	 * @param key The key that identifies the feature.
	 *
	 * @returns The factory function for the feature, or `undefined` if `key` is unknown to the registry.
	 */
	public getFeatureRetrievalFunc<T extends object>(key: FeatureKey<T>): FeatureRetrievalFunc<T> | undefined {
		return <FeatureRetrievalFunc<T> | undefined>this.items.get(key);
	}
}
