/*
 * Copyright(c) RIB Software GmbH
 */

import { InjectionToken, StaticProvider } from '@angular/core';
import {
	IInitializationContext
} from '../initialization/index';
import {
	IResourceProvider,
	IResourceProviderBase,
	ResourceProvider
} from './resource-provider.model';

class InjectableResourceProviderInfo {

	private constructor(
		public readonly resourceProvider: IResourceProviderBase,
		public readonly staticProviderFunc?: () => StaticProvider[]
	) {
	}

	public static create<TValue>(resourceProvider: IResourceProvider<TValue>, injectionToken?: InjectionToken<TValue>): InjectableResourceProviderInfo {
		const spFunc = injectionToken ?
			() => [resourceProvider?.createStaticProvider(injectionToken)] :
			undefined;
		return new InjectableResourceProviderInfo(resourceProvider, spFunc);
	}

	public static createForStaticProviders(resourceProvider: IResourceProvider<StaticProvider[]>): InjectableResourceProviderInfo {
		return new InjectableResourceProviderInfo(resourceProvider, () => resourceProvider.value);
	}
}

/**
 * Manages a list of resource providers.
 *
 * This class can be used to manage a list of resource providers.
 * It contains functionality to ensure all resource providers have loaded their values.
 */
export class ResourceProvidersList {

	/**
	 * Adds a resource provider.
	 *
	 * @typeParam TValue The type of the resource.
	 *
	 * @param resourceProvider The resource provider to add.
	 * @param injectionToken Optionally, an Angular injection token the resource provider should
	 *   be linked to.
	 * @param fallbackValue A fixed fallback value to use if no resource provider is supplied.
	 *
	 * @throws The method is called after {@link finalizeList} has already been invoked on the instance.
	 */
	public add<TValue>(resourceProvider?: IResourceProvider<TValue>, injectionToken?: InjectionToken<TValue>, fallbackValue?: TValue) {
		this.checkListOpen();

		if (resourceProvider ?? (fallbackValue !== undefined)) {
			this.providers.push(InjectableResourceProviderInfo.create(resourceProvider ?? ResourceProvider.create(fallbackValue), injectionToken));
		}
	}

	/**
	 * Adds a resource provider that returns `StaticProvider` instances for Angular injection.
	 *
	 * @param resourceProvider The resource provider.
	 *
	 * @throws The method is called after {@link finalizeList} has already been invoked on the instance.
	 */
	public addStaticProviders(resourceProvider?: IResourceProvider<StaticProvider[]>) {
		this.checkListOpen();

		if (resourceProvider) {
			this.providers.push(InjectableResourceProviderInfo.createForStaticProviders(resourceProvider));
		}
	}

	/**
	 * Finalizes the list.
	 * After calling this method, no more items may be added.
	 * At the same time, the list is ready for loading of resource data.
	 */
	public finalizeList() {
		this.isListFinalized = true;

		this.providers = this.providers.sort((a, b) => a.resourceProvider.sorting - b.resourceProvider.sorting);
	}

	private checkListOpen() {
		if (this.isListFinalized) {
			throw new Error('The list has already been locked.');
		}
	}

	private checkListClosed() {
		if (!this.isListFinalized) {
			throw new Error('The list has not been locked.');
		}
	}

	private isListFinalized = false;

	private providers: InjectableResourceProviderInfo[] = [];

	/**
	 * Indicates whether the list contains any providers that require asynchronous loading of data.
	 */
	public get containsAsyncProviders(): boolean {
		return this.providers.some(rpInfo => rpInfo.resourceProvider.requiresAsyncLoading && !rpInfo.resourceProvider.isLoaded);
	}

	/**
	 * Ensures all resource providers load their data.
	 *
	 * @param context An initialization context object used for loading the resources.
	 *   Alternatively, a factory function for such a context object that will only be
	 *   invoked if necessary.
	 *
	 * @returns A promise that is resolved when all resource data has been loaded.
	 *   If {@link containsAsyncProviders} returns `false`, this promise can be ignored.
	 *
	 * @throws The method is called before {@link finalizeList} has been invoked on the instance.
	 */
	public async prepareAll(context: IInitializationContext | (() => IInitializationContext)) {
		this.checkListClosed();

		// group all resource providers by sorting value
		const providerGroups: {
			[sorting: number]: InjectableResourceProviderInfo[]
		} = {};
		for (const rpInfo of this.providers) {
			if (!rpInfo.resourceProvider.isLoaded) {
				if (!Array.isArray(providerGroups[rpInfo.resourceProvider.sorting])) {
					providerGroups[rpInfo.resourceProvider.sorting] = [];
				}
				providerGroups[rpInfo.resourceProvider.sorting].push(rpInfo);
			}
		}

		// list distinct sorting values
		const sortedProviderGroupIds = Object.keys(providerGroups).map(gId => parseInt(gId)).sort((a, b) => a - b);

		const ctxInfo: {
			_context?: IInitializationContext,
			readonly context: IInitializationContext
		} = typeof context === 'function' ? {
			get context(): IInitializationContext {
				if (!this._context) {
					this._context = context();
				}
				return this._context;
			}
		} : {
			context: context
		};

		// treat each set of providers with the same sorting value separately
		for (const gId of sortedProviderGroupIds) {
			const providers = providerGroups[gId];

			// prepare synchronous providers
			const syncItems = providers.filter(rpInfo => !rpInfo.resourceProvider.requiresAsyncLoading);
			for (const rpInfo of syncItems) {
				rpInfo.resourceProvider.prepareValue(ctxInfo.context);
			}

			// prepare asynchronous providers
			const asyncItems = providers.filter(rpInfo => rpInfo.resourceProvider.requiresAsyncLoading);
			await (async function prepareItems() {
				switch (asyncItems.length) {
					case 0:
						break;
					case 1:
						await asyncItems[0].resourceProvider.prepareValue(ctxInfo.context);
						break;
					default:
						await Promise.all(asyncItems.map(rpInfo => rpInfo.resourceProvider.prepareValue(ctxInfo.context)));
						break;
				}
			})();
		}
	}

	/**
	 * Generates `StaticProvider` instances for Angular injection based on the thusly annotated
	 * entries in the list.
	 * This will include entries that have either been added along with an injection token, or
	 * entries that directly return `StaticProvider` instances.
	 *
	 * @returns All static providers.
	 *
	 * @throws The method is called before {@link finalizeList} has been invoked on the instance or
	 *   before all resource providers have finished loading their data.
	 */
	public getStaticProviders(): StaticProvider[] {
		this.checkListClosed();

		const result: StaticProvider[] = [];
		for (const rpInfo of this.providers) {
			if (rpInfo.staticProviderFunc) {
				result.push(rpInfo.staticProviderFunc());
			}
		}
		return result;
	}
}
