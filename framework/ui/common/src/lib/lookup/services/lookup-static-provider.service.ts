/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable, Injector, StaticProvider, inject } from '@angular/core';
import { LOOKUP_STORAGE_TOKEN } from '../model/interfaces/lookup-storage.interface';
import { LookupLocalStorageService } from './lookup-local-storage.service';

/**
 * Lookup static provider service
 * Could be used to configure static lookup service in the host application according to different behavior
 */
@Injectable({
	providedIn: 'root',
})
export class LookupStaticProviderService {
	private staticProviders: StaticProvider[] = [];
	private defaultStaticProviders: StaticProvider[] = [
		{
			provide: LOOKUP_STORAGE_TOKEN,
			useValue: inject(LookupLocalStorageService),
		},
	];
	private readonly injector = inject(Injector);

	/**
	 * Configure custom provider for lookup behavior by which we can override some behavior of lookup
	 * @param providers
	 */
	public configure(providers: StaticProvider[]) {
		this.staticProviders = providers;
	}

	/**
	 * Get lookup storage service
	 */
	public getStorageService() {
		const injector = Injector.create({
			providers: [...this.defaultStaticProviders, ...this.staticProviders],
			parent: this.injector,
		});
		return injector.get(LOOKUP_STORAGE_TOKEN);
	}
}
