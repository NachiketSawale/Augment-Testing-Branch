/*
 * Copyright(c) RIB Software GmbH
 */

import { Component, ElementRef, EventEmitter, Injector, OnDestroy, ViewChild, inject } from '@angular/core';

import { Subject, Subscription } from 'rxjs';

import { DomainControlBaseComponent } from '../domain-control-base/domain-control-base.component';
import { InputSelectPopupComponent } from '../input-select-popup/input-select-popup.component';
import { ActivePopup } from '../../../popup/model/active-popup';

import { PopupAlignment } from '../../../model/menu-list/enum/popup-alignment.enum';
import { KeyCodes } from '../../../domain-controls/model/enums/key-codes.enum';

import { PopupService } from '../../../popup/services/popup.service';

import { IPopupOptions } from '../../../popup/model/interfaces/popup-options.interface';
import { IInputSelectControlContext } from '../../../domain-controls/model/input-select-control-context.interface';
import { IInputSelectItems } from '../../../domain-controls/model/input-select-items.interface';
import { IUiInputSelectItem } from '../../model/ui-input-select-item.interface';
import { PropertyType } from '@libs/platform/common';
import { IServiceSelectOptions } from '../../../model/fields/additional/service-select-options.interface';
import { IFixedSelectOptions } from '../../../model/fields/additional/fixed-select-options.interface';

/**
 * Input select domain control functionality.
 */
@Component({
	selector: 'ui-common-input-select',
	templateUrl: './input-select.component.html',
	styleUrls: ['./input-select.component.scss'],
})
export class InputSelectComponent extends DomainControlBaseComponent<PropertyType, IInputSelectControlContext> implements OnDestroy {
	/**
	 * Represent the Element Ref container.
	 */
	@ViewChild('container', { static: false }) public readonly container!: ElementRef;

	/**
	 * Represent the inputValue Ref .
	 */
	@ViewChild('inputValue', { static: false }) public readonly inputValue!: ElementRef;

	/**
	 * Item selected on key board event.
	 */
	public readonly keyBoardEventItem$ = new Subject<IUiInputSelectItem>();

	/**
	 * Represent the EventEmmiter for the event
	 */
	public readonly onSelectedEvent$ = new EventEmitter<IUiInputSelectItem>();

	/**
	 * PopupService instance.
	 */
	public readonly popupService = inject(PopupService);

	/**
	 * Represent the ActivePopup Class object.
	 */
	public activePopup!: ActivePopup;

	/**
	 * Popup flag.
	 */
	public togglePopup = false;

	/**
	 * Represent the subject of ActivePopup.
	 */
	public readonly getActivePopup$ = new Subject<ActivePopup>();

	/**
	 * Selected item info.
	 */
	public selectedItemInfo!: IUiInputSelectItem;

	/**
	 * Represtent item info after key events.
	 */
	public itemInfo!: IUiInputSelectItem;

	/**
	 * Represtent items information.
	 */
	public items: IUiInputSelectItem[] = [];

	/**
	 * Selected item subscription.
	 */
	private readonly selectedItemSubscription$!: Subscription;

	/**
	 * Retrieves the current value converted to a string.
	 */
	public get value(): string | undefined {
		return this.controlContext.value?.toString();
	}

	/**
	 * Sets the current value as a string.
	 * @param inputValue The input value as a string.
	 */
	public set value(inputValue: string | undefined) {
		this.controlContext.value = inputValue;
	}

	/**
	 * Initializes a new instance.
	 */
	public constructor() {
		super();
		this.selectedItemSubscription$ = this.onSelectedEvent$.subscribe((data: IUiInputSelectItem) => {
			this.value = data.displayName;
			this.controlContext.value = data.displayName;
			this.selectedItemInfo = data;
			this.itemInfo = data;
			this.togglePopup = false;
			this.inputValue.nativeElement.focus();
		});
		this.items = this.getItems();
	}

	/**
	 * This is used for return the item list from control context
	 * @returns {IUiInputSelectItem[]} show the item list from control context
	 */
	public getItems(): IUiInputSelectItem[] {
		return (
			(this.controlContext.options as IFixedSelectOptions).items.map((item) => {
				return {
					id: (item as IInputSelectItems).id.toString(),
					displayName: (item as IInputSelectItems).description,
					isSelected: false,
				};
			}) ?? []
		);
	}

	/**
	 * Function will retrun array of items using service and api call.
	 * @returns Promise.
	 */
	private itemsFunc() {
		return new Promise((resolve) => {
			let injector!: Injector;
			const serviceInstance = injector.get((this.controlContext.options as IServiceSelectOptions).serviceName);
			resolve(serviceInstance[(this.controlContext.options as IServiceSelectOptions).serviceMethod as string]);
		});
	}

	/**
	 * Function check new item present into array, if not then it will push into it.
	 * @param value Newly added item.
	 */
	public updateNewItem(value: string | undefined) {
		const item = this.items.find((item: IUiInputSelectItem) => {
			return item.displayName === value;
		});
		if (!item && value) {
			const newItem: IUiInputSelectItem = {
				id: (this.items.length + 1).toString(),
				displayName: value,
				isSelected: false,
			};
			this.items.push(newItem);
		}
	}

	/**
	 * Used to open or close the popup.
	 */
	public onbuttonclick() {
		this.updateNewItem(this.value); //TODO updateNewItem function may be called using service in form, dialog etc.
		this.togglePopup ? this.closePopup() : this.openPopup();
	}

	/**
	 * Update selected item and open the popup.
	 */
	public openPopup() {
		const inputSelectItem: IUiInputSelectItem[] = this.items;
		if (this.selectedItemInfo) {
			inputSelectItem.forEach((dataItem: IUiInputSelectItem) => {
				dataItem.displayName === this.selectedItemInfo.displayName && this.value === dataItem.displayName ? (dataItem.isSelected = true) : (dataItem.isSelected = false);
			});
		}

		this.togglePopup = true;
		this.onPopupOpen(inputSelectItem, this.container);
	}

	/**
	 * This method is used to open popup
	 * @param {IUiInputSelectItem[]} items  The input select objects
	 * @param {ElementRef} ownerElement  Reference element to open poup
	 * @returns {ActivePopup} Instance of active popup
	 */
	public onPopupOpen(items: IUiInputSelectItem[], ownerElement: ElementRef): ActivePopup {
		const popupOptions: IPopupOptions = {};
		popupOptions.providers = [
			{ provide: 'items', useValue: items },
			{ provide: 'activePopup', useValue: this.getActivePopup$ },
			{ provide: 'onSelectedEvent', useValue: this.onSelectedEvent$ },
			{ provide: 'keyBoardEventSelectedItem', useValue: this.keyBoardEventItem$ },
		];

		popupOptions.hasDefaultWidth = true;
		popupOptions.resizable = false;
		popupOptions.showFooter = false;
		popupOptions.showHeader = false;
		popupOptions.alignment = PopupAlignment.vertical;
		popupOptions.multiPopup = false;

		this.activePopup = this.popupService.open(ownerElement, InputSelectPopupComponent, popupOptions) as ActivePopup;

		this.getActivePopup$.next(this.activePopup);
		return this.activePopup;
	}

	/**
	 * Update popup flag and close the popup.
	 */
	public closePopup() {
		this.togglePopup = false;
		this.activePopup.close();
		this.inputValue.nativeElement.focus();
	}

	/**
	 * Updates item using key event.
	 * @param {KeyboardEvent} event Key board event.
	 */
	public keyBoardEvents(event: KeyboardEvent) {
		switch (event.keyCode) {
			case KeyCodes.SPACE:
				event.preventDefault();
				event.stopPropagation();
				if (this.activePopup) {
					this.closePopup();
				}
				break;

			case KeyCodes.ESCAPE:
				event.preventDefault();
				event.stopPropagation();
				if (this.activePopup) {
					this.closePopup();
				}
				break;

			case KeyCodes.UP:
				event.preventDefault();
				event.stopPropagation();
				this.moveSelection(false, false);
				break;

			case KeyCodes.DOWN:
				event.preventDefault();
				event.stopPropagation();
				this.moveSelection(true, false);
				break;

			case KeyCodes.PAGE_UP:
				event.preventDefault();
				event.stopPropagation();
				this.moveSelection(false, true);
				break;

			case KeyCodes.PAGE_DOWN:
				event.preventDefault();
				event.stopPropagation();
				this.moveSelection(true, true);
				break;

			case KeyCodes.ENTER:
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
	 * Selects an item as per flag.
	 * @param {boolean} forward Indicates whether the movement takes place in increasing index order.
	 * @param {boolean} bigChange If true, several items are skipped, otherwise a directly adjacent item is selected..
	 */
	public moveSelection(forward: boolean, bigChange: boolean) {
		this.selectItem(forward, bigChange ? 2 : 1);
	}

	/**
	 * Select item as per key board event.
	 * @param {boolean} next Indicates whether the movement takes place in increasing index order.
	 * @param {number} delta Indicates the number of items by which to displace the index.
	 */
	public selectItem(next: boolean, delta: number) {
		let item: IUiInputSelectItem;

		if (!this.itemInfo) {
			item = this.items[0];
		} else {
			const currentIndex = this.items.findIndex((x) => x.displayName === this.itemInfo.displayName);
			const newIndex = this.computeMovedSelectionIndex(currentIndex, next, delta);
			item = this.items[newIndex];
		}
		this.itemInfo = item;

		this.togglePopup ? this.keyBoardEventItem$.next(item) : this.updateInputValue();
	}

	/**
	 * Updates input value and selected item info.
	 */
	public updateInputValue() {
		this.value = this.itemInfo.displayName;
		this.selectedItemInfo = this.itemInfo;
		this.controlContext.value = this.value;
	}

	/**
	 * Compute index as per key board event.
	 * @param {number} index The original index.
	 * @param {boolean} forward Indicates whether the movement takes place in increasing index order.
	 * @param {number} delta Indicates the number of items by which to displace the index.
	 * @returns {number} current index.
	 */
	public computeMovedSelectionIndex(index: number, forward: boolean, delta: number): number {
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
	 * This function used for unsubscribe the observable
	 */
	public ngOnDestroy(): void {
		typeof this.selectedItemSubscription$ !== 'undefined' ? this.selectedItemSubscription$.unsubscribe() : null;
	}
}
