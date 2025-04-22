/*
 * Copyright(c) RIB Software GmbH
 */
import { Observable, Subscription, map } from 'rxjs';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';

import { PlatformConfigurationService } from '@libs/platform/common';
import { CustomTranslateService } from '../../services/custom-translate.service';
import { UiCommonGridDialogService, IGridDialogOptions, StandardDialogButtonId } from '../../../dialogs';

import { DomainControlBaseComponent } from '../domain-control-base/domain-control-base.component';

import { FieldType, ICustomTranslateOptions } from '../../../model/fields';
import { ICustomTranslateControlContext } from '../../model/custom-translate/custom-translate-control-context.interface';


/**
 * Data model for grid.
 */
interface ITranslationEntity {
	/**
	 * Language culture(eg: 'en', 'de' ....).
	 */
	culture: string;

	/**
	 * Translation data for culture.
	 */
	description: string | null;
}

/**
 * Class is used for creating the translations for certain strings.
 * The translation key is the resulting model of the control
 */
@Component({
	selector: 'ui-common-custom-translate',
	templateUrl: './custom-translate.component.html',
	styleUrls: ['./custom-translate.component.scss'],
})
export class CustomTranslateComponent extends DomainControlBaseComponent<string, ICustomTranslateControlContext> implements OnInit, OnDestroy {
	/**
	 * Service performing control operations.
	 */
	private readonly customTranslateService = inject(CustomTranslateService);

	/**
	 * Configuration service holding Api start point.
	 */
	private readonly configurationService = inject(PlatformConfigurationService);

	/**
	 * Current control value.
	 */
	private currentControlValue!: string | null;

	/**
	 * New control value.
	 */
	public value!: string | null;

	/**
	 * Control options.
	 */
	private options!: ICustomTranslateOptions;

	/**
	 * Key created using information of the control options object.
	 */
	private languageKey!: string;

	/**
	 * Subscriptions array for later to destroy.
	 */
	private subscriptions: Subscription[] = [];

	/**
	 * This service displays grid modal dialog.
	 */
	private readonly gridDialogService = inject(UiCommonGridDialogService);

	/**
	 * Initializes a new instance.
	 */
	public constructor() {
		super();
	}

	public ngOnInit(): void {
		this.initCustomTranslate();
		this.initWatch();
	}

	/**
	 * Initializes the control.
	 */
	private initCustomTranslate(): void {
		this.options = { ...this.controlContext.options };
		this.languageKey = this.customTranslateService.createTranslationKey(this.options);
		this.registerControl();
		const loadDataSub = this.loadLanguageData(this.languageKey, false).subscribe(() => {
			this.sendInitiatedFeedback();
		});
		this.subscriptions.push(loadDataSub);
		this.controlContext.value = this.languageKey;
	}

	/**
	 * Keeps watch on the few properties in the control options.
	 */
	private initWatch(): void {
		if (this.controlContext.options.watchId) {
			const watchIdSub = this.customTranslateService.idChange$.subscribe(() => {
				if (this.options.id !== this.controlContext.options.id) {
					this.customTranslateService.unregisterControl(this.languageKey);
					this.initCustomTranslate();
				}
			});
			this.subscriptions.push(watchIdSub);
		}

		if (this.controlContext.options.watchStructure) {
			const watchStructureSub = this.customTranslateService.structureChange$.subscribe(() => {
				if (this.options.structure !== this.controlContext.options.structure) {
					this.customTranslateService.unregisterControl(this.languageKey);
					this.initCustomTranslate();
				}
			});
			this.subscriptions.push(watchStructureSub);
		}
	}

	/**
	 * Function registers the control on initialization.
	 */
	private registerControl(): void {
		const funcs = { setValue: this.controlSetValue.bind(this), updateValue: this.controlUpdateValue.bind(this) };
		const info = { changeValue: funcs, cacheEnabled: this.options.cacheEnabled ?? true };
		this.customTranslateService.registerControl(this.languageKey, info);
	}

	/**
	 * Function sets the value in the control.
	 *
	 * @param {string} value Translation value.
	 */
	private controlSetValue(value: string): void {
		if (this.value === value) {
			return;
		}

		const saveDataSub = this.saveLanguageData(value).subscribe(() => {
			this.setControlValue(value, true);
		});

		this.subscriptions.push(saveDataSub);
	}

	/**
	 * Function updates the control value.
	 */
	private controlUpdateValue(): void {
		const loadDataSub = this.loadLanguageData(this.languageKey, true).subscribe(() => {
			//TODO:Operations to be done on update.
		});

		this.subscriptions.push(loadDataSub);
	}

	/**
	 * Function loads the language data either from cache or from server.
	 *
	 * @param {string} languageKey The translation key, e.g. '$cust.searchForms.134.987.title'.
	 * @param {boolean} withFeedback If true then changed data is sent back.
	 * @returns {Observable<{ data: string | null }>} Translation data.
	 */
	private loadLanguageData(languageKey: string, withFeedback: boolean): Observable<{ data: string | null }> {
		return this.customTranslateService.loadTranslation$(languageKey).pipe(
			map((result: { data: string | null }) => {
				this.setControlValue(result.data, withFeedback);
				return result;
			}),
		);
	}

	/**
	 * Function sets control value.
	 *
	 * @param {string|null} value control value.
	 * @param {boolean} withFeedback If true then changed data is sent back.
	 */
	private setControlValue(value: string | null, withFeedback: boolean): void {
		if (this.value === value) {
			return;
		}

		this.value = value;

		if (withFeedback) {
			this.sendChangedFeedback();
		}

		this.currentControlValue = value;
	}

	/**
	 * Calls the callback function and Sends the initial data.
	 */
	private sendInitiatedFeedback(): void {
		const feedback = {
			translationKey: this.languageKey,
			language: this.configurationService.savedOrDefaultUiCulture,
			value: this.value,
		};

		if (typeof this.options.onInitiated === 'function') {
			this.options.onInitiated(feedback);
		}
	}

	/**
	 * Calls the callback function and Sends the updated data.
	 */
	private sendChangedFeedback(): void {
		const feedback = {
			translationKey: this.languageKey,
			language: this.configurationService.savedOrDefaultUiCulture,
			value: this.value,
			oldValue: this.currentControlValue, // To allow oldValue in feedback
		};

		if (typeof this.options.onTranslationChanged === 'function') {
			this.options.onTranslationChanged(feedback);
		}
	}

	/**
	 * Method called upon change in the translation data in the input box and saves it
	 * either in cache or to the server.
	 */
	public onTranslationChanged(): void {
		const saveDataSub = this.saveLanguageData().subscribe(() => {
			this.sendChangedFeedback();
			this.currentControlValue = this.value;
		});

		this.subscriptions.push(saveDataSub);
	}

	/**
	 * Method saves translation data either in cache or to the server.
	 *
	 * @param {string} value Translation data.
	 * @returns {Observable<unknown>}
	 */
	private saveLanguageData(value?: string): Observable<unknown> {
		return this.customTranslateService.saveTranslation$(this.languageKey, value ? value : this.value);
	}

	/**
	 * Method deletes the translation data.
	 */
	public clearLanguage(): void {
		const deleteDataSub = this.customTranslateService.deleteTranslationByKey$(this.languageKey).subscribe(() => {
			this.setControlValue('', true);
		});

		this.subscriptions.push(deleteDataSub);
	}

	/**
	 * Function handles dialog button keyup event.
	 *
	 * @param {KeyboardEvent} event Keyboard event.
	 */
	public onKeyUp(event: KeyboardEvent): void {
		switch (event.code) {
			case 'Space':
				event.preventDefault();
				event.stopPropagation();
				this.openDialog();
				break;
		}
	}

	/**
	 * Function handles dialog button keydown event.
	 *
	 * @param {KeyboardEvent} event Keyboard event.
	 */
	public onKeyDown(event: KeyboardEvent) {
		switch (event.code) {
			case 'Space':
				event.preventDefault();
				event.stopPropagation();
				(event.target as HTMLElement).classList.toggle('active');
				break;
		}
	}

	/**
	 * Opens the translation dialog of this item.
	 */
	public openDialog() {
		this.customTranslateService.loadTranslations$(this.languageKey).subscribe(async (result) => {
			let id = 1;

			const translations = Object.keys(result.data).map((key) => {
				return { culture: key, description: result.data[key], Id: id++ };
			});

			const dialogOptions: IGridDialogOptions<ITranslationEntity> = {
				width: '70%',
				headerText: {
					key: 'platform.customTranslateControl.header',
					text: 'Translations',
				},
				windowClass: 'grid-dialog',
				items: translations,
				gridConfig: {
					uuid: 'b71b610f564c40ed81dfe5d853bf5fe8',
					columns: [
						{
							type: FieldType.Description,
							id: 'culture',
							required: true,
							model: 'culture',
							label: {
								text: 'Language',
								key: 'platform.customTranslateControl.language',
							},
							visible: true,
							sortable: true,
						},
						{
							type: FieldType.Code,
							id: 'description',
							required: true,
							model: 'description',
							label: {
								text: 'Description',
								key: 'platform.customTranslateControl.description',
							},
							visible: true,
							sortable: true,
						},
					],
					idProperty: 'culture',
				},
				isReadOnly: false,
				allowMultiSelect: true,
				selectedItems: [],
			};

			const dlgResult = await this.gridDialogService.show(dialogOptions);

			if (dlgResult?.closingButtonId === StandardDialogButtonId.Ok) {
				const trans: { [key: string]: string | null } = {};

				dlgResult.value?.items.forEach((item) => {
					trans[item.culture] = item.description;
				});

				this.customTranslateService.saveTranslations$(this.languageKey, trans).subscribe(() => {
					this.setControlValue(trans[this.configurationService.savedOrDefaultUiCulture], false);
				});
			}
		});
	}

	public ngOnDestroy(): void {
		this.customTranslateService.unregisterControl(this.languageKey);
		this.subscriptions.forEach((s) => s.unsubscribe());
	}
}
