/*
 * Copyright(c) RIB Software GmbH
 */

import * as _ from 'lodash';
import {Component, ElementRef, inject, OnInit} from '@angular/core';
import {PopupService} from '../../services/popup.service';
import {PopupMenuContext} from '../../model/popup-menu-context';
import {IPopupMenuItem} from '../../model/interfaces/popup-menu-item.interface';
import {ActivePopup} from '../../model/active-popup';

/**
 * Popup menu
 */
@Component({
	selector: 'ui-common-popup-menu',
	templateUrl: './popup-menu.component.html',
	styleUrls: ['./popup-menu.component.scss'],
})
export class UiCommonPopupMenuComponent implements OnInit {
	private subPopup?: ActivePopup;
	/**
	 * Menu items.
	 */
	public items: IPopupMenuItem[] = [];

	private popupService = inject(PopupService);
	private popup = inject(ActivePopup);
	private context = inject(PopupMenuContext);

	public ngOnInit() {
		const items = _.sortBy(this.context.menuItems, ['sort']);

		items.forEach((item, index) => {
			this.items.push(item);

			if (item.appendDivider) {
				this.items.push({
					id: `divider-${index}`,
					description: 'divider',
					divider: true
				});
			}
		});

		if (this.context.menuParent) {
			this.context.menuParent.closed.subscribe(() => {
				this.close();
			});
		}
	}

	/**
	 * TrackBy function for ngFor directive
	 * @param index
	 * @param item
	 */
	public trackById(index: number, item: IPopupMenuItem) {
		return item.id;
	}

	/**
	 * Has sub menu
	 * @param item
	 */
	public hasSubMenu(item: IPopupMenuItem) {
		return item.subItems != null && item.subItems.length > 0;
	}

	/**
	 * Open sub menu
	 * @param item
	 * @param e
	 */
	public openSubMenu(item: IPopupMenuItem, e: MouseEvent) {
		if (this.subPopup) {
			this.subPopup.close();
		}

		if (!this.hasSubMenu(item)) {
			return;
		}

		const subMenuContext = new PopupMenuContext();
		subMenuContext.menuLevel = this.context.menuLevel + 1;
		subMenuContext.menuItems = item.subItems || [];
		subMenuContext.menuParent = this.popup;

		this.subPopup = this.popupService.open(new ElementRef(e.target), UiCommonPopupMenuComponent, {
			showFooter: false,
			showHeader: false,
			alignment: 'horizontal',
			hasDefaultWidth: false,
			level: subMenuContext.menuLevel,
			providers: [
				{
					provide: PopupMenuContext,
					useValue: subMenuContext
				}
			]
		});
		this.subPopup.parent = this.popup;
		this.subPopup.closed.subscribe(() => {
			this.subPopup = undefined;
		});
	}

	/**
	 * Resolve selected menu icon
	 * @param item
	 */
	public resolveIcon(item: IPopupMenuItem) {
		if (item.icon) {
			return `tlb-icons ${item.icon}`;
		}

		return '';
	}

	/**
	 * Execute selected menu item
	 * @param item
	 */
	public execute(item: IPopupMenuItem) {
		if (item.execute) {
			item.execute();
			this.closeParent();
		}
	}

	/**
	 * Close menu
	 */
	public close() {
		this.popup.close();
	}


	private closeParent() {
		let popup = this.popup;

		while (popup.parent) {
			popup = popup.parent;
		}

		popup.close();
	}
}