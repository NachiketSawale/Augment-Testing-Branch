/*
 * Copyright (c) RIB Software GmbH
 */

import { inject, Injectable, Injector } from '@angular/core';
import { IInjectableCacheEntry, LazyInjectableInfo, LazyInjectionToken } from '../model/lazy-injectable.model';
import { PlatformModuleManagerService } from '../../module-management/services/platform-module-manager.service';

/**
 * This service can instantiate lazy injectables from lazy-loaded modules.
 *
 * The lazy injector service serves to dynamically instantiate service classes
 * without having to respect the build order of modules. This way, service
 * references may even form cycles in the dependency graph.
 *
 * To enable this, one or more interfaces need to be supplied for each
 * service. Along with each service, provide a {@link LazyInjectionToken}.
 * Make sure to export the service, the interfaces, and the lazy injection
 * tokens on the public interface of the module.
 *
 * It is recommended to break down the publicly usable members of each
 * service into multiple independently injectable interfaces. Try to break
 * up the service by grouping members per assumed use case or subtopic. It
 * simplifies both mocking the injectable service for unit tests and
 * splitting up the service at a later time, should any of its subtopics
 * grow large enough to warrant a service of its own.
 *
 * @group Lazy Injection
 */
@Injectable({
  providedIn: 'root'
})
export class PlatformLazyInjectorService {

  private readonly injectables: Record<string, LazyInjectableInfo> = {};

  private readonly moduleMgrSvc = inject(PlatformModuleManagerService);

  private collectInjectables() {
    const lazyInjectables = this.moduleMgrSvc.getLazyInjectables();
    for (const li of lazyInjectables) {
      this.injectables[li.tokenName] = li;
    }

    this.initialized = true;
  }

  private initialized = false;

  private readonly injector = inject(Injector);

  private readonly cache: Record<string, IInjectableCacheEntry> = {};

  /**
   * Retrieves the singleton instance of a lazy injectable object.
   *
   * @typeParam T The type of the object to retrieve.
   *
   * @param token The injection token that identifies the injectable.
   * @returns The singleton instance.
   */
  public async inject<T>(token: LazyInjectionToken<T>): Promise<T> {
    if (!this.initialized) {
      this.collectInjectables();
    }

    const li = this.injectables[token.id];
    if (li) {
      return await li.getInstance<T>(this.cache, this.injector);
    }

    throw new Error(`No injectable with token name ${token.id} found.`);
  }

	/**
	 * Retrieves the singleton instances of up to ten lazy injectable objects.
	 * The instances are retrieved in parallel.
	 * The promise is resolved once all requested instances are ready.
	 *
	 * @param token1 The injection token for the first object.
	 * @param token2 The injection token for the second object.
	 * @param token3 The injection token for the third object.
	 * @param token4 The injection token for the fourth object.
	 * @param token5 The injection token for the fifth object.
	 * @param token6 The injection token for the sixth object.
	 * @param token7 The injection token for the seventh object.
	 * @param token8 The injection token for the eighth object.
	 * @param token9 The injection token for the ninth object.
	 * @param token10 The injection token for the tenth object.
	 *
	 * @returns A promise resolved to a tuple that contains the retrieved objects.
	 */
  public injectAll<T1, T2 = object, T3 = object, T4 = object, T5 = object, T6 = object, T7 = object, T8 = object, T9 = object, T10 = object>(
	  token1: LazyInjectionToken<T1>,
	  token2?: LazyInjectionToken<T2>,
	  token3?: LazyInjectionToken<T3>,
	  token4?: LazyInjectionToken<T4>,
	  token5?: LazyInjectionToken<T5>,
	  token6?: LazyInjectionToken<T6>,
	  token7?: LazyInjectionToken<T7>,
	  token8?: LazyInjectionToken<T8>,
	  token9?: LazyInjectionToken<T9>,
	  token10?: LazyInjectionToken<T10>): Promise<[T1, T2, T3, T4, T5, T6, T7, T8, T9, T10]> {

	  const funcs: [
		  Promise<T1>,
		  Promise<T2>,
		  Promise<T3>,
		  Promise<T4>,
		  Promise<T5>,
		  Promise<T6>,
		  Promise<T7>,
		  Promise<T8>,
		  Promise<T9>,
		  Promise<T10>
	  ] = [
		  this.inject(token1),
		  token2 ? this.inject(token2) : Promise.resolve(<T2>{}),
		  token3 ? this.inject(token3) : Promise.resolve(<T3>{}),
		  token4 ? this.inject(token4) : Promise.resolve(<T4>{}),
		  token5 ? this.inject(token5) : Promise.resolve(<T5>{}),
		  token6 ? this.inject(token6) : Promise.resolve(<T6>{}),
		  token7 ? this.inject(token7) : Promise.resolve(<T7>{}),
		  token8 ? this.inject(token8) : Promise.resolve(<T8>{}),
		  token9 ? this.inject(token9) : Promise.resolve(<T9>{}),
		  token10 ? this.inject(token10) : Promise.resolve(<T10>{})
	  ];

	  return Promise.all(funcs);
  }
}
