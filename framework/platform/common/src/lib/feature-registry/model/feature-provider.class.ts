/*
 * Copyright(c) RIB Software GmbH
 */

import { Injector } from '@angular/core';
import {
	FeatureKey,
	IFeatureProvider,
	IReadOnlyFeatureSource
} from '../index';
import {
	IInitializationContext,
	InitializationContext
} from '../../model/index';

/**
 * An implementation of the {@link IFeatureProvider} interface that takes its features from
 * an {@link IReadOnlyFeatureSource} object.
 *
 * @group Feature Registry
 */
export class FeatureProvider implements IFeatureProvider {

	/**
	 * Initializes a new instance.
	 *
	 * @param injector An Angular injector to use for instantiating Angular-based features, if necessary.
	 */
	public constructor(injector: Injector) {
		this.initCtx = new InitializationContext(injector);
	}

	private readonly initCtx: IInitializationContext;

	/**
	 * Gets or sets the feature source currently in use.
	 */
	public source?: IReadOnlyFeatureSource;

	/**
	 * Checks whether the provider knows about a given feature.
	 *
	 * @typeParam T The type of the feature.
	 *
	 * @param key The key that identifies the feature.
	 *
	 * @returns A value that indicates whether `key` is known to the provider.
	 */
	public hasFeature<T extends object>(key: FeatureKey<T>): boolean {
		return this.source?.hasFeature(key) ?? false;
	}

	/**
	 * Retrieves a feature based on its key.
	 *
	 * @typeParam T The type of the feature.
	 *
	 * @param key The key that identifies the feature.
	 *
	 * @returns The feature, or `undefined` if the key is unknown to the provider.
	 */
	public getFeature<T extends object>(key: FeatureKey<T>): T | undefined {
		const retrievalFunc = this.source?.getFeatureRetrievalFunc(key);
		if (retrievalFunc) {
			return retrievalFunc(this.initCtx);
		}
		return undefined;
	}
}
