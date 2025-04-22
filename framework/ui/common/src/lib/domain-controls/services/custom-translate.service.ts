/*
 * Copyright(c) RIB Software GmbH
 */
import { Injectable, inject } from '@angular/core';
import { Observable, Subject, map, of, switchMap } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';

import { PlatformConfigurationService } from '@libs/platform/common';

import { ICustomTranslateControlData } from '../model/custom-translate/custom-translate-control-data.interface';
import { ICustomTranslateControlInfo } from '../model/custom-translate/custom-translate-control-info.interface';
import { ICustomTranslateControlKeyParts } from '../model/custom-translate/custom-translate-control-key-parts.interface';
import { ICustomTranslateControlTranslationData } from '../model/custom-translate/custom-translate-control-translation-data.interface';
import { ICustomTranslateOptions } from '../../model/fields/additional/additional-custom-translate-options.interface';

@Injectable({
	providedIn: 'root',
})
export class CustomTranslateService {
	/**
	 * Service performing http requests.
	 */
	private readonly http = inject(HttpClient);

	/**
	 * Configuration service holding Api start point.
	 */
	private readonly configurationService = inject(PlatformConfigurationService);

	/**
	 * Prefix for the translation key.
	 */
	private readonly translationPrefix = '$cust';

	/**
	 * Event emitter for structure value change.
	 */
	public readonly structureChange$ = new Subject<string>();

	/**
	 * Event emitter for id value change.
	 */
	public readonly idChange$ = new Subject<string>();

	/**
	 * Registered controls.
	 */
	private registeredControls: ICustomTranslateControlData[] = [];

	/**
	 * Creates a translate key with the information of the control options object.
	 *
	 * @param {ICustomTranslateOptions} options The options of the custom translation control.
	 * @returns {string} The translation key.
	 */
	public createTranslationKey(options: ICustomTranslateOptions): string {
		return this.translationPrefix + '.' + options.section + '.' + options.id + (options.structure ? '.' + options.structure : '') + '.' + options.name;
	}

	/**
	 * Gets the translation string of the defined culture from server.
	 *
	 * @param {string} translationKey The translation key, e.g. '$cust.searchForms.134.987.title'.
	 * @param {string} culture The culture, e.g. "de". If undefined the current ui language will be used.
	 * @returns {Observable<string>} The translation string.
	 */
	private loadTranslationFromServer$(translationKey: string, culture: string): Observable<string> {
		const params = new HttpParams().set('translationKey', translationKey).set('culture', culture);
		return this.http.get(this.configurationService.webApiBaseUrl + 'cloud/translation/custom/load', { responseType: 'text', params: params });
	}

	/**
	 * Gets the translation string of the defined culture.
	 *
	 * @param {string} translationKey The translation key, e.g. '$cust.searchForms.134.987.title'.
	 * @param {string} culture The culture, e.g. "de". If undefined the current ui language will be used.
	 * @param {boolean} refreshCache If true, then the cache is ignored and the data is reloaded.
	 * @returns {Observable<{ data: string | null }>} The translation string.
	 */
	public loadTranslation$(translationKey: string, culture?: string, refreshCache?: boolean): Observable<{ data: string | null }> {
		const usedCulture = culture ? culture : this.configurationService.savedOrDefaultUiCulture;
		const control = this.getControlByKey(translationKey);

		if (control.info && control.info.cacheEnabled) {
			if (control.data && !refreshCache) {
				return of({ data: control.data[usedCulture] });
			} else {
				return this.loadTranslationsFromServer$(translationKey).pipe(
					map((response) => {
						control.data = response;
						return { data: control.data[usedCulture] };
					}),
				);
			}
		} else {
			return this.loadTranslationFromServer$(translationKey, usedCulture).pipe(
				map((response) => {
					return { data: response };
				}),
			);
		}
	}

	/**
	 * Gets the translation string of all cultures available from server.
	 *
	 * @param {string} translationKey The translation key, e.g. '$cust.searchForms.134.987.title'.
	 * @returns {Observable<ICustomTranslateControlTranslationData>} Translation string of all cultures available.
	 */
	private loadTranslationsFromServer$(translationKey: string): Observable<ICustomTranslateControlTranslationData> {
		const params = new HttpParams().set('translationKey', translationKey);
		return this.http.get<ICustomTranslateControlTranslationData>(this.configurationService.webApiBaseUrl + 'cloud/translation/custom/loadlist', { params: params });
	}

	/**
	 * Gets the translation data for all the cultures.
	 *
	 * @param {string} translationKey The translation key, e.g. '$cust.searchForms.134.987.title'.
	 * @param {boolean} refreshCache If true, then the cache is ignored and the data is reloaded.
	 * @returns {Observable<{data : ICustomTranslateControlTranslationData}>}
	 */
	public loadTranslations$(translationKey: string, refreshCache?: boolean): Observable<{ data: ICustomTranslateControlTranslationData }> {
		const control = this.getControlByKey(translationKey);

		if (control.info && control.info.cacheEnabled) {
			if (control.data && !refreshCache) {
				return of({ data: control.data });
			} else {
				return this.loadTranslationsFromServer$(translationKey).pipe(
					map((result) => {
						control.data = result;
						return { data: control.data };
					}),
				);
			}
		} else {
			// Data shouldn't be cached -> simply load the data
			return this.loadTranslationsFromServer$(translationKey).pipe(
				map((result) => {
					control.data = result;
					return { data: control.data };
				}),
			);
		}
	}

	/**
	 * Saves the translation of the respective key to the server in the culture provided.
	 *
	 * @param {string} translationKey The translation key, e.g. '$cust.searchForms.134.987.title'.
	 * @param {string|null} translation Translation for the key.
	 * @param {string} culture The culture, e.g. "de". If undefined the current ui language will be used.
	 * @returns {Observable<unknown>}
	 */
	private saveTranslationToServer$(translationKey: string, translation: string | null, culture: string): Observable<unknown> {
		const params = new HttpParams()
			.set('translationKey', translationKey)
			.set('translation', <string>translation)
			.set('culture', culture);
		return this.http.post(this.configurationService.webApiBaseUrl + 'cloud/translation/custom/save', '', { params: params });
	}

	/**
	 * Saves the translation of the respective key either in cache or to the server in the culture provided.
	 *
	 * @param {string} translationKey The translation key, e.g. '$cust.searchForms.134.987.title'.
	 * @param {string|null} translation Translation for the key.
	 * @param {string} culture The culture, e.g. "de". If undefined the current ui language will be used.
	 * @returns {Observable<unknown>}
	 */
	public saveTranslation$(translationKey: string, translation: string | null, culture?: string): Observable<unknown> {
		const usedCulture = culture ? culture : this.configurationService.savedOrDefaultUiCulture;
		const control = this.getControlByKey(translationKey);

		if (control.info && control.info.cacheEnabled) {
			if (!control.data) {
				control.data = {};
			}

			control.data[usedCulture] = translation;
			control.isDirty = true;

			return of();
		}

		return this.saveTranslationToServer$(translationKey, translation, usedCulture);
	}

	/**
	 * Saves the translations for the cultures availables to the server.
	 *
	 * @param {string} translationKey The translation key, e.g. '$cust.searchForms.134.987.title'.
	 * @param {ICustomTranslateControlTranslationData} translations Translations for the key.
	 * @returns {Observable<unknown>}
	 */
	private saveTranslationsToServer$(translationKey: string, translations: ICustomTranslateControlTranslationData): Observable<unknown> {
		return this.http.post(this.configurationService.webApiBaseUrl + 'cloud/translation/custom/savelist', { translationKey: translationKey, translations: translations });
	}

	/**
	 * Saves the translations either in cache or to the server for the cultures available.
	 *
	 * @param {string} translationKey The translation key, e.g. '$cust.searchForms.134.987.title'.
	 * @param {ICustomTranslateControlTranslationData} translations Translations for the key.
	 * @returns {Observable<unknown>}
	 */
	public saveTranslations$(translationKey: string, translations: ICustomTranslateControlTranslationData): Observable<unknown> {
		const control = this.getControlByKey(translationKey);

		if (control.info && control.info.cacheEnabled) {
			control.data = translations;
			control.isDirty = true;

			return of();
		}

		return this.saveTranslationsToServer$(translationKey, translations);
	}

	/**
	 * Writes the cached data to disc.
	 *
	 * @param {string|string[]} translationKey  TranslationKey(s) to be persisted.
	 * @returns {Observable<unknown>}
	 */
	public writeCachedData$(translationKey: string | string[]): Observable<unknown> {
		let keys: string[] = [];
		let changedControls: ICustomTranslateControlData[] = [];

		if (!translationKey) {
			changedControls = this.registeredControls.filter((control) => {
				return control.isDirty;
			});
		} else {
			keys = Array.isArray(translationKey) ? translationKey : [translationKey];
			changedControls = this.registeredControls.filter((control) => {
				return control.isDirty && keys.includes(control.translationKey);
			});
		}

		const lists = changedControls.map((control) => {
			return { translationKey: control.translationKey, translations: control.data };
		});

		if (lists && lists.length > 0) {
			return this.http.post(this.configurationService.webApiBaseUrl + 'cloud/translation/custom/savelists', lists).pipe(
				map(() => {
					changedControls.forEach((control) => {
						control.isDirty = false;
					});
				}),
			);
		}

		return of();
	}

	/**
	 * Deletes only the single translation that is defined by the translation key from the server.
	 *
	 * @param {string} translationKey The translation key, e.g. '$cust.searchForms.134.987.title'.
	 * @returns {Observable<unknown>}
	 */
	private deleteTranslationByKeyToServer$(translationKey: string): Observable<unknown> {
		const params = new HttpParams().set('translationKey', translationKey);
		return this.http.post(this.configurationService.webApiBaseUrl + 'cloud/translation/custom/deletetranslationbykey', '', { params: params });
	}

	/**
	 * Deletes only the single translation that is defined by the translation key.
	 *
	 * @param {string} translationKey The translation key, e.g. '$cust.searchForms.134.987.title'.
	 * @returns {Observable<unknown>}
	 */
	public deleteTranslationByKey$(translationKey: string): Observable<unknown> {
		const control = this.getControlByKey(translationKey);
		if (control.info && control.info.cacheEnabled) {
			if (control.data) {
				for (const culture in control.data) {
					if (control.data[culture] !== undefined) {
						control.data[culture] = null;
					}
				}

				control.isDirty = true;
			}

			return of();
		}

		return this.deleteTranslationByKeyToServer$(translationKey);
	}

	/**
	 * Deletes every translation from the defined ID
	 *
	 * @param {string} translationKey The translation key, e.g. '$cust.searchForms.134.987.title'.
	 * @returns {Observable<boolean>} Is deleted.
	 */
	public deleteTranslationFilesByKey$(translationKey: string): Observable<boolean> {
		return this.getTranslationKeyParts$(translationKey).pipe(
			switchMap((response) => {
				return this.deleteTranslationFilesById$(response.section, response.id);
			}),
		);
	}

	/**
	 * Deletes translation files by id from the server.
	 *
	 * @param {string} section The name of the section, e.g. "searchForms".
	 * @param {string} id Translation ID.
	 * @returns {Observable<boolean>} Is translation file deleted.
	 */
	private deleteTranslationFilesByIdToServer$(section: string, id: string): Observable<boolean> {
		const params = new HttpParams().set('section', section).set('id', id);
		return this.http.post<boolean>(this.configurationService.webApiBaseUrl + 'cloud/translation/custom/deletetranslationsbyid', '', { params: params });
	}

	/**
	 * Deletes translation files by id.
	 *
	 * @param {string} section The name of the section, e.g. "searchForms".
	 * @param {string} id Translation ID.
	 * @returns {Observable<boolean>} Is translation file deleted.
	 */
	public deleteTranslationFilesById$(section: string, id: string): Observable<boolean> {
		return this.deleteTranslationFilesByIdToServer$(section, id).pipe(
			map((result) => {
				if (result) {
					const controls = this.getControlsById(section, id);

					if (controls && controls.length > 0) {
						controls.forEach((control) => {
							control.data = undefined as unknown as ICustomTranslateControlTranslationData;
							control.info.changeValue.updateValue();
						});

						return true;
					}

					return false;
				}

				return false;
			}),
		);
	}

	/**
	 * Renames the translation id to the server.
	 *
	 * @param {string} section The name of the section, e.g. "searchForms".
	 * @param {string} oldId Old translation ID
	 * @param {string} newId New translation ID
	 * @returns {Observable<boolean>} Is translate Id changed.
	 */
	private changeTranslationIdToServer$(section: string, oldId: string, newId: string): Observable<boolean> {
		const params = new HttpParams().set('section', section).set('oldId', oldId).set('newId', newId);
		return this.http.post<boolean>(this.configurationService.webApiBaseUrl + 'cloud/translation/custom/renametranslationid', '', { params: params });
	}

	/**
	 * Renames the translation id.
	 *
	 * @param {string} section The name of the section, e.g. "searchForms".
	 * @param {string} oldId Old translation ID
	 * @param {string} newId New translation ID
	 * @returns {Observable<boolean>} Is translate Id changed.
	 */
	public changeTranslationId$(section: string, oldId: string, newId: string): Observable<boolean> {
		return this.changeTranslationIdToServer$(section, oldId, newId).pipe(
			map((response) => {
				if (response) {
					const controls = this.getControlsById(section, oldId);

					if (controls && controls.length > 0) {
						controls.forEach((control) => {
							control.translationKey = control.translationKey.replace(oldId, newId);
						});

						return true;
					}

					return false;
				}

				return false;
			}),
		);
	}

	/**
	 * Duplicates the translation id to the server.
	 *
	 * @param {string} section The name of the section, e.g. "searchForms".
	 * @param {string} oldId Old translation ID
	 * @param {string} newId New translation ID
	 * @returns {Observable<boolean>} Is duplicate translate Id created.
	 */
	private duplicateTranslationIdToServer$(section: string, oldId: string, newId: string): Observable<boolean> {
		const params = new HttpParams().set('section', section).set('oldId', oldId).set('newId', newId);
		return this.http.post<boolean>(this.configurationService.webApiBaseUrl + 'cloud/translation/custom/duplicatetranslationid', '', { params: params });
	}

	/**
	 * Duplicates the translation id.
	 *
	 * @param {string} section The name of the section, e.g. "searchForms".
	 * @param {string} sourceId Old translation ID.
	 * @param {string} targetId New translation ID.
	 * @returns {Observable<boolean>} Is duplicate translate Id created.
	 */
	public duplicateTranslationId$(section: string, sourceId: string, targetId: string): Observable<boolean> {
		return this.duplicateTranslationIdToServer$(section, sourceId, targetId).pipe(
			map((result) => {
				if (result) {
					const controls = this.getControlsById(section, sourceId);

					if (controls && controls.length > 0) {
						controls.forEach((control) => {
							const newControl = { ...control };
							newControl.translationKey = newControl.translationKey.replace(sourceId, targetId);
							this.registerControlObject(newControl);
						});

						return true;
					}

					return false;
				}

				return false;
			}),
		);
	}

	/**
	 * Gets all translations of a specified section.
	 *
	 * @param {string} section The name of the section, e.g. "searchForms".
	 * @returns {Observable<object>} An object with the translations.
	 */
	public loadSection$(section: string): Observable<object> {
		return this.http.get(this.configurationService.webApiBaseUrl + 'cloud/translation/custom/loadsection', { params: { section: section } });
	}

	/**
	 * Registers a control on the Custom Translate Service so that certain functions that affect the control can be called via the service.
	 *
	 * @param {string} translationKey The translation key, e.g. '$cust.searchForms.134.987.title'.
	 * @param {ICustomTranslateControlInfo} info An easy to extend object with values and functions.
	 * @param {ICustomTranslateControlTranslationData} data The translations of the control.
	 * @param {boolean} isDirty Is control changed.
	 */
	public registerControl(translationKey: string, info: ICustomTranslateControlInfo, data?: ICustomTranslateControlTranslationData, isDirty?: boolean): void {
		const controlObject = {
			translationKey: translationKey,
			info: info,
			data: data,
			isDirty: isDirty || false,
		};
		this.registerControlObject(controlObject as ICustomTranslateControlData);
	}

	/**
	 * Registers a control.
	 *
	 * @param {ICustomTranslateControlData} controlObject Control data.
	 */
	private registerControlObject(controlObject: ICustomTranslateControlData): void {
		if (controlObject && controlObject.translationKey) {
			const existingControl = this.registeredControls.find((control) => {
				return control.translationKey === controlObject.translationKey;
			});

			if (!existingControl) {
				this.registeredControls.push(controlObject as ICustomTranslateControlData);
			}
		}
	}

	/**
	 * Unregisters a control that was previously registered.
	 *
	 * @param {string} translationKey The translation key, e.g. '$cust.searchForms.134.987.title'.
	 */
	public unregisterControl(translationKey: string): void {
		if (translationKey) {
			this.registeredControls = this.registeredControls.filter((control) => {
				return control.translationKey !== translationKey;
			});
		}
	}

	/**
	 * Triggers a reload of the control's data.
	 *
	 * @param {string} translationKey The translation key of the control.
	 * @param {ICustomTranslateControlInfo} info
	 */
	public updateControl(translationKey: string, info?: ICustomTranslateControlInfo): void {
		const control = this.getControlByKey(translationKey);

		if (control && control.info && control.info.changeValue) {
			if (typeof control.info.changeValue.updateValue === 'function') {
				control.info.changeValue.updateValue(info);
			}
		}
	}

	/**
	 * Changes the current value of the control.
	 *
	 * @param {string} translationKey The translation key of the control.
	 * @param {string} value The new value of the control.
	 * @param {ICustomTranslateControlInfo} info
	 */
	public setControlValue(translationKey: string, value: string, info?: ICustomTranslateControlInfo): void {
		const control = this.getControlByKey(translationKey);

		if (control && control.info && control.info.changeValue) {
			if (typeof control.info.changeValue.updateValue === 'function') {
				control.info.changeValue.setValue(value, info);
			}
		}
	}

	/**
	 * Gets Control for the key provided.
	 *
	 * @param {string} translationKey The translation key, e.g. '$cust.searchForms.134.987.title'.
	 * @returns {ICustomTranslateControlData} Registered control data.
	 */
	private getControlByKey(translationKey: string): ICustomTranslateControlData {
		const control = this.registeredControls.find((control) => {
			return control.translationKey === translationKey;
		});

		if (!control) {
			throw new Error('The custom translation control is not registered.');
		}

		return control;
	}

	/**
	 * Return controls by using Id.
	 *
	 * @param {string} section The translation section.
	 * @param {string} id The translation ID.
	 * @returns {ICustomTranslateControlData[]} Registered controls data
	 */
	private getControlsById(section: string, id: string): ICustomTranslateControlData[] {
		const controls = this.registeredControls.filter((control) => {
			return control.translationKey.includes(section + '.' + id);
		});

		return controls || [];
	}

	/**
	 * Returns different parts present in translation key.
	 *
	 * @param {string} translationKey The translation key, e.g. '$cust.searchForms.134.987.title'.
	 * @returns {Observable<ICustomTranslateControlKeyParts>} Translation key different parts.
	 */
	private getTranslationKeyParts$(translationKey: string): Observable<ICustomTranslateControlKeyParts> {
		return this.http.get<ICustomTranslateControlKeyParts>(this.configurationService.webApiBaseUrl + 'cloud/translation/custom/gettranslationkeyparts', { params: { translationKey: translationKey } });
	}

	/**
	 * Returns the string prefix that identifies a translation file.
	 *
	 * @returns {string} The prefix string.
	 */
	public getTranslationPrefix(): string {
		return this.translationPrefix;
	}
}
