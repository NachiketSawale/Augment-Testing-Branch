/*
 * Copyright(c) RIB Software GmbH
 */

import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { getCustomDialogDataToken } from '@libs/ui/common';
import {IExcelExportDialogValue} from '../../model/wizards/interfaces/excel-export-dialog-value.interface';
import { CloudTranslationImportExportService } from '../../services/cloud-translation-import-export.service';
import { PlatformTranslateService, Translatable } from '@libs/platform/common';
import { FormsModule } from '@angular/forms';
import { ICheckboxItem } from '../../model/wizards/interfaces/checkbox-item.interface';
import { ICheckBoxCategories } from '../../model/wizards/interfaces/checkbox-categories.interface';
import { IResourceCategory } from '../../model/wizards/interfaces/resource-category.interface';

@Component({
	selector: 'cloud-translation-export-dialog',
	standalone: true,
	imports: [CommonModule, FormsModule],
	templateUrl: './cloud-translation-export-dialog.component.html',
	styleUrl: './cloud-translation-export-dialog.component.scss',
})
export class CloudTranslationExportDialogComponent<T extends object> implements OnInit {

	/**
	 * Represents the dialogWrapper property.
	 */
	private readonly dialogWrapper = inject(getCustomDialogDataToken<IExcelExportDialogValue, CloudTranslationExportDialogComponent<T>>());

	/**
	 * Represents the importExportService property.
	 */
	private readonly importExportService = inject(CloudTranslationImportExportService);

	/**
	 * Represents the translateService property.
	 */
	private readonly translateService = inject(PlatformTranslateService);

	/** 
	 * Indicates if the button is active. 
	 */
	public isButtonActive: boolean = this.dialogWrapper.value?.isButtonActive || false;

	/** 
	 * The default language.
	 */
	public defaultLanguage: string = this.dialogWrapper.value?.defaultLanguage || '';

	/** 
	 * The title for selected languages.
	 */
	public selectedLanguagesTitle: string = this.dialogWrapper.value?.selectedLanguagesTitle || '';

	/** 
	 * The file name for the download file. 
	 */
	public downloadFile: string = this.dialogWrapper.value?.downloadFile || '';

	/** 
	 * The success message text. 
	 */
	public successText: string = this.dialogWrapper.value?.successText || '';

	/** 
	 * The failed message text. 
	 */
	public failedText: string = this.dialogWrapper.value?.failedText || '';

	/** 
	 * The list of checkbox items. 
	 */
	public checkboxItems: ICheckboxItem[] = this.dialogWrapper.value?.checkboxItems || [];
	
	/** 
	 * Indicates if untranslated items are selected. 
	 */
	public isUntranslated: boolean = this.dialogWrapper.value?.isUntranslated || true;

	/** 
	 * The title for untranslated items.
	*/
	public untranslatedTitle: string = this.dialogWrapper.value?.untranslatedTitle || '';

	/** 
	 * Indicates if the export has changed. 
	 */
	public isExportChanged: boolean = this.dialogWrapper.value?.isExportChanged || false;

	/** 
	 * The title for new or changed items. 
	 */
	public newOrChangedTitle: string = this.dialogWrapper.value?.newOrChangedTitle || '';

	/** 
	 * Indicates if resource remark is added. 
	 */
	public isResourceRemarkAdded: boolean = this.dialogWrapper.value?.isResourceRemarkAdded || true;

	/** 
	 * The title for adding resource remark. 
	 */
	public addResourceRemarkTitle: string = this.dialogWrapper.value?.addResourceRemarkTitle || '';

	/** 
	 * Indicates if translation remark is added.
	 */
	public isTranslationRemarkAdded: boolean = this.dialogWrapper.value?.isButtonActive || false;

	/** 
	 * The title for adding translation remark. 
	 */
	public addTranslationRemarkTitle: string = this.dialogWrapper.value?.addTranslationRemarkTitle || '';

	/** 
	 * The title for adding path. 
	 */
	public addPathTitle: string = this.dialogWrapper.value?.addPathTitle || '';

	/** 
	 * Indicates if path is added. 
	 */
	public isPathAdded: boolean = this.dialogWrapper.value?.isPathAdded || false;

	/** 
	 * The title for adding parameter info.
	 */
	public addParameterInfoTitle: string = this.dialogWrapper.value?.addParameterInfoTitle || '';

	/** 
	 * Indicates if parameter info is added. 
	 */
	public isParameterInfoAdded: boolean = this.dialogWrapper.value?.isParameterInfoAdded || false;

	/** 
	 * The title for export by category. 
	 */
	public exportByCategoryTitle: string = this.dialogWrapper.value?.exportByCategoryTitle || '';

	/** 
	 * The list of checkbox categories. 
	 */
	public checkBoxCategories: ICheckBoxCategories[] = this.dialogWrapper.value?.checkBoxCategories || [];

	/** 
	 * Indicates if category is added. 
	 */
	public isCategoryAdded: boolean = this.dialogWrapper.value?.isCategoryAdded || false;

	/** 
	 * The title for adding category. 
	 */
	public addCategoryTitle: string = this.dialogWrapper.value?.addCategoryTitle || '';

	/** 
	 * The options for checkbox. 
	 */
	public checkboxOptions= this.dialogWrapper.value?.checkBoxCategories || {};

	/** 
	 * Indicates if the component is loading. 
	 */
	public loading!: boolean;

	/** 
	 * Indicates if the component has failed. 
	 */
	public failed!: boolean;

	/** 
	 * The error message. 
	 */
	public error!: string | null;

	/** 
	 * The message text. 
	 */
	public message!: string;

	/** 
	 * Indicates if the link is active. 
	 */
	public linkActive!: boolean;

	/** 
	 * The link data. 
	 */
	public linkData!: string;	

	/** 
	 * The list of selected languages. 
	 */
	public selectedLanguages!: { text: Translatable }[];

	/** 
	 * The information text.
	 */
	public infoText!: string;

	/** 
	 * The configuration title text.
	 */
	public titleTextConfig!: string;

	/**
	 * The languages title text. 
	 */
	public titleTextLanguages!: string;

	/** 
	 * The additional columns title text.
	 */
	public titleTextAdditionalColumns!: string;

	/** 
	 * The file name. 
	 */
	public fileName!: string;

	/**
	 * Initializes the component.
	 */
	public ngOnInit(): void {
		this.initializeScopeVars();
		this.importExportService.getLanguages().subscribe({
			next: (languages : string[]) => {
				this.populateDialogWithLanguage(languages);
				this.populateDialogWithCategories(this.importExportService.resourceCategories);
				this.showEverything();
			},
			error: (err) => {
				this.printFailedText(err);
			}
		});
	}

	/**
	 * Initializes scope variables.
	 */
	public initializeScopeVars(): void {
		this.checkboxItems = [];
		this.isButtonActive = true;
		this.message = this.translateService.instant('cloud.translation.exportdlg.fetchLanguageLoadingMessage').text;
		this.failed = false;
		this.loading = true;
		this.linkActive = false;
		this.linkData = '';
		this.checkboxOptions = {
			isFlatDesign: false,
		};
		this.infoText = this.translateService.instant('cloud.translation.exportdlg.infoText').text;
		this.titleTextConfig = this.translateService.instant('cloud.translation.exportdlg.titleTextConfig').text;
		this.titleTextLanguages = this.translateService.instant('cloud.translation.exportdlg.titleTextLanguages').text;
		this.titleTextAdditionalColumns = this.translateService.instant('cloud.translation.exportdlg.titleTextAdditionalColumns').text;
		this.selectedLanguages = [];
	}

	/**
	 * Prints the failed text.
	 */
	public printFailedText(err: string): void {
		this.loading = false;
		this.failed = true;
		this.error = err;
	}

	/**
	 * Sets the boolean values to display all content on the dialog.
	 */
	public showEverything(): void {
		this.loading = false;
		this.isButtonActive = true;
	}

	/**
	 * Populates the dialog with language.
	 * @param languages The list of languages.
	 */
	public populateDialogWithLanguage(languages: string[]): void {
		this.checkboxItems = [];
		languages.filter(language => language !== 'ENGLISH')
		  .sort()
		  .forEach(language => {
			this.checkboxItems.push({
			  isChecked: false,
			  text: language
			});
		  });
	  }

	/**
	 * Populates the dialog with categories.
	 * @param categories The list of categories.
	 */	
	public populateDialogWithCategories(categories: IResourceCategory[]): void {
		categories.map((category: IResourceCategory) => {
			this.checkBoxCategories.push({
				isChecked: false,
				text: category.Description,
				item: category
			});
		});
	}

	/**
	 * Performs export action on export button click.
	 */
	public onExport(): void {
		this.isButtonActive = false;
		this.loading = true;
		this.message = this.translateService.instant('cloud.translation.exportdlg.exportLoadingMessage').text;
		this.selectedLanguages = this.checkboxItems.filter((item) => item.isChecked);
		const selectedLanguageNames = this.selectedLanguages.map((item) => item.text as Translatable);
		const selectedCategoryBoxes = this.checkBoxCategories.filter((category) => category.isChecked);
		const selectedCategories = selectedCategoryBoxes.map((category) => category.item.Id);

		const filters = {
			untranslated: this.isUntranslated,
			changed: this.isExportChanged,
			resourceRemark: this.isResourceRemarkAdded,
			translationRemark: this.isTranslationRemarkAdded,
			addCategory: this.isCategoryAdded,
			path: this.isPathAdded,
			parameterInfo: this.isParameterInfoAdded,
			categories: selectedCategories
		};

		this.importExportService.exportWithFilter(selectedLanguageNames as string[], filters).subscribe({
			next: (result) => {
				this.linkActive = true;
				this.linkData = result.data;
				const parts = result.data.split('/');
				this.fileName = parts[parts.length - 1];
				this.loading = false;
			},
			error: (err: string) => {
				this.printFailedText(err);
			}
		});
	}
}
