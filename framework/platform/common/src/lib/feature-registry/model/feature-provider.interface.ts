/*
 * Copyright(c) RIB Software GmbH
 */

import { FeatureKey } from '../index';

/**
 * Provides access to key-identified features.
 *
 * @group Feature Registry
 */
export interface IFeatureProvider {

	/**
	 * Checks whether the provider knows about a given feature.
	 *
	 * @typeParam T The type of the feature.
	 *
	 * @param key The key that identifies the feature.
	 *
	 * @returns A value that indicates whether `key` is known to the provider.
	 */
	hasFeature<T extends object>(key: FeatureKey<T>): boolean;

	/**
	 * Retrieves a feature based on its key.
	 *
	 * @typeParam T The type of the feature.
	 *
	 * @param key The key that identifies the feature.
	 *
	 * @returns The feature, or `undefined` if the key is unknown to the provider.
	 */
	getFeature<T extends object>(key: FeatureKey<T>): T | undefined;
}
