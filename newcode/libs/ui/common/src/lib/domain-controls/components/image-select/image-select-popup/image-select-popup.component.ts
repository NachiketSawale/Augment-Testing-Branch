/*
 * Copyright(c) RIB Software GmbH
 */
import { Component, EventEmitter, Inject, OnDestroy } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { IImageSelectItem } from '../../../model/image-select-item.interface';
import { ActivePopup } from '../../../../popup/model/active-popup';

@Component({
	selector: 'ui-common-image-select-popup',
	templateUrl: './image-select-popup.component.html',
	styleUrls: ['./image-select-popup.component.scss'],
})
export class ImageSelectPopupComponent implements OnDestroy {
	/**
	 * The active popup data
	 */
	private activePopupData!: ActivePopup;

	/**
	 * The Popup Subscription
	 */
	private popupInfo$!: Subscription;

	/**
	 * The keyBoardEvents Subscription
	 */
	private keyBoardEvents$!: Subscription;

	/**
	 * Instantiate the popup component
	 *
	 * @param {IImageSelectItem[]} items  select items to render as a content of popup
	 * @param {Subject<ActivePopup>} popup  Subject providing active poup instance
	 * @param {EventEmitter<unknown>} selectedItem  on selected item event emitter
	 * @param {Subject<IImageSelectItem>} keyBoardEvents  on selected item event emitter
	 */
	public constructor(
		@Inject('items') public items: IImageSelectItem[],
		@Inject('activePopup') public popup: Subject<ActivePopup>,
		@Inject('onSelectedEvent') public selectedItem: EventEmitter<IImageSelectItem>,
		@Inject('keyBoardEventSelectedItem') public keyBoardEvents: Subject<IImageSelectItem>
	) {
		this.popupInfo$ = this.popup.subscribe((res: ActivePopup) => {
			this.activePopupData = res;
		});

		this.keyBoardEvents$ = this.keyBoardEvents.subscribe((item) => {
			this.onItemHover(item);
		});
	}

	/**
	 * This function used for handled the mouse hover event
	 *
	 * @param {IImageSelectItem} item Particular item of list
	 */
	public onItemHover(item: IImageSelectItem): void {
		this.items.forEach((dataItem: IImageSelectItem) => {
			if (dataItem.displayName === item.displayName) {
				dataItem.isSelected = true;
			} else {
				dataItem.isSelected = false;
			}
		});
	}

	/**
	 * This function used for the click event or select the item from the list
	 *
	 * @param {IImageSelectItem} item Particular selcected item from list
	 */
	public onItemSelect(item: IImageSelectItem): void {
		this.selectedItem.next(item);
		this.activePopupData.close();
	}

	/**
	 * This function used for unsubscribe the observable
	 */
	public ngOnDestroy(): void {
		typeof this.popupInfo$ !== 'undefined' ? this.popupInfo$.unsubscribe() : null;
		typeof this.keyBoardEvents$ !== 'undefined' ? this.keyBoardEvents$.unsubscribe() : null;
	}
}
