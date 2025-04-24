/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import * as _ from 'lodash';
import { Component, ElementRef, EventEmitter, inject, InjectionToken, Injector, Input, Output, StaticProvider, ViewChild } from '@angular/core';
import { CustomDialogLookupOptions, CustomLookupPopupResult, ICreateOptions, ICustomDialogLookupContext } from '../../model/dialog-lookup.interface';
import { ActivePopup, IEditorDialog, IEditorDialogOptions, IEditorDialogResult, ILookupReadonlyDataService, PopupService, StandardDialogButtonId, UiCommonDialogService } from '@libs/ui/common';
import { from, iif } from 'rxjs';
import { BasicsSharedCreateService } from '../../services/create.service';
import { PlatformTranslateService } from '@libs/platform/common';
import { BasicsSharedSearchDialogBodyComponent } from '../search-dialog-body/search-dialog-body.component';
import { ICustomSearchDialogOptions, ISearchEntity, ISearchResult } from '../../model/search-dialog/search-dialog-interface';
import { ICustomFormDialogOptions, ICustomFormEditorDialog } from '../../model/form-dialog/form-dialog.interface';
import { BasicsSharedFormDialogBodyComponent } from '../form-dialog-body/form-dialog-body.component';

const CUSTOM_DLG_OPTIONS_TOKEN = new InjectionToken('custom_dlg_options');
const CUSTOM_DLG_LOOKUP_CONTEXT_TOKEN = new InjectionToken('custom_dlg_lookup_context');
const CUSTOM_DLG_LOOK_OPTIONS_TOKEN = new InjectionToken('custom_dlg_look_options');

export function getCustomDialogOptionToken<TValue extends object, TDialog extends IEditorDialog<TValue>, TOptions extends IEditorDialogOptions<TValue, TDialog>>(): InjectionToken<TOptions> {
	return CUSTOM_DLG_OPTIONS_TOKEN;
}

export function getCustomDialogLookupContextToken<TItem extends object, TEntity extends object>(): InjectionToken<ICustomDialogLookupContext<TItem, TEntity>> {
	return CUSTOM_DLG_LOOKUP_CONTEXT_TOKEN;
}

export function getCustomDialogLookupOptionsToken<TItem extends object, TEntity extends object>(): InjectionToken<CustomDialogLookupOptions<TItem, TEntity>> {
	return CUSTOM_DLG_LOOK_OPTIONS_TOKEN;
}

/**
 *
 * @param options
 */
export function createFormDialogLookupProvider<TItem extends object, TEntity extends object>(options: CustomDialogLookupOptions<TItem, TEntity>): StaticProvider[] {
	return [{
		provide: getCustomDialogLookupOptionsToken<TItem, TEntity>(),
		useValue: options
	}];
}

@Component({
	selector: 'basics-shared-dialog-lookup-input-base',
	templateUrl: './dialog-lookup-input-base.component.html',
	styleUrls: ['./dialog-lookup-input-base.component.css']
})
export class BasicsSharedDialogLookupInputBaseComponent<TItem extends object, TEntity extends object> {
	private injector = inject(Injector);
	private translateService = inject(PlatformTranslateService);
	private createService = inject(BasicsSharedCreateService);
	private dialogService = inject(UiCommonDialogService);
	private popupService = inject(PopupService);
	private activePopup?: ActivePopup;

	private get valueMember(): string {
		return this.lookupOptions.valueMember as string;
	}

	private get displayMember(): string {
		return (this.lookupOptions.displayMember ?? this.lookupOptions.descriptionMember) as string;
	}

	public get displayDescription(): string {
		return this.objectValue ? (_.get(this.objectValue, this.displayMember) || '') : '';
	}

	public lookupOptions!: CustomDialogLookupOptions<TItem, TEntity>;
	public dataService!: ILookupReadonlyDataService<TItem, TEntity>;

	@ViewChild('container')
	public container!: ElementRef;

	@ViewChild('popupBtn')
	public popupBtn!: ElementRef;

	/**
	 * Custom dialog options, must be specified when using the component.
	 * @param customOptions The custom options to config the component to has custom behavior.
	 */
	@Input({required: true})
	public set options(customOptions: CustomDialogLookupOptions<TItem, TEntity>) {
		this.lookupOptions = customOptions;
		this.updateData();
	}

	/**
	 * The object value to be managed, must be specified when using the component.
	 */
	@Input({required: true})
	public objectValue: TItem | null | undefined;

	/**
	 * The entity that contains the object value, must be specified when using the component.
	 */
	@Input({required: true})
	public entity!: TEntity;

	/**
	 * Determine whether the control is readonly or not.
	 */
	@Input()
	public readonly?: boolean;

	/**
	 * The object value change event, emit after new entity is created or new item is selected.
	 */
	@Output()
	public objectValueChange = new EventEmitter<TItem | null | undefined>();

	private updateData() {
		const dataService = this.lookupOptions?.dataService;
		const dataServiceToken = this.lookupOptions?.dataServiceToken;
		this.dataService = dataService ? dataService : (dataServiceToken ? this.injector.get(dataServiceToken) : this.dataService);
	}

	private cloneContext(): ICustomDialogLookupContext<TItem, TEntity> {
		return {
			value: this.objectValue,
			entity: this.entity,
			options: this.lookupOptions
		} as ICustomDialogLookupContext<TItem, TEntity>;
	}

	private openPopup() {
		const popupOptions = this.lookupOptions.popupOptions;
		if (!popupOptions?.gridView || !popupOptions?.options) {
			return;
		}

		popupOptions.options.providers = [{
			provide: getCustomDialogLookupContextToken<TItem, TEntity>(),
			useValue: this.cloneContext()
		}, ...popupOptions.options.providers ?? []];

		popupOptions.options.relatedElement = this.popupBtn;

		this.activePopup = this.popupService.open(this.container, popupOptions.gridView, popupOptions.options);
		this.activePopup.closed.subscribe(result => {
			this.activePopup = undefined;
			this.onPopupClosed(result);
		});
	}

	private closePopup() {
		this.activePopup?.dismiss();
	}

	private onPopupClosed(result: unknown) {
		const r = result as CustomLookupPopupResult<TItem>;
		if (r && r.apply) {
			this.onSelectedItemChanged(r.result as TItem);
		}
	}

	private handleSelectedItem(item: TItem) {
		if (this.lookupOptions?.cloneOnly) {
			const observable = iif(() => !this.objectValue,
				this.createService.create(this.lookupOptions.createOptions as ICreateOptions<TItem, TEntity>, this.entity),
				from<TItem[]>([this.objectValue as TItem])
			);
			observable.subscribe(newValue => {
				const valueMember = this.valueMember;
				const cloneFn = this.lookupOptions.cloneFn ?? function (oldValue, newValue) {
					const cloneValue = _.cloneDeep(item) as TItem;
					const frozenProps = [valueMember, 'InsertedAt', 'InsertedBy', 'UpdatedAt', 'UpdatedBy', 'Version'];
					frozenProps.forEach(prop => {
						_.set(cloneValue, prop, _.get(newValue, prop));
					});
					return cloneValue;
				};

				const cloneValue = cloneFn(item, newValue);
				this.updateValue(cloneValue);
			});
		} else {
			this.updateValue(item);
		}
	}

	private onSelectedItemChanged(selectedItem?: TItem): void {
		if (selectedItem) {
			this.handleSelectedItem(selectedItem);
		}
	}

	/**
	 * Clear component value.
	 */
	public clearValue() {
		this.updateValue(null);
	}

	/**
	 * Update object value and emit the change event.
	 * @param newValue
	 */
	public updateValue(newValue: TItem | null | undefined): void {
		this.objectValue = newValue;
		this.objectValueChange.emit(this.objectValue);
	}

	/**
	 * Toggle popup.
	 */
	public togglePopup() {
		if (this.activePopup) {
			this.closePopup();
		} else {
			this.openPopup();
		}
	}

	/**
	 * Show search dialog for chose the lookup item.
	 */
	public showSearchDialog() {
		const searchOptions = this.lookupOptions.searchOptions;
		if (this.lookupOptions.showSearchButton && searchOptions) {
			const dialogProviders = [{
				provide: getCustomDialogOptionToken<ISearchResult<TItem>, IEditorDialog<ISearchResult<TItem>>, ICustomSearchDialogOptions<TItem, TEntity>>(),
				useValue: searchOptions
			}, {
				provide: getCustomDialogLookupContextToken<TItem, TEntity>(),
				useValue: this.cloneContext()
			}];
			const customOptions = this.dialogService.createOptionsForCustom<IEditorDialog<ISearchResult<TItem>>, ICustomSearchDialogOptions<TItem, TEntity>, ISearchResult<TItem>, BasicsSharedSearchDialogBodyComponent<TItem, TEntity>>(searchOptions, info => info.body.dialogInfo, BasicsSharedSearchDialogBodyComponent, dialogProviders);

			let formValue = searchOptions.form?.entity ? searchOptions.form.entity(this.entity ?? {} as TEntity) : {} as ISearchEntity;
			if (searchOptions.onDialogOpening) {
				formValue = searchOptions.onDialogOpening(formValue, searchOptions.form?.entityRuntimeData);
			}
			customOptions.value = {
				formValue: formValue,
				selectedItem: undefined
			};
			customOptions.buttons = [{
				id: StandardDialogButtonId.Ok,
				isDisabled: () => {
					return !customOptions.value?.selectedItem;
				}
			}, {
				id: StandardDialogButtonId.Cancel
			}];

			this.dialogService.show(customOptions)?.then((result: IEditorDialogResult<ISearchResult<TItem>>) => {
				if (result.closingButtonId === StandardDialogButtonId.Ok && result.value?.selectedItem) {
					this.handleSelectedItem(result.value.selectedItem);
				}
			});
		}
	}

	/**
	 * Show edit dialog for form.
	 */
	public showEditDialog() {
		const createOptions = this.lookupOptions.createOptions;
		if (!createOptions) {
			throw new Error('create options is undefined.');
		}

		const observable = iif(() => !this.objectValue,
			this.createService.create(createOptions, this.entity),
			from<TItem[]>([this.objectValue as TItem]),
		);

		observable.subscribe(item => {
			if (!createOptions.formDialogOptions) {
				throw new Error('formDialogOptions is undefined.');
			}

			const dialogEntity = _.cloneDeep(item);
			const headerText = createOptions.formDialogOptions.headerText ?? 'Form Dialog';
			const titleField = createOptions.titleField ?? '';

			const formDialogOptions = {
				...createOptions.formDialogOptions,
				value: dialogEntity,
				headerText: this.translateService.instant(headerText).text + (titleField ? (' - ' + this.translateService.instant(titleField).text) : ''),
				providers: [{
					provide: getCustomDialogLookupContextToken<TItem, TEntity>(),
					useValue: this.cloneContext()
				}]
			};

			const dialogProviders = [{
				provide: getCustomDialogOptionToken<TItem, ICustomFormEditorDialog<TItem>, ICustomFormDialogOptions<TItem>>(),
				useValue: formDialogOptions
			}];
			const customOptions = this.dialogService.createOptionsForCustom<ICustomFormEditorDialog<TItem>, ICustomFormDialogOptions<TItem>, TItem, BasicsSharedFormDialogBodyComponent<TItem>>(formDialogOptions, info => info.body.dialogInfo, BasicsSharedFormDialogBodyComponent, dialogProviders);

			createOptions.onDialogOpening && createOptions.onDialogOpening(dialogEntity);

			this.dialogService.show(customOptions)?.then((result: IEditorDialogResult<TItem>) => {
				if (result.closingButtonId === StandardDialogButtonId.Ok) {
					this.updateValue(result.value as TItem);
				}
			});
		});
	}
}
