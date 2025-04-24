/*
 * Copyright(c) RIB Software GmbH
 */

import { Component, ElementRef, inject, Input, OnDestroy } from '@angular/core';
import { MenuListItemBaseComponent } from '../../../model/menu-list/menu-list-base/menu-list-item-base.component';
import { ConcreteMenuItem, IActionSelectBtnMenuItem, IMenuItem, IMenuItemsList } from '../../../model/menu-list/interface';
import { Subscription } from 'rxjs';
import { ItemType } from '../../../model/menu-list/enum/menulist-item-type.enum';

@Component({
	selector: 'ui-common-menu-list-action-select-btn',
	templateUrl: './menu-list-action-select-btn.component.html',
	styleUrls: ['./menu-list-action-select-btn.component.scss'],
})
export class MenuListActionSelectBtnComponent<TContext> extends MenuListItemBaseComponent<TContext> implements OnDestroy {

	/**
	 * Menu Items Object
	 */
	@Input() public menuItem!: ConcreteMenuItem<TContext>;

	public get typedMenuItem(): IActionSelectBtnMenuItem<TContext> {
		if (this.menuItem.type !== ItemType.ActionSelectBtn) {
			throw new Error('No suitable menu item assigned.');
		}
		return this.menuItem;
	}

	/**
	 * select button data
	 */
	public selectedData!: IMenuItem<TContext>;

	/**
	 * Flag for the maintain drop down popup open and close.
	 */
	public open = false;

	/**
	 * Element reference of current component 
	 */

	private readonly elementref = inject(ElementRef);

	/**
	 * subscription for active popup.
	 */
	public activePopupSubscription$!: Subscription;

	/**
	 * show caption for menu items.
	 */
	@Input() public showCaption!: boolean;

	/**
	 * Selected data for the button
	 */
	public selectedDataGet(): void {
		const menu: ConcreteMenuItem<TContext>[] | undefined = this.typedMenuItem.list.items;
		if (menu && menu.length > 0) {
			this.selectedData = menu[0];
		} else {
			console.warn('No items in the action select list.');
		}

	}

	/**
	 * This method is used for dropdown open and close.
	 * @param {IMenuItemsList} item The menulist item
	 * @returns {void}
	*/
	public toggleDropdown(item: IMenuItemsList<TContext>): void {
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

	public ngOnInit() {
		this.selectedDataGet();
	}

	public ngOnDestroy(): void {
		typeof this.activePopupSubscription$ !== 'undefined' ? this.activePopupSubscription$.unsubscribe() : null;
	}

}
