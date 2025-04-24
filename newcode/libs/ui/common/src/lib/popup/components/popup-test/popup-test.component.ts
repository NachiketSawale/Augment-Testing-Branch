/*
 * Copyright(c) RIB Software GmbH
 */

import {Component, ElementRef, inject} from '@angular/core';
import {PopupService} from '../../services/popup.service';
import {PopupMenuContext} from '../../model/popup-menu-context';
import {ActivePopup} from '../../model/active-popup';

@Component({
	selector: 'ui-common-popup-test',
	templateUrl: './popup-test.component.html',
	styleUrls: ['./popup-test.component.scss'],
})
export class UiCommonPopupTestComponent {

	private popupService = inject(PopupService);
	private ele = inject(ElementRef);
	private menu?: ActivePopup;

	public closeMenu(e: MouseEvent) {
		if (this.menu) {
			this.menu.close();
		}
	}

	public openMenu(e: MouseEvent) {
		e.preventDefault();

		const menuContext = new PopupMenuContext();

		menuContext.menuItems = [
			{
				id: '1',
				description: 'm1',
			},
			{
				id: '3',
				description: 'm3',
				appendDivider: true,
			},
			{
				id: '2',
				description: 'm2',
				sort: 20,
				icon: 'ico-new',
				appendDivider: true,
				subItems: [
					{
						id: '1-1',
						description: 'm1',
						subItems: [
							{
								id: '1-1-1',
								description: '1-1-1'
							},
							{
								id: '1-1-2',
								description: '1-1-2'
							}
						]
					},
					{
						id: '3-1',
						description: 'm3',
						appendDivider: true,
					},
					{
						id: '4-1',
						description: 'm44444',
						sort: 311
					}
				]
			},
			{
				id: '4',
				description: 'm44444',
				sort: 31
			}
		];

		this.menu = this.popupService.openMenu(this.ele, menuContext, {
			basePoint: e
		});
		this.menu.closed.subscribe(() => {
			this.menu = undefined;
		});
	}
}