/*
 * Copyright(c) RIB Software GmbH
 */

import { Injector } from '@angular/core';
import {
	IInitializationContext,
	InitializationContext
} from '../../model/index';

/**
 * A lazy injection token can be used to reference a lazily injectable service
 * for injection.
 *
 * Specify the token in an {@link LazyInjectable} decorator to indicate a
 * service can be lazily injected using the token. Make sure to use
 * `module.submodule.` as a prefix in the token to lessen the chance of
 * collisions.
 *
 * Pass the token to the {@link PlatformLazyInjectorService} to retrieve the service
 * instance.
 *
 * @group Lazy Injection
 */
// T is evaluated by reflection/source generators.
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export class LazyInjectionToken<T> {

	/**
	 * Initializes a new instance.
	 * @param id The token ID. This must be unique in the application. Use
	 *   `<module>.<submodule>.` as a prefix to reduce the chance of
	 *   collisions.
	 */
	public constructor(public readonly id: string) {
	}
}

/**
 * Stores options for a lazy injectable service that can be passed to a
 * {@link LazyInjectable} decorator.
 *
 * @group Lazy Injection
 */
export interface ILazyInjectableDef<T> {

	/**
	 * The lazy injection token used to identify the lazy injectable service.
	 */
	readonly token: LazyInjectionToken<T>;

	/**
	 * Determines whether Angular's injection infrastructure must be used to
	 * instantiate the decorated service.
	 *
	 * If the decorated service is a regular TypeScript class, set this option
	 * to `false` (the default value) or do not list it at all. In that case,
	 * the lazy injector service will directly invoke the class constructor.
	 * Note that in this case, the service class must have either a parameterless
	 * constructor, or a constructor that accepts a single argument of type
	 * {@link Injector}. In the latter case, the lazily injected class may use
	 * the injector to manually retrieve more injectables from the Angular
	 * infrastructure.
	 *
	 * If the decorated service is an Angular injectable, set this option to
	 * `true`. In this case, the lazy injector service will retrieve the instance
	 * of the lazily injectable service using Angular's {@link Injector}, and
	 * the lazily injectable service may rely on the injection of additional
	 * Angular services (e.g. by using Angular's `inject()` method or by means
	 * of constructor injection).
	 */
	readonly useAngularInjection?: boolean;
}

/**
 * This decorator indicates that a class is a lazily injectable service.

 * @group Lazy Injection
 */
// info parameter is evaluated by reflection
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function LazyInjectable<T>(info: ILazyInjectableDef<T>) {
	// target parameter is required for decorator
	// eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function
	return function(target: unknown) {
	};
}

/**
 * Provides access to the context in which the instantiation of a
 * lazily injectable service happens.
 *
 * @group Lazy Injection
 */
export interface ILazyInjectionContext extends IInitializationContext {

	/**
	 * This field indicates whether the lazily injectable service should
	 * really be instantiated.
	 *
	 * Factory methods of lazily injectable services *must* check the value
	 * of this field immediately before attempting to instantiate the lazily
	 * injectable service and only proceed if the value is `true`. If it is
	 * `false`, another instance of the service has already been created in
	 * the meantime, and creating yet another one would violate the
	 * singleton restriction of the lazily injectable service.
	 */
	readonly doInstantiate: boolean;
}

class LazyInjectionContext extends InitializationContext implements ILazyInjectionContext {

	public constructor(injector: Injector) {
		super(injector);
	}

	public doInstantiate: boolean = true;
}

/**
 * An entry in the cache of instantiated lazy injectable objects.
 *
 * @group Lazy Injection
 */
export interface IInjectableCacheEntry {

	/**
	 * The reference to the instance, if the lazy injectable object has already been created.
	 */
	instance?: unknown;

	/**
	 * The reference to the promise, while the lazy injectable object is being created.
	 */
	instancePromise?: Promise<unknown>;
}

/**
 * Collects information about a lazily injectable service and helps to create
 * an instance of it.
 *
 * @group Lazy Injection
 */
export class LazyInjectableInfo {

	/**
	 * Creates a new instance of the class based on a particular target type.
	 * @param typeName The name of the lazily injectable service class type. This is
	 *   used to internally uniquely identify the service class.
	 * @param token The injection token to use during the injection.
	 * @param factoryFunc A factory function that can provide an instance of the
	 *   lazily injectable service class. It *must* take into account the value of the
	 *   {@link ILazyInjectionContext.doInstantiate} property of the context object
	 *   received as an argument.
	 */
	public static create<T>(
		typeName: string,
		token: LazyInjectionToken<T>,
		factoryFunc: (context: ILazyInjectionContext) => Promise<unknown>
	): LazyInjectableInfo {
		return new LazyInjectableInfo(typeName, token.id, factoryFunc);
	}

	private constructor(
		public readonly typeName: string,
		public readonly tokenName: string,
		private readonly factoryFunc: (context: ILazyInjectionContext) => Promise<unknown>
	) {
	}

	/**
	 * Provides the singleton instance of a lazily injectable service based on a
	 * lazy injection token.
	 * @param cache A cache object that holds references to lazily injectable service
	 *   singletons that are being created or that have already been created.
	 * @param injector An Angular injector object that may be used during the creation
	 *   of the lazily injectable service instance.
	 */
	public async getInstance<T>(cache: Record<string, IInjectableCacheEntry>, injector: Injector): Promise<T> {
		let cacheEntry = cache[this.typeName];
		if (!cacheEntry) {
			cacheEntry = {};
			cache[this.typeName] = cacheEntry;
		}

		if (!cacheEntry.instance) {
			// shared context instance
			const context = new LazyInjectionContext(injector);

			if (!cacheEntry.instancePromise) {
				cacheEntry.instancePromise = this.factoryFunc(context).then(inst => {
					cacheEntry.instancePromise = undefined;
					cacheEntry.instance = inst;
					// once the type has been instantiated once, we have our singleton instance
					// and no others need to be created
					context.doInstantiate = false;
				});
			}

			await cacheEntry.instancePromise;
		}
		return cacheEntry.instance as T;
	}
}