/*
 * Copyright(c) RIB Software GmbH
 */
import { AfterViewInit, Component, ElementRef, OnInit, inject } from '@angular/core';

import * as _ from 'lodash';

import { PlatformTranslateService, Translatable } from '@libs/platform/common';

import { ItemType } from '../../../../model/menu-list/enum/menulist-item-type.enum';

import { IFormConfig, IFormValueChangeInfo } from '../../../../form';
import { IDialogEventInfo, StandardDialogButtonId, getCustomDialogDataToken } from '../../../base';
import { IMasterDetailItem } from '../../model/master-detail-item.interface';
import { IMasterDetailDialog } from '../../model/master-detail-dialog.interface';
import { ConcreteMenuItem } from '../../../../model/menu-list/interface/index';
import { IMenuItemsList } from '../../../../model/menu-list/interface/menu-items-list.interface';
import { getMasterDetailDialogDataToken, SimpleDataChangedProperty } from '../../model/master-detail-dialog-data.interface';
import { IMenuItemEventInfo } from '../../../../model/menu-list/interface/menu-item-event-info.interface';

/**
 * Component renders the master detail dialog body and implements the basic functionality.
 */
@Component({
	selector: 'ui-common-master-detail-dialog',
	templateUrl: './master-detail-dialog.component.html',
	styleUrls: ['./master-detail-dialog.component.scss'],
})
export class MasterDetailDialogComponent<T extends object> implements OnInit, AfterViewInit {
	/**
	 * A reference to the dialog box supplied to calling code.
	 */
	public readonly dialogInfo;

	/**
	 * Selected master item.
	 */
	public selectedItem: IMasterDetailItem<T> | undefined;

	/**
	 * Form Config for selected master item.
	 */
	public formConfig: IFormConfig<T> | undefined;

	/**
	 * List of Master Items.
	 */
	public displayedItems!: IMasterDetailItem<T>[];

	/**
	 * ToolBar data.
	 */
	public tools!: IMenuItemsList<IMasterDetailDialog<T>>;

	/**
	 * Data for master item list search operation.
	 */
	public readonly searchSettings = {
		isSearchActive: false,
		searchPlaceholder: { key: 'platform.masterdetail.filterTemplate' },
		searchTerm: '',
		searchRegEx: new RegExp(_.escapeRegExp(''), 'i'),
	};

	/**
	 * Menulist items for toolbar.
	 */
	private toolBarItems: ConcreteMenuItem<IMasterDetailDialog<T>>[] = [];

	/**
	 * A wrapper around a native element inside of a View.
	 */
	private elementRef = inject(ElementRef);

	/**
	 * Dialog body specific data.
	 */
	private readonly dialogData = inject(getMasterDetailDialogDataToken<T>());

	/**
	 * This service is useful for language translation
	 */
	private readonly platformTranslateService = inject(PlatformTranslateService);

	/**
	 * Dialog reference data.
	 */
	private readonly dialogWrapper = inject(getCustomDialogDataToken<IMasterDetailItem<T>[], MasterDetailDialogComponent<T>>());

	public constructor() {
		this.dialogInfo = (function createDialogInfo(owner: MasterDetailDialogComponent<T>) {
			return {
				get activeItemIndex() {
					return owner.getDialogInfo().dialog.activeItemIndex;
				},
				get items(): IMasterDetailItem<T>[] {
					return owner.dialogData.items;
				},
				close(closingButtonId?: StandardDialogButtonId | string) {
					owner.dialogWrapper.close(closingButtonId);
				},
			};
		})(this);
	}

	/**
	 * It is invoked only once when the directive is instantiated and initializes the
	 * component as well as implements the functions required to initialize the data.
	 */
	public ngOnInit(): void {
		if (this.dialogData.editing) {
			this.addEditTools();
		}
		this.setToolbarData();
		this.updateList();
		this.selectItem();
	}

	/**
	 * Returns Entity title.
	 * 
	 * @param item Entity item.
	 * @returns Entity title.
	 */
	public getEntityTitle(item: IMasterDetailItem<T>){
		if(item.name){
			if(typeof item.name === 'function'){
				return item.name(this.getDialogInfo());
			}else{
				return item.name;
			}
		}

		return '';
	}

	/**
	 * It is invoked only once when the view is instantiated.
	 */
	public ngAfterViewInit() {
		this.removeSplitterGutterHeight();
	}

	/**
	 * Menulist Context
	 */
	public get context(): IMasterDetailDialog<T> {
		const dlgInfo = this.getDialogInfo();

		return {
			activeItemIndex: dlgInfo.dialog.activeItemIndex,
			items: dlgInfo.dialog.items,
			close: dlgInfo.dialog.close,
		};
	}

	/**
	 * Form data.
	 */
	public entity?: T;

	//TODO: Below function is just added to make splitter working.
	//TODO: This function will be removed when height issue from splitter get resolved.
	public removeSplitterGutterHeight(): void {
		const ele = (this.elementRef.nativeElement as HTMLElement).querySelector('#sp0') as HTMLElement;
		if (ele) {
			ele.style.setProperty('height', 'auto');
		}
	}

	/**
	 * Adds editing options(add/delete) in toolbar menu.
	 */
	private addEditTools(): void {
		this.toolBarItems.push(
			{
				id: 'add',
				sort: 1,
				caption: this.dialogData.editing?.addText || 'platform.masterdetail.add',
				iconClass: 'tlb-icons ico-add',
				type: ItemType.Item,
				fn: (info: IMenuItemEventInfo<IMasterDetailDialog<T>>) => {
					if(!this.dialogWrapper.value){
						return;
					}

					Promise.resolve(this.dialogData.editing?.add(this.dialogWrapper.value)).then((newItem) => {
						this.updateList();
						if (!_.includes(this.displayedItems, newItem) && newItem) {
							this.displayedItems.push(newItem);
						}

						if (newItem) {
							this.onSelect(newItem);
						}
					});
				},

				disabled: (info: IMenuItemEventInfo<IMasterDetailDialog<T>>) => {
					return !this.dialogData.editing;
				},
			},
			{
				id: 'delete',
				sort: 2,
				caption: this.dialogData.editing?.deleteText || 'platform.masterdetail.delete',
				iconClass: 'tlb-icons ico-delete2',
				type: ItemType.Item,
				fn: (info: IMenuItemEventInfo<IMasterDetailDialog<T>>) => {
					if (this.selectedItem) {
						this.deleteMasterItem(this.selectedItem);
					}
				},

				disabled: (info: IMenuItemEventInfo<IMasterDetailDialog<T>>) => {
					return !this.dialogData.editing || !this.selectedItem || !!(this.dialogWrapper.value && this.dialogData.editing.canDelete && !this.dialogData.editing.canDelete(this.dialogWrapper.value, this.selectedItem));
				},
			},
		);
	}

	/**
	 * Function deletes the selected master item.
	 *
	 * @param { IMasterDetailItem<T> } item Selected item.
	 */
	private deleteMasterItem(item: IMasterDetailItem<T>): void {
		if (item) {
			const index = _.findIndex(this.displayedItems, function (i) {
				return i === item;
			});

			if(!this.dialogWrapper.value){
				return;
			}

			Promise.resolve(this.dialogData.editing?.delete(this.dialogWrapper.value, item)).then(() => {
				this.updateList();

				if (index === 0) {
					if (this.displayedItems.length > 0) {
						this.selectItemByIndex(0);
					}
				} else {
					if (this.displayedItems.length - 1 >= index) {
						this.selectItemByIndex(index);
					} else {
						const newIndex = index - 1;

						if (newIndex > -1) {
							this.selectItemByIndex(newIndex);
						}
					}
				}
			});
		}
	}

	/**
	 * Function selects other item when selected item is deleted.
	 *
	 * @param { number } index Item index.
	 */
	private selectItemByIndex(index: number): void {
		if (!_.isNumber(index)) {
			return;
		}

		if (index >= this.displayedItems.length) {
			return;
		}

		this.selectItem(this.displayedItems[index]);
	}

	/**
	 * Prepares toolbar data.
	 */
	private setToolbarData(): void {
		this.toolBarItems.push({
			id: 'find',
			sort: 20,
			caption: 'platform.masterdetail.filter',
			iconClass: 'tlb-icons ico-search',
			type: ItemType.Check,
			fn: (info: IMenuItemEventInfo<IMasterDetailDialog<T>>) => {
				this.searchSettings.isSearchActive = !this.searchSettings.isSearchActive;
				this.updateList(this.selectedItem);
			},
		});

		this.toolBarItems?.unshift({ type: ItemType.Divider });

		if (this.dialogData.customTools) {
			for (let i = this.dialogData.customTools.length - 1; i > -1; i--) {
				this.toolBarItems?.unshift({ ...this.dialogData.customTools[i] });
			}
		}

		this.tools = {
			cssClass: 'tools',
			showImages: true,
			showTitles: false,
			isVisible: true,
			activeValue: '',
			overflow: false,
			iconClass: '',
			layoutChangeable: false,
			items: this.toolBarItems,
		};
	}

	/**
	 * Function return disable state of item.
	 *
	 * @param { IMasterDetailItem<T> } item Master item.
	 * @returns { boolean } Is item disabled.
	 */
	public isDisabled(item?: IMasterDetailItem<T>): boolean {
		if (item && typeof item.disabled === 'function') {
			const info = this.getDialogInfo();
			return item.disabled(info);
		}

		if (item && typeof item.disabled === 'boolean') {
			return item.disabled;
		}

		return false;
	}

	/**
	 * Function return visible state of item.
	 *
	 * @param { IMasterDetailItem<T> } item Master item.
	 * @returns { boolean } Is item visible.
	 */
	private isVisible(item?: IMasterDetailItem<T>): boolean {
		if (item && typeof item.visible === 'function') {
			const info = this.getDialogInfo();
			return item.visible(info);
		}

		if (item && typeof item.visible === 'boolean') {
			return item.visible;
		}

		return true;
	}

	/**
	 * Function returns current dialog state.
	 *
	 * @returns { IDialogEventInfo<IMasterDetailDialog<T>, void> } Dialog info.
	 */
	private getDialogInfo(): IDialogEventInfo<IMasterDetailDialog<T>, void> {
		const index = this.dialogWrapper.value?.findIndex((i) => {
			return i === this.selectedItem;
		});

		const info: IDialogEventInfo<IMasterDetailDialog<T>> = {
			dialog: {
				items: this.dialogWrapper.value ?? [],
				close: (closingButtonId?: string | undefined) => {
					this.dialogWrapper.close(closingButtonId);
				},
				activeItemIndex: index,
			},
		};

		return info;
	}

	/**
	 * Function checks if item is title.
	 *
	 * @param { IMasterDetailItem<T> } item Master item.
	 * @returns { boolean } Is item a title.
	 */
	private isTitle(item?: IMasterDetailItem<T>): boolean {
		return !!item && _.includes(item.cssClass, 'title');
	}

	/**
	 * Functions removes title items if it doesn't contain any child item.
	 *
	 * @param { IMasterDetailItem<T>[] } items Master items.
	 */
	private removeUnnecessaryTitles(items: IMasterDetailItem<T>[]): void {
		let lastWasTitle = false;
		for (let i = 0; i < items.length; i++) {
			const item = items[i];
			if (this.isTitle(item)) {
				if (lastWasTitle) {
					items.splice(i - 1, 1);
				} else {
					lastWasTitle = true;
				}
			} else {
				lastWasTitle = false;
			}
		}
	}

	/**
	 * Function updates master item data.
	 *
	 * @param { IMasterDetailItem<T> }selectedItem Selected master item.
	 */
	private updateList(selectedItem?: IMasterDetailItem<T>): void {
		if(!this.dialogWrapper.value){
			return;
		}

		let filteredItems = this.dialogWrapper.value.filter((item) => {
			return this.isVisible(item);
		});

		if (this.searchSettings.isSearchActive) {
			filteredItems = filteredItems.filter((item) => {
				if (this.isTitle(item)) {
					return true;
				} else if (typeof item.matchesSearchText === 'function') {
					return item.matchesSearchText(this.searchSettings.searchRegEx);
				} else {
					let name: Translatable = '';

					if (typeof item.name === 'function') {
						const info = this.getDialogInfo();
						name = item.name(info);
					} else {
						name = item.name ?? '';
					}

					const translatedName = this.platformTranslateService.instant(name);

					return this.searchSettings.searchRegEx.test(translatedName.text);
				}
			});
		}

		this.removeUnnecessaryTitles(filteredItems);
		this.displayedItems = filteredItems;

		if (filteredItems.length === 0) {
			this.selectItem();
		} else if (selectedItem) {
			this.selectItem(selectedItem);
		}
	}

	/**
	 * Function selects item.
	 *
	 * @param { IMasterDetailItem<T> } item Selected item.
	 */
	private selectItem(item?: IMasterDetailItem<T>): void {
		let itemToSelect;

		if (_.isNull(item) || this.displayedItems.length === 0) {
			this.onSelect();
			return;
		}

		if (_.isObject(item)) {
			if (!this.isTitle(item) && !this.isDisabled(item) && _.includes(this.displayedItems, item)) {
				itemToSelect = item;
			}
		}

		if (!itemToSelect) {
			itemToSelect = this.displayedItems.find((i) => {
				return !this.isDisabled(i) && !this.isTitle(i);
			});
		}

		if (itemToSelect) {
			this.onSelect(itemToSelect);
		} else {
			this.onSelect();
		}
	}

	/**
	 * Function selects item.
	 * @param { IMasterDetailItem<T> } item Selected item.
	 */
	public onSelect(item?: IMasterDetailItem<T>): void {
		if (this.isDisabled(item) || !this.isVisible(item) || this.isTitle(item)) {
			return;
		}

		this.selectedItem = item;

		//TODO: Implementation when 'preparedData' property present in form config.

		this.updateSelection();
	}

	/**
	 * Gets called when form entity is changed.
	 * 
	 * @param data { IFormValueChangeInfo<T> } Entity change information.
	 */
	public onValueChanged(data: IFormValueChangeInfo<T>){
		if(this.dialogData.dataChangedMember){
			data.entity[this.dialogData.dataChangedMember] = true as T[SimpleDataChangedProperty<T>];
		}
	}

	/**
	 * Updates form data for the selected item.
	 */
	private updateSelection(): void {
		//TODO: Implementation for finalizers

		if (this.selectedItem && this.selectedItem.form) {
			this.formConfig = this.selectedItem.form;
			this.entity = this.selectedItem.value;
		}else if(this.selectedItem && this.dialogData.defaultForm){
			Object.assign(this.selectedItem, this.dialogData.defaultForm(this.context));
			this.formConfig = this.selectedItem.form;
			this.entity = this.selectedItem.value;
		}else {
			this.formConfig = undefined;
		}

		//TODO: Implementation for initializers
	}

	/**
	 * Function implements search operation.
	 */
	public onSearch(): void {
		this.searchSettings.searchRegEx = new RegExp(_.escapeRegExp(this.searchSettings.searchTerm), 'i');

		if (this.searchSettings.isSearchActive) {
			this.updateList(this.selectedItem);
		}
	}
}
