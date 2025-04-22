/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import { PlatformTranslateService } from '@libs/platform/common';

/**
 * Provides support for platform translation legacy service.
 */
@Injectable({
	providedIn: 'root'
})
export class PlatformTranslationLegacyService {
	private translationService = inject(PlatformTranslateService);

	/**
	 * Translates a key and returns the translated value.
	 * @param key translation key.
	 * @returns the translated value.
	 */
	public instant(key: string): string {
		return this.translationService.instant(key).text;
	}

	/**
	 * Loads the translation keys for the passed module
	 * @param internalModuleName internal module name of a given module
	 */
	public load(internalModuleName: string): Promise<boolean> {
		return this.translationService.load(internalModuleName);
	}
}