/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable, Injector, ProviderToken, inject } from '@angular/core';

/**
 * A service to help resolve angular provider instance.
 */
@Injectable({
	providedIn: 'root',
})
export class BasicsSharedProviderResolverService {
	/**
	 * The Angular injector instance.
	 * @private
	 */
	private readonly injector = inject(Injector);

	/**
	 * Resolves the given provider to an instance.
	 * @template T - The type of the provider.
	 * @param provider - The provider instance or token.
	 * @returns The resolved provider instance.
	 */
	public getProvider<T>(provider: T | ProviderToken<T>): T {
		if (this.isProviderToken(provider)) {
			return this.injector.get(provider);
		}

		return provider;
	}

	/**
	 * Checks if the given token is a provider token.
	 * @template T - The type of the token.
	 * @param token - The token to check.
	 * @returns True if the token is a provider token, false otherwise.
	 */
	public isProviderToken<T>(token: T | ProviderToken<T>): token is ProviderToken<T> {
		if (!token) {
			return false;
		}

		return typeof token === 'function' || (typeof token === 'object' && 'ngInjectableDef' in token);
	}
}
