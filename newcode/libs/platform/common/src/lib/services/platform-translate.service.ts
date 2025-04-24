/*
 * Copyright(c) RIB Software GmbH
 */

import { EventEmitter, inject, Injectable, Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PlatformConfigurationService } from './platform-configuration.service';
import { get } from 'lodash';
import { catchError, forkJoin, Observable, of } from 'rxjs';
import {
	ITranslatable,
	ITranslated,
	Translatable
} from '../model/translation/translatable.interface';
import {
	TranslationParamsSource
} from '../model/translation/translation-params-source.type';
import {
	ITranslator
} from '../model/translation/translator.interface';
import { IDescriptionInfo } from '../model/interfaces/description-info.interface';

/**
 * PlatformTranslateService
 * This service is useful for language translation.
 *
 * @group Translation
 */
@Injectable({
	providedIn: 'root',
})
export class PlatformTranslateService implements ITranslator {
	/**
	 * List of modules that are already registered and loaded
	 * @private
	 */
	private modules: Record<string, boolean> = {};

	/**
	 * Fallback languages (e.g. ['en', 'de', 'de-ch'], ['en', 'en-us'])
	 * Must be setup at application startup
	 * @private
	 */
	private languages: string[] = ['en']; //, 'de', 'de-ch'];

	private translations: Record<string, string> = {};
	private http = inject(HttpClient);
	private configurationService = inject(PlatformConfigurationService);
	private templateMatcher: RegExp = /{{\s?([^{}\s]*)\s?}}/g;

	/**
	 * Emits true, when translation memory has been changed.
	 */
	public translationChanged = new EventEmitter();

	public constructor() {
		this.configurationService.contextChangeEmitter.subscribe(() => {
			this.initializeTranslation();
		});
	}

	private initializeTranslation() {
		const uiLanguage = this.configurationService.savedOrDefaultUiLanguage;
		const parts = uiLanguage.split('-');
		this.languages = ['en'];
		if (parts.length === 2 && parts[0] !== 'en') {
			this.languages.push(parts[0]);
		}
		this.languages.push(uiLanguage);
	}

	/**
	 * Loads one or more modules into translation tables
	 *
	 * @param modules module(s) which translations should be loaded
	 * @returns {promise} true when translation table will be updated
	 */
	public load(modules: string | Array<string>): Promise<boolean> {
		const load: string[] = [];

		if (typeof modules == 'string') {
			modules = [modules];
		}

		modules.forEach((module) => {
			if (!this.modules[module]) {
				load.push(module);
			}
		});

		return this.updateTranslations(load);
	}

	/**
	 * Loads or updates given modules
	 * @param modules module / keys to be loaded or updated
	 * @returns promise which will be resolved after translation cache has been updated
	 * @private
	 */
	private updateTranslations(modules: string[]): Promise<boolean> {
		return new Promise<boolean>((resolve) => {
			if (!modules.length) {
				resolve(true);
			} else {
				const moduleOps: Observable<object>[] = [];

				modules.forEach(module => {
					const languageOps: Observable<object>[] = [];

					this.languages.forEach(language => {
						languageOps.push(this.http.get<object>(this.getServiceEndpoint(module, language)).pipe(catchError(() => of({}))));
					});

					moduleOps.push(forkJoin<object[]>(languageOps));
				});

				// next subscribe will trigger all http requests to be executed
				const subscription = forkJoin<object[]>(moduleOps)
					.subscribe((results: object[]) => {
						subscription.unsubscribe();

						// mark all modules as loaded
						modules.forEach(module => {
							this.modules[module] = true;
						});

						// merge all results into translation cache
						results.forEach((results: object) => {
							const _results = results as object[];

							this.languages.forEach((language, index) => {
								if (_results[index]) {
									Object.assign(this.translations, this.flattenObject(_results[index] as Record<string, unknown>));
								}
							});
						});

						resolve(true);
						this.translationChanged.next(true);
					});
			}
		});
	}

	/**
	 * Converts object-structure to flat dot notation
	 * @param obj
	 * @param parentKey
	 * @private
	 */
	private flattenObject(obj: Record<string, unknown>, parentKey?: string): Record<string, string> {
		let result: Record<string, string> = {};

		Object.keys(obj).forEach((key) => {
			const value = obj[key];

			key = parentKey ? parentKey + '.' + key : key;

			if (typeof value === 'object') {
				result = {...result, ...this.flattenObject(value as Record<string, unknown>, key)};
			} else if (typeof value === 'string') {
				result[key] = value;
			}
		});

		return result;
	}

	/**
	 * Builds service endpoint url for given key (module or custom keys)
	 * @param key id of module or custom id
	 * @param language language (iso code)
	 * @private
	 */
	private getServiceEndpoint(key: string, language: string): string {
		const splitPart = key.split('.', 2);

		if (splitPart[0] === '$custom') {
			return `${this.configurationService.baseUrl}cdn/custom/i18n/${splitPart[1]}/${language}.json`;
		} else if (key.startsWith('$cust')) {
			return `${this.configurationService.webApiBaseUrl}cloud/translation/custom/loadsection?section=${key}&culture={lang}`;
		} else if (splitPart[0] === '$userLabel') {
			return `${this.configurationService.webApiBaseUrl}basics/customize/userlabel/load?language=${language}`;
		}

		let baseUrl = this.configurationService.appBaseUrl;
		const module = splitPart[0];
		const submodule = splitPart[1];

		if(baseUrl==='//'){
			baseUrl='/';
		}

		return `${baseUrl}assets/${module}/${submodule}/i18n/${language}.json`;
	}

	/**
	 * Loads custom translation
	 * @param keys custom translation(s) to be loaded
	 * @returns {promise} promise
	 */
	public loadCustom(keys: string | Array<string>): Promise<boolean> {
		return this.load(this.updateCustomTranslationKey(keys));
	}

	/**
	 * Reloads custom translation
	 * @param keys custom translation(s) to be reloaded
	 * @returns {promise} promise
	 */
	public reloadCustom(keys: string | Array<string>): Promise<boolean> {
		return this.updateTranslations(this.updateCustomTranslationKey(keys));
	}

	/**
	 * helper to ensure custom keys are using $cust.key notation
	 * @param keys keys to be checked and changed
	 * @private
	 */
	private updateCustomTranslationKey(keys: string | Array<string>): Array<string> {
		if (typeof keys === 'string') {
			return this.updateCustomTranslationKey([keys]);
		} else {
			for (let i = 0; i < keys.length; ++i) {
				if (!keys[i].startsWith('$cust.')) {
					keys[i] = `$cust.${keys[i]}`;
				}
			}

			return keys;
		}
	}

	private readonly injector = inject(Injector);

	private resolveTranslationParams(params?: TranslationParamsSource): object | undefined {
		if (params) {
			if (typeof params === 'function') {
				return params({
					injector: this.injector,
					translator: this
				});
			} else {
				return params;
			}
		}

		return undefined;
	}

	/**
	 * Returns a translation instantly from the internal state of loaded translation.
	 * @param item Translatable token.
	 * @param interpolateParams An object hash for placeholder values
	 *
	 * @returns A {@link ITranslated} object with the translated text in its {@link ITranslated.text} field.
	 */
	public instant(item: Translatable, interpolateParams?: TranslationParamsSource): ITranslated;

	/**
	 * Returns an array of translations instantly from the internal state of loaded translation.
	 * @param items Translatable token(s).
	 * @param interpolateParams An object hash for placeholder values
	 *
	 * @returns An array of {@link ITranslated} objects with the translated text in their {@link ITranslated.text} fields.
	 */
	public instant(items: Array<Translatable>, interpolateParams?: TranslationParamsSource): Array<ITranslated>;

	/**
	 * Returns a translation instantly from the internal state of loaded translation.
	 * @param item Translatable token(s)
	 * @param interpolateParams An object hash for placeholder values
	 *
	 * @returns {@link ITranslated} objects with the translated text in their {@link ITranslated.text} fields.
	 */
	public instant(item: Translatable | Array<Translatable>, interpolateParams?: TranslationParamsSource): ITranslated | Array<ITranslated> {
		if (item instanceof Array) {
			return item.reduce((result: Array<ITranslated>, key) => {
				result.push(this.instant(key, this.resolveTranslationParams(interpolateParams)));

				return result;
			}, []);
		} else {
			if (typeof item === 'string') {
				return { key: item, text: this.lookupTranslation(item, this.resolveTranslationParams(interpolateParams)) };
			} else {
				if (item.key) {
					item.text = this.lookupTranslation(item.key, this.resolveTranslationParams(item.params ?? interpolateParams));
				} else if (item.text) {
					item.key = item.text;
					item.text = this.lookupTranslation(item.text, this.resolveTranslationParams(item.params ?? interpolateParams));
				} else {
					throw new Error('translate-service | instant: key or text of ITranslatable must be provided');
				}

				return item as ITranslated;
			}
		}
	}

	/**
	 * Returns a description info instantly from the internal state of loaded translation.
	 * @param item Translatable token.
	 * @param interpolateParams An object hash for placeholder values
	 *
	 * @returns An {@link IDescriptionInfo} object that contains the translated text.
	 */
	public instantDesc(item: Translatable, interpolateParams?: TranslationParamsSource): IDescriptionInfo;

	/**
	 * Returns an array of description infos instantly from the internal state of loaded translation.
	 * @param items Translatable token(s).
	 * @param interpolateParams An object hash for placeholder values
	 *
	 * @returns {@link IDescriptionInfo} objects that contain the translated text.
	 */
	public instantDesc(items: Array<Translatable>, interpolateParams?: TranslationParamsSource): Array<IDescriptionInfo>;

	/**
	 * Returns a translated description info instantly from the internal state of loaded translation.
	 * @param item Translatable token.
	 * @param interpolateParams An object hash for placeholder values
	 *
	 * @returns {@link IDescriptionInfo} objects that contain the translated text.
	 */
	public instantDesc(item: Translatable | Array<Translatable>, interpolateParams?: TranslationParamsSource): IDescriptionInfo | Array<IDescriptionInfo> {
		if (Array.isArray(item)) {
			return item.map(str => this.instantDesc(str, interpolateParams));
		}

		const translated = this.instant(item, interpolateParams);

		return {
			Description: translated.text,
			DescriptionTr: 0,
			DescriptionModified: false,
			Modified: false,
			OtherLanguages: null,
			VersionTr: 0,
			Translated: translated.text
		};
	}

	/**
	 * Lookups translation key and applies interpolation parameters
	 * @param key key to be processed
	 * @param params interpolation parameter
	 * @private
	 */
	private lookupTranslation(key: string, params?: object): string {
		const text = this.translations[key] ?? key;

		if (!params) {
			return text;
		}

		return text.replace(this.templateMatcher, (match: string, token: string) => get(params, token, match));
	}

	/**
	 * Instantly translates given properties of an object.
	 *
	 * @typeParam T The object type.
	 *
	 * @param obj object-tree
	 * @param properties name of properties to be translated
	 * @param recursive if true, translate given properties in sub-objects
	 * @returns translated object
	 */
	public translateObject<T extends object>(obj: T, properties: string[], recursive?: boolean): T;

	/**
	 * Instantly translates given properties of an array of objects.
	 *
	 * @typeParam T The object type.
	 *
	 * @param obj object array
	 * @param properties name of properties to be translated
	 * @param recursive if true, translate given properties in sub-objects
	 * @returns translated objects
	 */
	public translateObject<T extends object>(obj: T[], properties: string[], recursive?: boolean): T[];

	public translateObject<T extends object>(obj: T[] | T, properties: string[], recursive = false): T[] | T {
		if (obj instanceof Array) {
			obj.forEach(item => this.translateObject(item, properties));
		} else if (typeof obj === 'object') {
			const _obj: Record<string, unknown> = obj as Record<string, unknown>;

			Object.keys(obj).forEach((property: string) => {
				if (properties.find(item => item === property)) {
					const t = _obj[property] as ITranslatable;

					if (t) {
						_obj[property] = this.instant(t) as never;
					}
				}

				if (recursive && (_obj[property] instanceof Array || typeof _obj[property] === 'object')) {
					this.translateObject(_obj[property] as Record<string, unknown>, properties, true);
				}
			});
		}

		return obj;
	}
}
