/*
 * Copyright(c) RIB Software GmbH
 */

import { Component, ElementRef, Input, OnDestroy, inject } from '@angular/core';
import { Subscription } from 'rxjs';

import { ItemType } from '../../../model/menu-list/enum/menulist-item-type.enum';
import { IMenuItemsList } from '../../../model/menu-list/interface/menu-items-list.interface';

import { MenuListItemBaseComponent } from '../../../model/menu-list/menu-list-base/menu-list-item-base.component';
import { ConcreteMenuItem } from '../../../model/menu-list/interface/index';
import { IOverflowBtnMenuItem } from '../../../model/menu-list/interface/overflow-btn-menu-item.interface';

/**
 *  Display menu list of type overflow.
 */
@Component({
	selector: 'ui-common-menu-list-overflow',
	templateUrl: './menu-list-overflow.component.html',
	styleUrls: ['./menu-list-overflow.component.scss'],
})
export class MenuListOverflowComponent<TContext> extends MenuListItemBaseComponent<TContext> implements OnDestroy {

	/**
	 * Menu Items Object
	 */
	@Input() public menuItem!: ConcreteMenuItem<TContext>;

	public get typedMenuItem(): IOverflowBtnMenuItem<TContext> {
		if (this.menuItem.type !== ItemType.OverflowBtn) {
			throw new Error('No suitable menu item assigned.');
		}

		return this.menuItem;
	}

	/**
	 * show title of the menu items.
	 */
	@Input()
	public showTitles!: boolean;

	/**
	 * Flag for the maintain drop down popup open and close.
	 */
	public open = false;

	/**
	 * subscription for active popup.
	 */
	private activePopupSubscription$!: Subscription;

	/**
	 * Element reference of current component 
	 */
	private readonly elementref = inject(ElementRef);

	/**
	 * This method is used for dropdown open and close.
	 * @param {IMenuItemsList} item The menulist item
	 * @returns {void}
	 */

	public toggleDropdown(item: IMenuItemsList<TContext>):void {
		this.typedMenuItem.list = this.getPopupContentCss(this.typedMenuItem.list) ?? { items: [] };
		this.open = !this.open;

		const ownerElement = {
			nativeElement: this.elementref.nativeElement.parentElement,
		};

		if (this.open) {
			this.activePopup = this.openPopup(item, ownerElement, this.elementref);
		} else {
			this.open = false;
			this.closePopup(this.activePopup);
		}

		this.activePopupSubscription$ = this.activePopup.closed.subscribe(() => {
			this.open = false;
		});
	}

	public ngOnDestroy(){
		typeof this.activePopupSubscription$ !== 'undefined' ? this.activePopupSubscription$.unsubscribe() : null;
	}
}
