/*
 * Copyright(c) RIB Software GmbH
 */

import { FeatureKey } from './feature-key.class';
import { FeatureRetrievalFunc } from './feature-retrieval-func.type';

/**
 * An interface for objects that supply key-identified features.
 *
 * @group Feature Registry
 */
export interface IReadOnlyFeatureSource {

	/**
	 * Checks whether the source contains a given feature.
	 *
	 * @typeParam T The type of the feature.
	 *
	 * @param key The key that identifies the feature.
	 *
	 * @returns A value that indicates whether `key` is known to the source.
	 */
	hasFeature<T extends object>(key: FeatureKey<T>): boolean;

	/**
	 * Retrieves the function that supplies a given feature.
	 *
	 * @typeParam T the type of the feature.
	 *
	 * @param key The key that identifies the feature.
	 *
	 * @returns The factory function for the feature, or `undefined` if `key` is unknown to the source.
	 */
	getFeatureRetrievalFunc<T extends object>(key: FeatureKey<T>): FeatureRetrievalFunc<T> | undefined;
}
