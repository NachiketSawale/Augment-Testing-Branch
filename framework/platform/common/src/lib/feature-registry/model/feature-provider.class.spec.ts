/*
 * Copyright(c) RIB Software GmbH
 */

import { Injector } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { IInitializationContext } from '../../../index';
import {
	FeatureKey,
	FeatureProvider, FeatureRegistry
} from '../index';

class ExampleFeature {
	public constructor(public readonly text: string) {}
}

describe('FeatureProvider', () => {

	let provider: FeatureProvider;

	const FEATURE_A_KEY = new FeatureKey<ExampleFeature>('A');
	const FEATURE_B_KEY = new FeatureKey<ExampleFeature>('B');
	const FEATURE_C_KEY = new FeatureKey<ExampleFeature>('C');

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [],
			providers: [
			]
		}).compileComponents();

		const registry = new FeatureRegistry();
		registry.registerFeature(FEATURE_A_KEY, () => new ExampleFeature('a'));
		registry.registerFeature(FEATURE_B_KEY, () => new ExampleFeature('b'));

		provider = new FeatureProvider(TestBed.inject(Injector));
		provider.source = registry;
	});

	it('can be created', () => {
		expect(provider).toBeTruthy();
	});

	it('indicates that a feature is known', () => {
		const val = provider.hasFeature(FEATURE_A_KEY);
		expect(val).toBeTruthy();
	});

	it('indicates that a feature is unknown', () => {
		const val = provider.hasFeature(FEATURE_C_KEY);
		expect(val).toBeFalsy();
	});


	it('correctly returns a feature instance', () => {
		const val = provider.getFeature(FEATURE_A_KEY);
		expect(val).toBeTruthy();
		expect(val).toHaveProperty('text', 'a');
	});

	it('returns undefined for an unknown feature key', () => {
		const val = provider.getFeature(FEATURE_C_KEY);
		expect(val).toBeUndefined();
	});

	it('acts as if it knew no features without a source', () => {
		provider.source = undefined;
		const val = provider.hasFeature(FEATURE_A_KEY);
		expect(val).toBeFalsy();
	});

	it('takes features from the current source', () => {
		const otherRegistry = new FeatureRegistry();
		otherRegistry.registerFeature(FEATURE_C_KEY, () => new ExampleFeature('c'));
		provider.source = otherRegistry;
		const val = provider.getFeature(FEATURE_C_KEY);
		expect(val).toBeTruthy();
		expect(val).toHaveProperty('text', 'c');
	});

	it('supplies an initialization context object', () => {
		let suppliedContext: IInitializationContext | undefined = undefined;
		const otherRegistry = new FeatureRegistry();
		otherRegistry.registerFeature(FEATURE_C_KEY, ctx => {
			suppliedContext = ctx;
			return new ExampleFeature('c');
		});
		provider.source = otherRegistry;
		provider.getFeature(FEATURE_C_KEY);

		expect(suppliedContext).toBeTruthy();
	});
});
