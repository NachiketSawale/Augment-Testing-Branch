/*
 * Copyright(c) RIB Software GmbH
 */

import { Injector } from '@angular/core';
import { IInitializationContext } from './initialization-context.interface';
import { PlatformLazyInjectorService } from '../../lazy-injection/services/platform-lazy-injector.service';
import { PlatformModuleManagerService } from '../../module-management/services/platform-module-manager.service';
import { PlatformTranslateService } from '../../services/platform-translate.service';
import { PlatformHttpService } from '../../services/platform-http.service';

/**
 * A standard implementation of the {@link IInitializationContext} interface.
 * It is based on an Angular injector passed into the constructor. Any other fields
 * are populated lazily when invoked.
 */
export class InitializationContext implements IInitializationContext {

	/**
	 * Initializes a new instance.
	 *
	 * @param injector The Angular injector to use.
	 */
	public constructor(public readonly injector: Injector) {
	}

	private _lazyInjector?: PlatformLazyInjectorService;

	/**
	 * The lazy injection service.
	 */
	public get lazyInjector(): PlatformLazyInjectorService {
		if (!this._lazyInjector) {
			this._lazyInjector = this.injector.get(PlatformLazyInjectorService);
		}

		return this._lazyInjector;
	}

	private _moduleManager?: PlatformModuleManagerService;

	/**
	 * The module manager service.
	 */
	public get moduleManager(): PlatformModuleManagerService {
		if (!this._moduleManager) {
			this._moduleManager = this.injector.get(PlatformModuleManagerService);
		}

		return this._moduleManager;
	}

	private _translateService?: PlatformTranslateService;

	/**
	 * The translation service.
	 */
	public get translateService(): PlatformTranslateService {
		if (!this._translateService) {
			this._translateService = this.injector.get(PlatformTranslateService);
		}

		return this._translateService;
	}

	private _http?: PlatformHttpService;

	/**
	 * The HTTP service.
	 */
	public get http(): PlatformHttpService {
		if (!this._http) {
			this._http = this.injector.get(PlatformHttpService);
		}

		return this._http;
	}
}
