/*
 * Copyright(c) RIB Software GmbH
 */

import { Component, ElementRef, inject, Input } from '@angular/core';
import { Subject } from 'rxjs';

import { IPopupOptions } from '../../../popup/model/interfaces/popup-options.interface';

import { UiCommonHotkeyService } from '../../../services/menu-list/hotkey.service';
import { PopupService } from '../../../popup/services/popup.service';

import { MenuListPopupComponent } from '../../../components/menu-list/menu-list-popup/menu-list-popup.component';
import { ActivePopup } from '../../../popup/model/active-popup';
import { Translatable, TranslatePipe } from '@libs/platform/common';

import { ItemType } from '../../../model/menu-list/enum/menulist-item-type.enum';
import { ClassList } from '../../../model/menu-list/enum/class-list.enum';
import { PopupAlignment } from '../enum/popup-alignment.enum';
import { IMenuItemEventInfo } from '../../../model/menu-list/interface/menu-item-event-info.interface';
import {
	IMenuItemsList,
	IMenuItem,
	ICheckMenuItem
} from '../interface/index';

/**
 * Provides common functionality of menulist components
 */
@Component({
	template: ''
})
export class MenuListItemBaseComponent<TContext> {

	/**
	 * The context of the menu list.
	 */
	@Input() public context!: TContext;

	/**
	 * Pipe for translation
	 */
	public translate = inject(TranslatePipe);

	/**
	 * Provides tooltip with title
	 */
	public hotkeyService = inject(UiCommonHotkeyService);

	/**
	 * Open the popup and gives the active popup
	 */
	public popupService = inject(PopupService);

	/**
	 * instance of active popup
	 */
	public activePopup!: ActivePopup;

	/**
	 * Provide the updated active popup instance
	 */
	public getActivePopup$ = new Subject<ActivePopup>();


	/**
	 * This method is used to show title.
	 * @param {IMenuItem} menuItem The menulist item
	 * @returns {string} Title along with Tooltip
	 */
	public getTitle(menuItem: IMenuItem<TContext>): string {
		let effectiveCaption: Translatable | undefined;
		if (typeof menuItem.caption === 'function') {
			effectiveCaption = menuItem.caption({
				item: menuItem,
				context: this.context,
				isChecked: this.isChecked
			});
		} else {
			effectiveCaption = menuItem.caption;
		}

		let tooltip = this.translate.transform(effectiveCaption ?? '');
		const shortcut = this.hotkeyService.getTooltip(menuItem.id);
		if (shortcut) {
			// TODO: This is not an internationally safe formatting! Use a parametrizable translation string here!
			tooltip = tooltip + ' ( ' + shortcut + ' )';
		}

		return tooltip;
	}

	/**
	 * This method is used to get css class.
	 * @param {IMenuItem} menuItem The menulist item
	 * @param {string | boolean | undefined} activeValue optional  Optional field for active radio button
	 * @returns {string} CSS class list
	 */
	public getCssClass(menuItem: IMenuItem<TContext>, activeValue?: string | boolean | number | undefined): string {
		const classList = menuItem.iconClass ? menuItem.iconClass : '';

		// TODO: A base class should never switch over a set of known subtypes. Use proper polymorphism here!
		switch (menuItem.type) {
			case ItemType.DropdownBtn:
				return classList + ' ' + ClassList.dropdownToggle + ' ' + ClassList.dropdownCaret;
			case ItemType.Radio:
				if (activeValue === menuItem.id) {
					return classList + ' ' + ClassList.active;
				}
				return classList;
			case ItemType.Check:
				if ((menuItem as ICheckMenuItem<TContext>).value) {
					return classList + ' ' + ClassList.active;
				} else {
					return classList;
				}
			case ItemType.OverflowBtn:
				return classList + ' ' + ClassList.dropdownToggle + ' ' + ClassList.tlbIcons + ' ' + ClassList.menuButton + ' ' + ClassList.icoMenu;
			default:
				return classList;
		}
	}

	/**
	 * This method is return disabled.
	 * @param {IMenuItem} menuItem The menulist item
	 * @returns {boolean | undefined}  Sets disabled property of button
	 */
	public isDisabled(menuItem: IMenuItem<TContext>): boolean {
		if (typeof menuItem.disabled === 'boolean') {
			return menuItem.disabled;
		} else if (typeof menuItem.disabled === 'function') {
			return menuItem.disabled(this.createItemEventInfo(menuItem));
		}

		return false;
	}

	/**
	 * Executes the action associated with the menu item.
	 *
	 * @param menuItem The menu item definition.
	 */
	public executeItemAction(menuItem: IMenuItem<TContext>) {
		if (menuItem.fn) {
			menuItem.fn(this.createItemEventInfo(menuItem));
		}
	}

	/**
	 * Generates a menu item event info object that can be passed to event handlers.
	 * @param menuItem The menu item definition.
	 * @returns The event info object.
	 */
	protected createItemEventInfo(menuItem: IMenuItem<TContext>): IMenuItemEventInfo<TContext> {
		return {
			item: menuItem,
			context: this.context,
			isChecked: this.isChecked
		};
	}

	/**
	 * Indicates whether the menu item is checked.
	 * Some item types will always return `false`.
	 */
	protected get isChecked(): boolean {
		return false;
	}

	/**
	 * This method is used to open popup
	 * @param {IMenuItemsList} item  The menulist object
	 * @param {ElementRef} ownerElement  Reference element to open poup
	 * @param {ElementRef} elementref  The element responsible to open poup
	 * @returns {ActivePopup} Instance of active popup
	 */

	public openPopup(item: IMenuItemsList<TContext>, ownerElement: ElementRef, elementref: ElementRef): ActivePopup {
		// TODO : popupOptions refered any as width need to be passed as string and IPopupOptions allows it to be number
		const popupOptions: IPopupOptions = {};

		popupOptions.providers=[{ provide: 'menuList', useValue: item },{ provide: 'activePopup', useValue: this.getActivePopup$ }];
		popupOptions.width = 'initial';
		popupOptions.height = 'initial';
		popupOptions.hasDefaultWidth = true;
		popupOptions.resizable = false;
		popupOptions.showFooter = false;
		popupOptions.showHeader = false;
		popupOptions.alignment = this.setAlignment(elementref);
		popupOptions.multiPopup = false;

		this.activePopup = this.popupService.open(ownerElement, MenuListPopupComponent<TContext>, popupOptions);
		this.getActivePopup$.next(this.activePopup);

		return this.activePopup;
	}

	/**
	 * This method is used to closed popup
	 * @param {ActivePopup} activePopup  Instance of active popup
	 */
	public closePopup(activePopup: ActivePopup) {
		activePopup.close();
	}

	/**
	 * This method is used to set alignment of popup
	 * @param {ElementRef} elementref Reference to check menulist template is from overflow
	 * @returns {string}  Returns vertical or horizontal alignment
	 */
	public setAlignment(elementref: ElementRef): string {
		//checks the whether parent is overflow or not
		const ul = document.getElementsByTagName('ul');
		let target;

		for (let i = 0; i < ul.length; i++) {
			if (ul[i]?.classList.contains(ClassList.overflow) && ul[i].contains(elementref.nativeElement)) {
				target = ul[i];
				break;
			}
		}

		if (typeof target !== 'undefined') {
			return PopupAlignment.horizontal;
		}

		return PopupAlignment.vertical;
	}

	/**
	 * This method is used to set styling of popup content in popup
	 * @param { IMenuItemsList | undefined } list  The menulist object
	 * @returns {IMenuItemsList | undefined} The menulist object
	 */

	public getPopupContentCss(list: IMenuItemsList<TContext> | undefined): IMenuItemsList<TContext> | undefined {
		if (typeof list !== 'undefined' && Object.prototype.hasOwnProperty.call(list, 'cssClass') && !list.cssClass?.includes(ClassList.popup)) {
			list.cssClass = list?.cssClass + ' '+ ClassList.popup+' '+ ClassList.overflow;
		}
		return list;
	}
}
