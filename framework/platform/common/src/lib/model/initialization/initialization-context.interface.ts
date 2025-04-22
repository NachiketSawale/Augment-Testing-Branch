/*
 * Copyright(c) RIB Software GmbH
 */

import { Injector } from '@angular/core';
import { PlatformLazyInjectorService } from '../../lazy-injection/services/platform-lazy-injector.service';
import { PlatformModuleManagerService } from '../../module-management/services/platform-module-manager.service';
import { PlatformTranslateService } from '../../services/platform-translate.service';
import { PlatformHttpService } from '../../services/platform-http.service';

/**
 * An interface that provides access to some objects commonly required
 * for initialization of components and objects.
 */
export interface IInitializationContext {

	/**
	 * An Angular injector.
	 */
	readonly injector: Injector;

	/**
	 * The lazy injection service.
	 */
	readonly lazyInjector: PlatformLazyInjectorService;

	/**
	 * The module manager service.
	 */
	readonly moduleManager: PlatformModuleManagerService;

	/**
	 * The translation service.
	 */
	readonly translateService: PlatformTranslateService;

	/**
	 * The HTTP service.
	 */
	readonly http: PlatformHttpService;
}
