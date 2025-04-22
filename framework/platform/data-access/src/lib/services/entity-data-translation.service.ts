/*
 * Copyright(c) RIB Software GmbH
 */

import { IDataLanguage, IDefaultLanguageInfo, PlatformConfigurationService } from '@libs/platform/common';
import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, forkJoin, map, of } from 'rxjs';
import { IEntityTranslatableColumnValue } from '../model/data-translation/entity-translatable-column-value.interface';
import { DataTranslationEntity } from '../model/data-translation/data-translation-entity.model';
import { IDataTranslations } from '../model/data-translation/data-translations.interface';
import { IEntityModification } from '../model/data-service/interface/entity-modification.interface';


@Injectable({
	providedIn: 'root'
})
export class EntityDataTranslationService {

	private configService = inject(PlatformConfigurationService);
	private http = inject(HttpClient);

	private translationLoadedSubject$ = new BehaviorSubject<IDataTranslations[]>([]);
	private activeParentService!: IEntityModification<object>;
	private selectedParentEntity!: object | null;
	private defaultLanguagesInfo?: IDefaultLanguageInfo;
	private allLanguages?: IDataLanguage[];
	private translatableValues: IEntityTranslatableColumnValue[] = [];

	/**
	 * Event fired on translation load complete
	 */
	public translationLoaded$() {
		return this.translationLoadedSubject$.asObservable();
	}

	/**
	 * Called by the data service on entity selection
	 * @param toSelect
	 * @param parentService
	 */
	public loadTranslation(toSelect: object | null, parentService: IEntityModification<object>) {
		if (toSelect !== null && (!Array.isArray(toSelect) || toSelect.length === 1)) {
			this.activeParentService = parentService;
			this.selectedParentEntity = toSelect;
			this.translatableValues = [];
			const item = Array.isArray(toSelect) ? toSelect[0] : toSelect;
			for (const prop in item) {
				if (item[prop] && typeof item[prop] === 'object' && 'DescriptionTr' in item[prop]) {
					this.translatableValues.push({columnName: prop, columnValue: item[prop]});
				}
			}
			this.loadTranslationOfItems(this.translatableValues);
		}
	}

	/**
	 * Notifies the parent service about translation change
	 */
	public translationChanged() {
		if (this.selectedParentEntity) {
			this.activeParentService.setModified(this.selectedParentEntity);
		}
	}

	/**
	 * Loads the default languages info
	 */
	public getDefaultLanguagesInfo() {
		if (this.defaultLanguagesInfo) {
			return of(this.defaultLanguagesInfo);
		}

		return this.http.get(this.configService.webApiBaseUrl + 'cloud/common/getdatalanguageinfo').pipe(
			map(defaultLanguageInfo => {
				this.defaultLanguagesInfo = defaultLanguageInfo as IDefaultLanguageInfo;
				return this.defaultLanguagesInfo;
			})
		);
	}

	/**
	 * Loads all the available languages
	 */
	public getAllLanguages() {
		if (this.allLanguages) {
			return of(this.allLanguages);
		}

		return this.http.get(this.configService.webApiBaseUrl + 'cloud/common/getlanguages').pipe(
			map(languages => {
				this.allLanguages = languages as IDataLanguage[];
				return this.allLanguages;
			})
		);
	}

	private loadTranslationOfItems(trColumnValues: IEntityTranslatableColumnValue[]) {
		const requests = trColumnValues.map(columnValue => this.http.get<DataTranslationEntity[]>(this.configService.webApiBaseUrl + 'cloud/common/gettranslation', {params: {id: columnValue.columnValue.DescriptionTr}}));
		forkJoin(requests).subscribe(
			(results: DataTranslationEntity[][]) => {
				const dataTranslations: IDataTranslations[] = trColumnValues.map(c => {
					return {columnName: c.columnName, trValue: c.columnValue.DescriptionTr, translations: [], descriptionInfoObj: c.columnValue};
				});
				results.forEach(translations => {
					if (translations.length > 0) {
						const columnName = trColumnValues.find(c => c.columnValue.DescriptionTr === translations[0].Id)?.columnName;
						if (columnName) {
							const dataTranslationItem = dataTranslations.find(t => t.columnName === columnName);
							if (dataTranslationItem) {
								dataTranslationItem.translations = translations;
							}

						}
					}
				});

				this.translationLoadedSubject$.next(dataTranslations);
			}
		);
	}
}