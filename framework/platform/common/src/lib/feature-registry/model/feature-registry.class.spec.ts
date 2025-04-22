/*
 * Copyright(c) RIB Software GmbH
 */

import { IInitializationContext } from '../../../index';
import { FeatureRegistry } from './feature-registry.class';
import { FeatureKey } from './feature-key.class';

class ExampleFeature {
	public constructor(public readonly text: string) {}
}

describe('FeatureRegistry', () => {

	let registry: FeatureRegistry;

	const FEATURE_A_KEY = new FeatureKey<ExampleFeature>('A');
	const FEATURE_B_KEY = new FeatureKey<ExampleFeature>('B');
	const FEATURE_C_KEY = new FeatureKey<ExampleFeature>('C');

	beforeEach(() => {
		registry = new FeatureRegistry();
		registry.registerFeature(FEATURE_A_KEY, () => new ExampleFeature('a'));
		registry.registerFeature(FEATURE_B_KEY, () => new ExampleFeature('b'));
	});

	it('can be created', () => {
		expect(registry).toBeTruthy();
	});

	it('indicates that a feature is known', () => {
		const val = registry.hasFeature(FEATURE_A_KEY);
		expect(val).toBeTruthy();
	});

	it('indicates that a feature is unknown', () => {
		const val = registry.hasFeature(FEATURE_C_KEY);
		expect(val).toBeFalsy();
	});

	it('correctly returns a feature retrieval function', () => {
		const val = registry.getFeatureRetrievalFunc(FEATURE_A_KEY);
		expect(val).toBeTruthy();
		const feature = val?.call(this, {} as IInitializationContext);
		expect(feature).toBeTruthy();
		expect(feature).toHaveProperty('text', 'a');
	});

	it('returns undefined for an unknown feature key', () => {
		const val = registry.getFeatureRetrievalFunc(FEATURE_C_KEY);
		expect(val).toBeUndefined();
	});

	it('allows for registering additional features', () => {
		registry.registerFeature(FEATURE_C_KEY, () => new ExampleFeature('c'));
		const val = registry.hasFeature(FEATURE_C_KEY);
		expect(val).toBeTruthy();
	});

	it('can overwrite registered feature keys', () => {
		registry.registerFeature(FEATURE_A_KEY, () => new ExampleFeature('new'), true);
		const val = registry.getFeatureRetrievalFunc(FEATURE_A_KEY);
		const result = val?.call(this, {} as IInitializationContext);
		expect(result).toHaveProperty('text', 'new');
	});

	it('can fail on re-registering a feature key', () => {
		expect(() => registry.registerFeature(FEATURE_A_KEY, () => new ExampleFeature('new'), false)).toThrow();
	});

	it('fails on re-registering a feature key by default', () => {
		expect(() => registry.registerFeature(FEATURE_A_KEY, () => new ExampleFeature('new'))).toThrow();
	});
});
