/*
 * Copyright(c) RIB Software GmbH
 */

import { Subject } from 'rxjs';
import { inject } from '@angular/core';
import { ContextService, IDataLanguage } from '@libs/platform/common';
import { ConcreteMenuItem, IMenuItemEventInfo, IMenuList, ItemType } from '@libs/ui/common';
import { ContainerFlag } from '../../model/enums/quantity-query-editor/type-flag.enum';

export class LanguageMenuService {
	private readonly platformContextService = inject(ContextService);

	private readonly marker: string = '(√)';
	public readonly showLanguageButtonTypeFlag = [ContainerFlag.cosParameter, ContainerFlag.cosParameter2Template];
	public defaultLanguageId: number;
	public selectedLanguageId: number;

	private readonly languageCodeMapLanguageIdObject: { [key: number]: string } = {};
	private languageItems: IDataLanguage[] | null = null;
	private languageObjectsArray: ConcreteMenuItem[] = [];

	public readonly onLanguageSelectionChanged = new Subject<{ languageId: number; typeFlag: string }>();

	public constructor(private readonly typeFlag: ContainerFlag) {
		const defaultLanguageId = this.platformContextService.getDataLanguageId(); // todo-allen: Does getDataLanguageId return a number or a string?
		this.defaultLanguageId = typeof defaultLanguageId === 'number' && defaultLanguageId !== 0 ? defaultLanguageId : 1;
		this.selectedLanguageId = this.defaultLanguageId;

		this.getLanguages();
	}

	public get langCode() {
		return this.languageCodeMapLanguageIdObject[this.selectedLanguageId];
	}

	private getLanguages() {
		if (this.languageItems === null) {
			// this.languageItems = cloudCommonLanguageService.getLanguageItems(); // todo-allen: Wait for the 'cloudCommonLanguageService.getLanguageItems' to be finished.
			this.languageItems = this.getLanguageItems(); // todo-allen: Will the getLanguageItems method return an empty list or null?
			this.languageItems.forEach((languageItem) => {
				this.languageCodeMapLanguageIdObject[languageItem.Id] = languageItem.Culture;
			});
		}
	}

	/**
	 * Mark the selected Language
	 **/
	private markSelectedLanguage(languageDesc: string) {
		return `${languageDesc}${this.marker}`;
	}

	public initialCaption(languageItem: IDataLanguage, typeFlag: string) {
		const description = languageItem.DescriptionInfo?.Description ?? '';
		if (languageItem.Id === this.defaultLanguageId) {
			this.onLanguageSelectionChanged.next({ languageId: languageItem.Id, typeFlag: typeFlag });
			return this.markSelectedLanguage(description);
		} else {
			return description;
		}
	}

	public getLanguageObjectArray(typeFlag: ContainerFlag): ConcreteMenuItem[] {
		if (this.languageItems) {
			return this.languageItems.map((item) => {
				const description = (item.DescriptionInfo?.Translated || item.DescriptionInfo?.Description) ?? '';

				return {
					id: item.Id.toString(),
					caption: this.initialCaption(item, typeFlag),
					type: ItemType.Item,
					isDisplayed: true,
					fn: (info: IMenuItemEventInfo) => {
						const languageObjects = this.languageObjectsArray;

						// Deselect the previously selected language.
						languageObjects.forEach((languageObject) => {
							languageObject.caption = languageObject.caption?.toString().replace(this.marker, '');
						});

						info.item.caption = this.markSelectedLanguage(description);
						if (this.showLanguageButtonTypeFlag.includes(typeFlag)) {
							if (this.selectedLanguageId !== item.Id) {
								this.selectedLanguageId = item.Id;
								this.onLanguageSelectionChanged.next({ languageId: item.Id, typeFlag: typeFlag });
							}
						}
					},
				};
			});
		}

		return [];
	}

	public addLanguageButton(toolbar: IMenuList) {
		if (this.showLanguageButtonTypeFlag.includes(this.typeFlag)) {
			this.languageObjectsArray = this.getLanguageObjectArray(this.typeFlag);

			toolbar.addItems({
				id: 'selectLanguageDDLBtn',
				type: ItemType.DropdownBtn,
				caption: { key: 'constructionsystem.master.toolButtonLanguage' },
				iconClass: 'tlb-icons ico-view-ods',
				list: {
					cssClass: 'dropdown-menu-right',
					showTitles: true,
					showImages: false,
					items: this.languageObjectsArray,
				},
			});
		}
	}

	// todo-allen: Return the mock data.
	//  Wait for the 'cloudCommonLanguageService.getLanguageItems' to be finished.
	//  The method will be deleted in the future.
	private getLanguageItems() {
		const additionalField = { IsDefault: false, Islive: true };
		const languages = [
			{ Id: 1, Description: 'English', Culture: 'en', Sorting: 10 },
			{ Id: 6, Description: 'English (US)', Culture: 'en-us', Sorting: 10 },
			{ Id: 2, Description: 'Deutsch', Culture: 'de', Sorting: 20, IsDefault: true },
			{ Id: 24, Description: 'German (Swiss)', Culture: 'de-ch', Sorting: 20 },
			{ Id: 3, Description: 'Suomi', Culture: 'fi', Sorting: 30 },
			{ Id: 4, Description: 'Русский', Culture: 'ru', Sorting: 40 },
			{ Id: 5, Description: 'Chinese', Culture: 'zh', Sorting: 50 },
			{ Id: 23, Description: 'Chinese (Traditional)', Culture: 'zh-hant', Sorting: 50 },
			{ Id: 7, Description: 'Français', Culture: 'fr', Sorting: 70 },
			{ Id: 25, Description: 'French (Swiss)', Culture: 'fr-ch', Sorting: 70 },
			{ Id: 8, Description: 'Español', Culture: 'es', Sorting: 80 },
			{ Id: 9, Description: 'Dutch', Culture: 'nl', Sorting: 90 },
			{ Id: 10, Description: 'Italiano', Culture: 'it', Sorting: 100 },
			{ Id: 26, Description: 'Italian (Swiss)', Culture: 'it-ch', Sorting: 100 },
			{ Id: 11, Description: 'Czech', Culture: 'cs', Sorting: 110 },
			{ Id: 12, Description: 'Polish', Culture: 'pl', Sorting: 120 },
			{ Id: 13, Description: 'Swedish', Culture: 'sv', Sorting: 130 },
			{ Id: 14, Description: 'Norwegian', Culture: 'nb', Sorting: 140 },
			{ Id: 15, Description: 'Lithuanian', Culture: 'lt', Sorting: 150 },
			{ Id: 16, Description: 'Japanese', Culture: 'ja', Sorting: 160 },
			{ Id: 17, Description: 'Portuguese', Culture: 'pt', Sorting: 170 },
			{ Id: 18, Description: 'Danish', Culture: 'da', Sorting: 180 },
			{ Id: 19, Description: 'Korean', Culture: 'ko', Sorting: 190 },
			{ Id: 20, Description: 'Vietnamese', Culture: 'vi', Sorting: 200 },
			{ Id: 21, Description: 'Thai', Culture: 'th', Sorting: 210 },
			{ Id: 22, Description: 'Indonesian', Culture: 'id', Sorting: 220 },
			{ Id: 27, Description: 'Romanian', Culture: 'ro', Sorting: 230 },
			{ Id: 28, Description: 'Hungarian', Culture: 'hu', Sorting: 240 },
			{ Id: 30, Description: 'Flemish', Culture: 'nl-be', Sorting: 260 },
		];

		return languages.map((lang) => ({
			...additionalField,
			...lang,
			IsDefault: lang.IsDefault ?? additionalField.IsDefault,
			DescriptionInfo: {
				Description: lang.Description,
				Translated: lang.Description,
			},
		})) as unknown as IDataLanguage[];
	}
}
