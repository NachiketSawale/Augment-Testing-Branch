/**
 * $Id$
 * Copyright(c) RIB Software GmbH
 */
import { Observable, map } from 'rxjs';
import { Injectable, inject } from '@angular/core';

import { PlatformConfigurationService } from '../../services/platform-configuration.service';

import { IReportLanguageData } from '../model/report-language-data.interface';
import { IReportLanguageItems } from '../model/report-language-items.interface';
import { IUiLanguage } from '../../model/ui-data-languages/ui-language.interface';



/**
 * Service processes the language data.
 */
@Injectable({
	providedIn: 'root',
})
export class PlatformReportLanguageItemService {
	/**
	 * Service holding common config's and utilities.
	 */
	private readonly configurationService = inject(PlatformConfigurationService);

	/**
	 * Method returns the culture for the active language from the list based on 'id'.
	 *
	 * @param {IReportLanguageData} list List of languages.
	 * @returns {string|null} Culture of active language.
	 */
	public getCultureViaId(list: IReportLanguageData): string | null {
		const item = (list.items as IReportLanguageItems[]).find((item) => {
			return item.Id === +(list.activeValue as number);
		});

		return item ? item.Culture : null;
	}

	/**
	 * Method prepares the data for the languages available.
	 *
	 * @param {IUiLanguage[]} languageItems Language items.
	 * @returns {IReportLanguageItems[]} Processed language items.
	 */
	private getItemsForListContainer(languageItems: IUiLanguage[]): IReportLanguageItems[] {
		const items: IReportLanguageItems[] = [];

		languageItems.forEach((languageItem) => {
			const item: IReportLanguageItems = {
				...languageItem,
				id: languageItem.Id,
				cssClass: 'btn-default',
				caption: languageItem.Description,
				toolTip: languageItem.Description,
				iconClass: 'control-icons ico-' + languageItem.Language,
				type: 'item',
			};
			items.push(item);
		});

		return items;
	}

	/**
	 * Method gets, processes and returns the language items data.
	 *
	 * @returns {Observable<IReportLanguageItems[]>} Language items data.
	 */
	public getLanguageItems(): Observable<IReportLanguageItems[]> {
		return this.configurationService.getUiDataLanguages().pipe(
			map((data) => {
				const items = this.getItemsForListContainer(data.uilanguagessimple);
				return items;
			}),
		);
	}

	/**
	 * Method returns the language id based on the culture provided.
	 *
	 * @param {string} languageCulture Culture(eg:'en-us'...)
	 * @param {IReportLanguageItems[]} items Language item data.
	 * @returns {number} Language id.
	 */
	public getCommonLanguageId(languageCulture: string, items: IReportLanguageItems[]): number {
		const itemByCulture = items.find((item) => {
			return item.Culture === languageCulture;
		});

		return itemByCulture ? itemByCulture.id : 1;
	}

	/**
	 * Method returns the saved/default language culture.
	 *
	 * @returns {string} Saved or default culture.
	 */
	public getCulture(): string {
		return this.configurationService.savedOrDefaultUiCulture;
	}
}
