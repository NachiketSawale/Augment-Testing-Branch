/*
 * Copyright(c) RIB Software GmbH
 */

import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { ContainerBaseComponent } from '@libs/ui/container-system';
import { ColumnDef, FieldType, IFieldValueChangeInfo, IGridConfiguration, ISimpleMenuItem, ITabbedDialogOptions, ItemType, UiCommonTabbedDialogService } from '@libs/ui/common';
import { EntityDataTranslationService, IDataTranslations } from '@libs/platform/data-access';
import { forkJoin, map, Observable, Subscription } from 'rxjs';
import { IDataLanguage, IDefaultLanguageInfo, IOtherLanguageDescription, PlatformConfigurationService } from '@libs/platform/common';
import { ITranslationGridData } from '../../model/translation-grid-data.interface';
import { IssueDialogBodyComponent } from '../translation-resolution/issue-dialog-body/issue-dialog-body.component';
import { ResolutionHistoryComponent } from '../translation-resolution/resolution-history/resolution-history.component';
import { UiBusinessBaseEntityTranslationIssueService } from '../../services/ui-business-base-entity-translation-issue.service';
import { ITranslationIssueParam } from '../../model/translation-issue-param.interface';
import { ITranslationIssueHistoryParam } from '../../model/translation-issue-history-param.interface';
import { ITranslationIssue } from '../../model/translation-issue.interface';


@Component({
	selector: 'ui-data-translation-grid',
	templateUrl: './data-translation-grid.component.html',
	styleUrls: ['./data-translation-grid.component.scss'],
})
export class DataTranslationGridComponent extends ContainerBaseComponent implements OnInit, OnDestroy {

	private readonly dataTranslationService = inject(EntityDataTranslationService);
	private readonly translationResolutionService = inject(UiBusinessBaseEntityTranslationIssueService);
	private readonly dialogService = inject(UiCommonTabbedDialogService);
	private readonly configService = inject(PlatformConfigurationService);

	private cultureColumn: ColumnDef<ITranslationGridData> = {
		id: 'Culture',
		label: {
			text: 'Culture',
		},
		type: FieldType.Description,
		model: 'Culture',
		sortable: false,
		sortOrder: 4,
		readonly: true,
		width: 100,
		visible: true,
	};
	private trLoadedSubscription!: Subscription;
	private defaultConfig: IGridConfiguration<ITranslationGridData> = {
		idProperty: 'RowId'
	};
	private languagesMap: Map<number, IDataLanguage> = new Map<number, IDataLanguage>();
	private defaultLanguageInfo!: IDefaultLanguageInfo;

	public config!: IGridConfiguration<ITranslationGridData>;
	private dataTranslations: IDataTranslations[] = [];


	private getTranslationColumn(columnName: string): ColumnDef<ITranslationGridData> {
		return {
			id: columnName,
			label: {
				text: this.getTranslationColumnDisplayName(columnName),
			},
			type: FieldType.Description,
			model: columnName,
			sortable: false,
			sortOrder: 6,
			width: 100,
			visible: true,
		};
	}

	private getTranslationColumnDisplayName(columnName: string) {
		const columnNameWithSpaces = columnName.split(/(?=[A-Z][a-z])/).join(' ');
		return columnNameWithSpaces.endsWith('Info') ? columnNameWithSpaces.slice(0, -5) : columnNameWithSpaces;
	}

	private updateGridConfiguration(dataTranslations: IDataTranslations[]) {
		const columns = [this.cultureColumn];
		dataTranslations.forEach(c => columns.push(this.getTranslationColumn(c.columnName)));
		this.config.columns = columns;
	}


	private setGridData(dataTranslations: IDataTranslations[]) {
		const items: ITranslationGridData[] = [];
		this.dataTranslations = dataTranslations;
		dataTranslations.forEach(dataTranslation => {

			const trMap = new Map(dataTranslation.translations.map(i => [i.BasLanguageFk, i]));
			this.languagesMap.forEach((l, languageId) => {

				const rowId = this.getRowId(dataTranslation.trValue, languageId);
				const translationItem = trMap.get(languageId);
				if (trMap.has(languageId) && translationItem) {

					if (!items.find(d => d['RowId'] === rowId)) {
						items.push({
							RowId: rowId,
							BasLanguageFk: translationItem.BasLanguageFk,
							Version: translationItem.Version,
							Culture: this.getCultureString(translationItem.BasLanguageFk),
							Id: translationItem.Id
						});
					}
				} else {
					// new item
					items.push({
						RowId: rowId,
						BasLanguageFk: languageId,
						Version: 0,
						Culture: this.getCultureString(languageId),
						Id: dataTranslation.trValue
					});
				}

				const item = items.find(d => d['RowId'] === rowId);
				if (item) {
					if (item.BasLanguageFk === this.defaultLanguageInfo.DatabaseLanguageId) {
						item[dataTranslation.columnName] = dataTranslation.descriptionInfoObj.Description;
					} else {
						item[dataTranslation.columnName] = translationItem?.Description || '';
					}

				}
			});

		});
		this.config.items = items;
	}

	private getCultureString(languageFk: number) {
		if (languageFk === this.defaultLanguageInfo.DatabaseLanguageId) {
			return this.languagesMap.get(languageFk)?.DescriptionInfo?.Translated + '*';
		}
		return this.languagesMap.get(languageFk)?.DescriptionInfo?.Translated || '';
	}

	private getRowId(id: number, languageFk: number) {
		return `${id}-${languageFk}`;
	}

	private initialize() {
		this.initializeGridConfig();
		this.loadAvailableLanguages();
		this.configureMenuItems();
	}

	private configureMenuItems() {
		const menuItem: ISimpleMenuItem = {
			caption: {key: 'ui.business-base.translationIssueDialog.dialogTitle'},
			hideItem: false,
			disabled: false,
			iconClass: 'tlb-icons ico-info',
			id: 'translationIssue',
			//sort: index + 1,
			type: ItemType.Item,
			fn: () => {
				this.showIssueDialog();
			},
			//permission: '#c'
		};
		this.uiAddOns.toolbar.addItems([menuItem]);
	}

	private showIssueDialog() {
		const dialogOptions: ITabbedDialogOptions = {
			headerText: {key: 'ui.business-base.translationIssueDialog.dialogTitle'},
			width: '600px',
			minHeight: '400px',
			buttons: [{
				id: 'cancel'
			}],
			tabs: [
				{
					uuid: 'issue',
					tabHeader: {key: 'ui.business-base.translationIssueDialog.tabIssue'},
					bodyComponent: IssueDialogBodyComponent
				},
				{
					uuid: 'history',
					tabHeader: {key: 'ui.business-base.translationIssueDialog.tabHistory'},
					bodyComponent: ResolutionHistoryComponent
				}
			]
		};

		this.dialogService.showDialog(dialogOptions);
	}

	private initializeGridConfig() {
		this.config = {...this.defaultConfig};
		this.config.uuid = this.containerDefinition.uuid;
	}

	private loadAvailableLanguages() {
		const defaultLanguagesInfo$ = this.dataTranslationService.getDefaultLanguagesInfo();
		const allLanguages$ = this.dataTranslationService.getAllLanguages();

		forkJoin([defaultLanguagesInfo$, allLanguages$]).subscribe(([defaultLanguagesInfo, allLanguages]) => {
			console.log(defaultLanguagesInfo, allLanguages);
			console.log(this.configService.savedOrDefaultDataLanguageId);
			this.defaultLanguageInfo = defaultLanguagesInfo;
			allLanguages.forEach(l => {
				const languageItem = this.languagesMap.get(l.Id);
				if (!languageItem && l.Id !== this.configService.savedOrDefaultDataLanguageId) {
					if (l.Id === defaultLanguagesInfo.DatabaseLanguageId && l.DescriptionInfo) {
						l.DescriptionInfo.Description = l.DescriptionInfo.Description + '*';
					}
					this.languagesMap.set(l.Id, l);
				}
			});
		});
	}

	private loadTranslationIssues(dataTranslations: IDataTranslations[]) {
		if (dataTranslations.length === 0) {
			this.translationResolutionService.setCurrentTranslationIssues(undefined);
			return;
		}
		const requests: Observable<ITranslationIssue[]>[] = [];
		dataTranslations.forEach(dataTranslation => {
			const issueParam: ITranslationIssueParam = {
				itemValue: dataTranslation.descriptionInfoObj.Description,
				columnName: dataTranslation.columnName,
				basTranslationFk: dataTranslation.trValue
			};
			requests.push(this.translationResolutionService.getTranslationIssues(issueParam));
		});

		if (requests.length) {
			forkJoin(requests).pipe(
				map((responses) => {
					if (responses.length === 0) {
						this.translationResolutionService.setCurrentTranslationIssues(undefined);
					}
					let currentIssue: ITranslationIssue | undefined = undefined;
					responses.forEach((issues) => {
						if (issues.length > 0 && !currentIssue) {
							currentIssue = issues[0];
						}
					});

					this.translationResolutionService.setCurrentTranslationIssues(currentIssue);
				})
			).subscribe();
		}

		// const sampleItem = dataTranslations[0];
		// const issueParam: ITranslationIssueParam = {
		// 	itemValue: sampleItem.descriptionInfoObj.Description,
		// 	columnName: sampleItem.columnName,
		// 	basTranslationFk: sampleItem.trValue
		// };
		// this.translationResolutionService.getTranslationIssues(issueParam).subscribe(issues => {
		// 	this.translationResolutionService.setCurrentTranslationIssues(issues.length > 0 ? issues[0] : undefined);
		// });

		const historyParam: ITranslationIssueHistoryParam = {
			BasTranslationFkList: dataTranslations.map(t => t.trValue)
		};

		this.translationResolutionService.getIssueHistory(historyParam).pipe(
			map((responses) => {
				this.translationResolutionService.setCurrentTranslationIssueHistory(responses);
			})
		).subscribe();
	}

	/**
	 * OnInit
	 */
	public ngOnInit() {
		this.initialize();
		this.trLoadedSubscription = this.dataTranslationService.translationLoaded$().subscribe(dataTranslations => {
			this.config = {
				...this.config
			};
			this.updateGridConfiguration(dataTranslations);
			this.setGridData(dataTranslations);
			this.loadTranslationIssues(dataTranslations);
		});
	}

	/**
	 * OnDestroy
	 */
	public override ngOnDestroy() {
		super.ngOnDestroy();
		this.trLoadedSubscription.unsubscribe();
	}

	/**
	 * Translation changed in grid callback
	 * @param data
	 */
	public valueChanged(data: IFieldValueChangeInfo<ITranslationGridData>) {
		const dataTranslationItem = this.dataTranslations.find(e => e.columnName === data.field.model);
		if (dataTranslationItem) {
			if (data.entity.BasLanguageFk === this.defaultLanguageInfo.DatabaseLanguageId) { // English translation changed
				dataTranslationItem.descriptionInfoObj.Description = data.newValue as string;
			} else {
				let otherLanguageTranslation: IOtherLanguageDescription | undefined;
				if (!Array.isArray(dataTranslationItem.descriptionInfoObj.OtherLanguages)) {
					dataTranslationItem.descriptionInfoObj.OtherLanguages = [];
				}
				otherLanguageTranslation = dataTranslationItem.descriptionInfoObj.OtherLanguages.find(e => e.LanguageId === data.entity.BasLanguageFk);

				if (!otherLanguageTranslation) {
					otherLanguageTranslation = {
						LanguageId: data.entity.BasLanguageFk,
						Description: data.newValue as string,
						Version: 1
					};
					dataTranslationItem.descriptionInfoObj.OtherLanguages.push(otherLanguageTranslation);
				}

				otherLanguageTranslation.Description = data.newValue as string;
			}

			dataTranslationItem.descriptionInfoObj.Modified = true;

			this.dataTranslationService.translationChanged();
		}
	}


}
