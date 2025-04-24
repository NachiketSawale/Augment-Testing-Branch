import {Injectable} from '@angular/core';
import { PlatformConfigurationService, PlatformReportLanguageItemService, ServiceLocator} from '@libs/platform/common';
import {BasicsTextModulesMainService} from './text-modules-main-data.service';
import {BasicsTextModulesScope} from '../model/basics-textmodules-scope';
import {find, get} from 'lodash';

import {BasicsTextModulesTextDataService} from './text-modules-text-data.service';
import {BlobsEntity, IClobsEntity} from '@libs/basics/shared';
import {ITextModuleTextEntity} from '../model/entities/textmoduletext-entity.interface';
import {TextFormatTypes} from '../model/types/text-format.type';

@Injectable({
	providedIn: 'root'
})
export class BasicsTextModulesTextControllerService {

	private configurationService = ServiceLocator.injector.get(PlatformConfigurationService);
	private loginLanguageId: number;
	private languageItemService = ServiceLocator.injector.get(PlatformReportLanguageItemService);
	private parentService = ServiceLocator.injector.get(BasicsTextModulesMainService);


	public constructor(public scope: BasicsTextModulesScope, public dataService: BasicsTextModulesTextDataService) {
		this.parentService.selectionChanged$.subscribe(parentItems => {
			if (parentItems && parentItems.length > 0) {
				const parentItem = parentItems[0];
				// this.scope.entity = parentItem;
				this.scope.textareaEditable = parentItem.TextFormatFk === this.scope.textFormatFk;
				// languageDependentChanged(parentItem.IsLanguageDependent);
			} else {
				this.scope.textareaEditable = false;
			}

		});

		this.loginLanguageId = this.configurationService.savedOrDefaultDataLanguageId;
		this.getLanguageList();
	}

	private getLanguageList() {
		this.languageItemService.getLanguageItems().subscribe(response => {
			const currentLanguageId = this.getCurrentLanguage();
			this.getDataByLanguageId(currentLanguageId);
			this.scope.editorOptions.language.list = response;
			this.scope.editorOptions.language.current = find(response, {Id: currentLanguageId}) || undefined;
			this.updateLanguageBtnValue(currentLanguageId);
			const selectedItems = this.parentService.getSelection();
			if (selectedItems && selectedItems.length > 0) {
				setTimeout(() => {
					this.enableDisableLanguageSelect(selectedItems[0].IsLanguageDependent);
				}, 500);
			}

		});
	}

	private enableDisableLanguageSelect(isEnabled: boolean) {
		const langSelector = document.querySelector('.ql-language .ql-picker-label') as HTMLElement;
		if (langSelector) {
			if (isEnabled) {
				langSelector.style.pointerEvents = 'auto';
				langSelector.style.color = '#333';
			} else {
				langSelector.style.pointerEvents = 'none';
				langSelector.style.color = '#ccc';
			}
		}
	}

	private updateLanguageBtnValue(languageId: number) {
		if (this.scope.textFormatFk !== TextFormatTypes.specification) {
			return;
		}

		if (this.scope.editorOptions.language && this.scope.editorOptions.language.list) {
			const language = find(this.scope.editorOptions.language.list, {Id: languageId});
			if (language) {
				const langSelector = document.querySelector('.ql-language .ql-picker-label');
				if (langSelector) {
					const descriptionInfo = get(langSelector, 'DescriptionInfo');
					if (descriptionInfo) {
						const Translated = get(descriptionInfo, 'Translated');
						langSelector.setAttribute('data-value', Translated);
					}
				}
			}
		}
	}

	private getCurrentLanguage() {
		return this.loginLanguageId;
	}

	public itemListChange(scope: BasicsTextModulesScope) {
		if (scope.editorOptions.language.current) {
			const id = get(scope.editorOptions.language.current, 'Id');
			if (id) {
				this.getDataByLanguageId(id);
			}

		} else {
			this.actionWithoutLanguage(scope);
		}
	}

	private actionWithoutLanguage(scope: BasicsTextModulesScope) {
		scope.translation = undefined;
		scope.oldContent = undefined;
	}

	private getDataByLanguageId(languageId: number) {
		if (!languageId || !this.scope.textareaEditable) {
			switch (this.scope.textFormatFk) {
				case TextFormatTypes.specification:
					this.scope.translation = {
						TextBlob: {Content: ''}
					} as unknown as ITextModuleTextEntity;
					break;
				case TextFormatTypes.html:
					this.scope.translation = {} as unknown as ITextModuleTextEntity;
					break;
			}
			this.scope.oldContent = undefined;
			return;
		}

		this.dataService.getDataByLanguageId(languageId, this.scope.contentField)
			.then(response => {
				this.scope.translation = response as ITextModuleTextEntity;
				if (this.scope.contentField) {
					const content = get(response, this.scope.contentField) as unknown as BlobsEntity | IClobsEntity;
					if (content) {
						this.scope.oldContent = Object.assign({}, content);
					} else {
						this.scope.oldContent = undefined;
					}
				}
			});
	}

	public checkContentChanged() {
		if (!this.scope.oldContent) {
			return false;
		}
		if (!this.scope.translation) {
			return false;
		}
		const newContent = get(this.scope.translation, this.scope.contentField) as unknown as BlobsEntity | IClobsEntity;

		if (!this.scope.oldContent.Content && !newContent.Content) {
			return false;
		}
		if (this.scope.oldContent.Content !== newContent.Content) {
			return true;
		}
		return false;
	}
}
