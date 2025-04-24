/*
 * Copyright(c) RIB Software GmbH
 */

import { Component, ElementRef, EventEmitter, ViewChild, inject } from '@angular/core';
import { Subject, Subscription } from 'rxjs';

import { PropertyType } from '@libs/platform/common';
import { ActivePopup } from '../../../popup/model/active-popup';
import { IImageSelectControlContext } from '../../model/image-select-control-context.interface';
import { IImageSelectItem } from '../../model/image-select-item.interface';
import { IPopupOptions } from '../../../popup/model/interfaces/popup-options.interface';

import { SelectkeyCodes } from '../../model/select-key-event.enum';
import { PopupAlignment } from '../../../model/menu-list/enum/popup-alignment.enum';

import { PopupService } from '../../../popup/services/popup.service';

import { DomainControlBaseComponent } from '../domain-control-base/domain-control-base.component';
import { ImageSelectPopupComponent } from './image-select-popup/image-select-popup.component';
import { IFixedSelectOptions } from '../../../model/fields/additional/fixed-select-options.interface';

@Component({
	selector: 'ui-common-image-select',
	templateUrl: './image-select.component.html',
	styleUrls: ['./image-select.component.scss'],
})
export class ImageSelectComponent extends DomainControlBaseComponent<PropertyType, IImageSelectControlContext> {
	/**
	 * Represent the Element Ref imageSelectContainer.
	 */
	@ViewChild('imageSelectContainer', {static: false}) public imageSelectContainer!: ElementRef;

	/**
	 * Represent the Element Ref dropdownButton.
	 */
	@ViewChild('dropdownButtonTemplate', {static: false}) public dropdownButtonTemplate!: ElementRef;

	/**
	 * Item selected on keyboard event.
	 */
	private readonly keyboardEventItem$ = new Subject<IImageSelectItem>();

	/**
	 * Represent the EventEmmiter for the event
	 */
	private readonly onSelectedEvent$ = new EventEmitter<IImageSelectItem>();

	/**
	 * PopupService instance.
	 */
	private readonly popupService = inject(PopupService);

	/**
	 * Represent the ActivePopup Class object.
	 */
	private activePopup!: ActivePopup;

	/**
	 * Popup flag.
	 */
	private isPopupOpen: boolean = false;

	/**
	 * Image text value.
	 */
	public displayTitle!: string;

	/**
	 * Image or icon value.
	 */
	public iconCSS!: string;

	/**
	 * Represent the subject of ActivePopup.
	 */
	private readonly activePopup$ = new Subject<ActivePopup>();

	/**
	 * Selected item info.
	 */
	private selectedItemInfo!: IImageSelectItem;

	/**
	 * Represent item info after key events.
	 */
	private itemInfo!: IImageSelectItem;

	/**
	 * Selected item subscription.
	 */
	private readonly selectedItem$!: Subscription;

	/**
	 * Initializes a new instance.
	 */
	public constructor() {
		super();
		const initItem = this.items.find(e => e.id === this.controlContext.value);
		if (initItem) {
			this.assignItem(initItem);
		}
		this.selectedItem$ = this.onSelectedEvent$.subscribe((data: IImageSelectItem) => {
			this.assignItem(data);
			this.isPopupOpen = false;
		});
	}

	private assignItem(data: IImageSelectItem) {
		this.displayTitle = data.displayName;
		this.iconCSS = data.iconCSS;
		this.controlContext.value = data.id;
		this.selectedItemInfo = data;
		this.itemInfo = data;
	}

	/**
	 *	 Image List Data
	 */
	public get items(): IImageSelectItem[] {
		return (
			(this.controlContext.itemsSource as IFixedSelectOptions).items.map((item) => {
				return {
					id: (item as IImageSelectItem).id,
					displayName: (item as IImageSelectItem).displayName,
					iconCSS: (item as IImageSelectItem).iconCSS,
					isSelected: this.controlContext.value === (item as IImageSelectItem).id || this.controlContext.value === (item as IImageSelectItem).id.toString(),
				};
			}) ?? []
		) as IImageSelectItem[];
	}

	/**
	 * Used to open or close the popup
	 */
	public onButtonClick() {
		this.isPopupOpen ? this.closePopup() : this.openPopup();
	}

	/**
	 * Update selected item and open the popup.
	 */
	private openPopup() {
		const imageSelectItem: IImageSelectItem[] = this.items;
		if (this.selectedItemInfo) {
			imageSelectItem.forEach((dataItem: IImageSelectItem) => {
				dataItem.id === this.selectedItemInfo.id && this.displayTitle === dataItem.displayName ? (dataItem.isSelected = true) : (dataItem.isSelected = false);
			});
		}

		this.isPopupOpen = true;
		this.onPopupOpen(imageSelectItem, this.imageSelectContainer);
	}

	/**
	 * This method is used to open popup
	 * @param {IImageSelectItem[]} items  The input select objects
	 * @param {ElementRef} ownerElement  Reference element to open poup
	 * @returns {ActivePopup} Instance of active popup
	 */
	private onPopupOpen(items: IImageSelectItem[], ownerElement: ElementRef): ActivePopup {
		const popupOptions: IPopupOptions = {};
		popupOptions.providers = [
			{provide: 'items', useValue: items},
			{provide: 'activePopup', useValue: this.activePopup$},
			{provide: 'onSelectedEvent', useValue: this.onSelectedEvent$},
			{provide: 'keyBoardEventSelectedItem', useValue: this.keyboardEventItem$},
		];

		popupOptions.hasDefaultWidth = true;
		popupOptions.resizable = false;
		popupOptions.showFooter = false;
		popupOptions.showHeader = false;
		popupOptions.alignment = PopupAlignment.vertical;
		popupOptions.multiPopup = false;

		this.activePopup = this.popupService.open(ownerElement, ImageSelectPopupComponent, popupOptions) as ActivePopup;

		this.activePopup$.next(this.activePopup);
		return this.activePopup;
	}

	/**
	 * Update popup flag and close the popup.
	 */
	private closePopup() {
		this.isPopupOpen = false;
		this.activePopup.close();
	}

	/**
	 * Updates item using key event.
	 * @param event Key board event.
	 */
	public keyboardEventItem(event: KeyboardEvent) {
		switch (event.code) {
			case SelectkeyCodes.SPACE:
				event.preventDefault();
				event.stopPropagation();
				this.onButtonClick();
				break;

			case SelectkeyCodes.ESCAPE:
				event.preventDefault();
				event.stopPropagation();
				if (this.activePopup) {
					this.closePopup();
				}
				break;
			case SelectkeyCodes.LEFT:
				event.preventDefault();
				event.stopPropagation();
				this.moveSelection(false, false);
				break;
			case SelectkeyCodes.RIGHT:
				event.preventDefault();
				event.stopPropagation();
				this.moveSelection(true, false);
				break;
			case SelectkeyCodes.UP:
				event.preventDefault();
				event.stopPropagation();
				this.moveSelection(false, false);
				break;

			case SelectkeyCodes.DOWN:
				event.preventDefault();
				event.stopPropagation();
				this.moveSelection(true, false);
				break;

			case SelectkeyCodes.PAGE_UP:
				event.preventDefault();
				event.stopPropagation();
				this.moveSelection(false, true);
				break;

			case SelectkeyCodes.PAGE_DOWN:
				event.preventDefault();
				event.stopPropagation();
				this.moveSelection(true, true);
				break;

			case SelectkeyCodes.ENTER:
				event.preventDefault();
				event.stopPropagation();
				if (this.activePopup) {
					this.updateInputValue();
					this.closePopup();
				}
				break;
		}
	}

	/**
	 * Select item as per key board event.
	 * @param { boolean }next Indicates whether the movement takes place in increasing index order.
	 * @param { number }delta Indicates the number of items by which to displace the index.
	 */
	private selectItem(next: boolean, delta: number) {
		let item: IImageSelectItem;

		if (!this.itemInfo) {
			item = this.items[0];
		} else {
			const currentIndex = this.items.findIndex((x) => x.displayName === this.itemInfo.displayName);
			const newIndex = this.computeMovedSelectionIndex(currentIndex, next, delta);
			item = this.items[newIndex];
		}
		this.itemInfo = item;

		this.isPopupOpen ? this.keyboardEventItem$.next(item) : this.updateInputValue();
	}

	/**
	 * Updates input value and selected item info.
	 */
	private updateInputValue() {
		this.displayTitle = this.itemInfo.displayName;
		this.iconCSS = this.itemInfo.iconCSS;
		this.selectedItemInfo = this.itemInfo;
		this.controlContext.value = this.displayTitle;
	}

	/**
	 * Compute index as per keyboard event.
	 * @param { number } index The original index.
	 * @param { boolean } forward Indicates whether the movement takes place in increasing index order.
	 * @param { number } delta Indicates the number of items by which to displace the index.
	 * @returns current index.
	 */
	private computeMovedSelectionIndex(index: number, forward: boolean, delta: number): number {
		const actualDelta = delta;

		if (index === -1) {
			return 0;
		} else {
			let result = index + (forward ? 1 : -1) * actualDelta;
			if (result < 0) {
				if (result === -actualDelta) {
					result = this.items.length - 1;
				} else {
					result = 0;
				}
			} else if (result >= this.items.length) {
				if (result === this.items.length - 1 + actualDelta) {
					result = 0;
				} else {
					result = this.items.length - 1;
				}
			}
			return result;
		}
	}

	/**
	 * Selects an item as per flag.
	 * @param forward Indicates whether the movement takes place in increasing index order.
	 * @param bigChange If true, several items are skipped, otherwise a directly adjacent item is selected..
	 */
	private moveSelection(forward: boolean, bigChange: boolean) {
		this.selectItem(forward, bigChange ? 2 : 1);
	}

	/**
	 * This function used for unsubscribe the observable
	 */
	public onDestroy(): void {
		typeof this.selectedItem$ !== 'undefined' ? this.selectedItem$.unsubscribe() : null;
	}
}