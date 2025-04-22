/*
 * Copyright(c) RIB Software GmbH
 */

import {
	InjectionToken,
	StaticProvider
} from '@angular/core';
import {
	IInitializationContext,
	isAngularInjectionToken,
	isLazyResourceToken,
	isResourceFactory,
	OptionallyAsyncResource
} from '../../../index';

/**
 * Provides access to the non-generic members of a {@link IResourceProvider}.
 */
export interface IResourceProviderBase {

	/**
	 * Indicates whether the value has been loaded and is ready for use.
	 * If this property returns `false`, {@link prepareValue} must be invoked.
	 */
	readonly isLoaded: boolean;

	/**
	 * Indicates whether the value requires (or required) asynchronous loading.
	 * This value determines whether the promise returned by {@link prepareValue} is meaningful.
	 */
	readonly requiresAsyncLoading: boolean;

	/**
	 * Ensures loading of the value.
	 *
	 * @param context The context object to use.
	 *
	 * @returns A promise that indicates when the operation has concluded.
	 *   If {@link requiresAsyncLoading} returns `false`, you can safely ignore this promise.
	 */
	prepareValue(context: IInitializationContext): Promise<void>;

	/**
	 * A number that allows to order resource providers relative to one another.
	 * The smaller the number, the earlier the provider will be executed.
	 */
	readonly sorting: number;
}

/**
 * Manages a possibly lazily-loaded resource.
 */
export interface IResourceProvider<TValue> extends IResourceProviderBase {

	/**
	 * The value.
	 * It is only available once it has been loaded, otherwise accessing the property will trigger
	 * an exception.
	 *
	 * @throws If the member is accessed while {@link isLoaded} is `false`.
	 */
	readonly value: TValue;

	/**
	 * Creates a static provider for Angular injection with the current value.
	 *
	 * @param token The injection token to use.
	 *
	 * @throws If the method is called while {@link isLoaded} is `false`.
	 */
	createStaticProvider(token: InjectionToken<TValue>): StaticProvider;
}

abstract class TypedResourceBase<TValue> {

	public abstract get value(): TValue;

	public createStaticProvider(token: InjectionToken<TValue>): StaticProvider {
		return {
			provide: token,
			useValue: this.value
		};
	}
}

const RESOLVED_PROMISE = Promise.resolve();

/**
 * Represents a resource that is already in memory and thus immediately available.
 */
class AvailableResource<TValue> extends TypedResourceBase<TValue> implements IResourceProvider<TValue> {

	public constructor(
		public readonly value: TValue,
		public readonly sorting: number
	) {
		super();
	}

	public prepareValue(context: IInitializationContext): Promise<void> {
		return RESOLVED_PROMISE;
	}

	public readonly isLoaded = true;
	public readonly requiresAsyncLoading = false;
}

/**
 * Loads a resource lazily, but immediately.
 */
class LoadOnDemandResource<TValue> extends TypedResourceBase<TValue> implements IResourceProvider<TValue> {

	public constructor(
		private readonly provideValue: (context: IInitializationContext) => TValue,
		public readonly sorting: number
	) {
		super();
	}

	public prepareValue(context: IInitializationContext): Promise<void> {
		if (!this._isLoaded) {
			this._value = this.provideValue(context);
			this._isLoaded = true;
		}

		return RESOLVED_PROMISE;
	}

	public readonly requiresAsyncLoading = false;

	private _isLoaded = false;

	public get isLoaded(): boolean {
		return this._isLoaded;
	}

	private _value?: TValue;

	public get value(): TValue {
		if (!this._isLoaded) {
			throw new Error('The value has not yet been loaded.');
		}

		return this._value!;
	}
}

/**
 * Loads a resource lazily with a delay, and therefore asynchronously.
 */
class DelayedResource<TValue> extends TypedResourceBase<TValue> implements IResourceProvider<TValue> {

	public constructor(
		private readonly provideValue: (context: IInitializationContext) => Promise<TValue>,
		public readonly sorting: number
	) {
		super();
	}

	public prepareValue(context: IInitializationContext): Promise<void> {
		if (this._isLoaded) {
			return RESOLVED_PROMISE;
		}

		if (!this.valuePromise) {
			this.valuePromise = (async () => {
				try {
					this._value = await this.provideValue(context);
					this._isLoaded = true;
					this.valuePromise = undefined;
				} catch (error) {
					console.error('Asynchronous loading in resource provider failed.');
					console.error(error);
				}
			})();
		}

		return this.valuePromise;
	}

	private valuePromise?: Promise<void>;

	private _isLoaded = false;

	public get isLoaded(): boolean {
		return this._isLoaded;
	}

	private _value?: TValue;

	public get value(): TValue {
		if (!this._isLoaded) {
			throw new Error('The value has not yet been loaded.');
		}

		return this._value!;
	}

	public readonly requiresAsyncLoading = true;
}

/**
 * A concrete, untyped resource provider.
 */
export class ResourceProvider {

	/**
	 * Creates a provider for an optional resource.
	 * The method automatically determines the type of the resource source to create the
	 * appropriate kind of resource provider.
	 *
	 * @typeParam TValue The type of the resource.
	 *
	 * @param value The resource source, or `undefined` if the resource is not available.
	 * @param sorting An optional sorting priority.
	 *   The lower the number, the earlier the resource will be loaded.
	 *
	 * @returns A resource provider that wraps the specified source, or `undefined` if the
	 *   resource is not available.
	 */
	public static createOptional<TValue>(value?: OptionallyAsyncResource<TValue>, sorting: number = 0): IResourceProvider<TValue> | undefined {
		if (value === undefined) {
			return undefined;
		}

		return ResourceProvider.create(value);
	}

	/**
	 * Creates a provider for a mandatory resource.
	 * The method automatically determines the type of the resource source to create the
	 * appropriate kind of resource provider.
	 *
	 * @typeParam TValue The type of the resource.
	 *
	 * @param value The resource source.
	 * @param sorting An optional sorting priority.
	 *   The lower the number, the earlier the resource will be loaded.
	 *
	 * @returns A resource provider that wraps the specified source.
	 */
	public static create<TValue>(value: OptionallyAsyncResource<TValue>, sorting: number = 0): IResourceProvider<TValue> {
		if (isResourceFactory(value)) {
			return new DelayedResource<TValue>(async ctx => await Promise.resolve(value(ctx)), sorting);
		}

		if (isLazyResourceToken(value)) {
			return new DelayedResource(async ctx => await ctx.lazyInjector.inject(value), sorting);
		}

		if (isAngularInjectionToken(value)) {
			return new LoadOnDemandResource(ctx => ctx.injector.get(value), sorting);
		}

		return new AvailableResource(value, sorting);
	}
}
