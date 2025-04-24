import { Injectable } from '@angular/core';
import { AbstractSecurityStorage } from 'angular-auth-oidc-client';

/**
 * Custom implementation of AbstractSecurityStorage, handles the storage of authentication related data
 */
@Injectable({
	providedIn: 'root'
})
export class AuthStorageService implements AbstractSecurityStorage {

	protected readonly keyPrefix;

	private removeTrailingSlash(str: string) {
		if (!str) {
			return '';
		}
		return str.replace(/\/+$/, '');
	}

	private calculateKey = (key: string): string => `${this.keyPrefix}/${key}`;


	public constructor() {
		this.keyPrefix = this.removeTrailingSlash(window.location.pathname);
	}

	public read(key: string) {
		return localStorage.getItem(this.calculateKey(key));
	}

	public write(key: string, value: string): void {
		localStorage.setItem(this.calculateKey(key), value);
	}

	public remove(key: string): void {
		localStorage.removeItem(this.calculateKey(key));
	}

	public clear(): void {
		const keyCount = localStorage.length;
		for (let i = 0; i <= keyCount; i++) {
			const theKeyName = localStorage.key(i);
			if (theKeyName && theKeyName.startsWith(this.keyPrefix)) {
				localStorage.removeItem(theKeyName);
			}
		}
	}
}
