/*
 * Copyright(c) RIB Software GmbH
 */

import { Component, EventEmitter, Inject, OnDestroy } from '@angular/core';

import { Subject, Subscription } from 'rxjs';

import { ActivePopup } from '../../../popup/model/active-popup';

import { IUiInputSelectItem } from '../../../domain-controls/model/ui-input-select-item.interface';

/**
 * Input select Control Popup Container Section.
 */
@Component({
	selector: 'ui-common-input-select-popup',
	templateUrl: './input-select-popup.component.html',
	styleUrls: ['./input-select-popup.component.scss'],
})
export class InputSelectPopupComponent implements OnDestroy {
	/**
	 * The active popup data
	 */
	public activePopupData!: ActivePopup;

	/**
	 * The Popup Subscription
	 */
	public popupSubscription$!: Subscription;

	/**
	 * The keyBoardEventItem Subscription
	 */
	public keyBoardEventItemSubscription$!: Subscription;

	public constructor(
		@Inject('items') public items: IUiInputSelectItem[],
		@Inject('activePopup') public popup: Subject<ActivePopup>,
		@Inject('onSelectedEvent') public selectedItem: EventEmitter<IUiInputSelectItem>,
		@Inject('keyBoardEventSelectedItem') public keyBoardEventItem: Subject<IUiInputSelectItem>,
	) {
		this.popupSubscription$ = this.popup.subscribe((res: ActivePopup) => {
			this.activePopupData = res;
		});

		this.keyBoardEventItemSubscription$ = this.keyBoardEventItem.subscribe((item) => {
			this.onItemHover(item);
		});
	}

	/**
	 * This function used for handled the mouse hover event
	 *
	 * @param {IUiSelectItem} item Particular item of list
	 */
	public onItemHover(item: IUiInputSelectItem): void {
		this.items.forEach((dataItem: IUiInputSelectItem) => {
			if (dataItem.id === item.id) {
				dataItem.isSelected = true;
			} else {
				dataItem.isSelected = false;
			}
		});
	}

	/**
	 * This function used for the click event or select the item from the list
	 *
	 * @param {IUiSelectItem} item Particular selcected item from list
	 */
	public onItemSelect(item: IUiInputSelectItem): void {
		this.selectedItem.next(item);
		this.activePopupData.close();
	}

	/**
	 * This function used for unsubscribe the observable
	 */
	public ngOnDestroy(): void {
		typeof this.popupSubscription$ !== 'undefined' ? this.popupSubscription$.unsubscribe() : null;
		typeof this.keyBoardEventItemSubscription$ !== 'undefined' ? this.keyBoardEventItemSubscription$.unsubscribe() : null;
	}
}
