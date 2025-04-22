/*
 * Copyright(c) RIB Software GmbH
 */

/**
 * Identifies a feature that can be retrieved by a key from an {@link IFeatureProvider}.
 *
 * @typeParam T The type of the feature.
 *
 * @group Feature Registry
 */
// This type parameter is actually required to establish the compile-time type of feature retrieval expressions.
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export class FeatureKey<T extends object> {

	/**
	 * Initializes a new feature key.
	 *
	 * @param description A description of the feature key.
	 *   This serves merely for debugging purposes and is not evaluated by the application.
	 */
	public constructor(public readonly description: string) {}
}
