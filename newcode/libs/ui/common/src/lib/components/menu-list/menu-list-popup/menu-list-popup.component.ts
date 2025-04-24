/*
 * Copyright(c) RIB Software GmbH
 */

import { AfterViewInit, Component, ElementRef, Inject, OnDestroy, Renderer2, inject } from '@angular/core';
import { Subject, Subscription } from 'rxjs';

import { IParentMenuItem } from '../../../model/menu-list/interface/index';

import { ActivePopup } from '../../../popup/model/active-popup';


/**
 * Display popup content.
 */
@Component({
	selector: 'ui-common-menu-list-popup',
	templateUrl: './menu-list-popup.component.html',
	styleUrls: ['./menu-list-popup.component.scss'],
})

export class MenuListPopupComponent<TContext> implements AfterViewInit, OnDestroy {

	/**
	 * The active popup data
	 */
	public activePopupData!: ActivePopup;

	/**
	 * The Popup Subscription
	 */
	private popupSubscription$!: Subscription;

	/**
	 * Instantiate the popup component
	 * @param menuList  Menulist to render as a content of popup
	 * @param popup  Subject providing active poup instance
	 */
	public constructor(
		@Inject('menuList') public menuList: IParentMenuItem<TContext>,
		@Inject('activePopup') public popup: Subject<ActivePopup>,
	) {
		this.popupSubscription$ = this.popup.subscribe((res: ActivePopup) => {
			this.activePopupData = res;
		});
	}

	/**
	  * Captures the events
	  */
	private readonly renderer = inject(Renderer2);

	/**
	 * Element reference of menulist popup cmponent
	 */
	public readonly elementref = inject(ElementRef);


	public ngAfterViewInit() {
		this.close();
	}

	/**
	 * Captures mousedown event and prevents closing popup when clicked inside popup on dropdown
	 * @returns {void}
	 */
	private close(): void {
		this.renderer.listen(this.elementref.nativeElement, 'click', (event) => {
			let flag = false;

			const dropdown = this.elementref.nativeElement.getElementsByTagName('ui-common-menu-list-dropdown');

			for (let i = 0; i < dropdown.length; i++) {
				if (dropdown[i].contains(event.target)) {
					flag = true;
					break;
				}
			}

			if (this.elementref.nativeElement.contains(event.target) && !flag) {
				this.activePopupData.close();
			}

		});
	}

	public ngOnDestroy() {
		this.renderer.destroy();
		this.popupSubscription$.unsubscribe();
	}
}
