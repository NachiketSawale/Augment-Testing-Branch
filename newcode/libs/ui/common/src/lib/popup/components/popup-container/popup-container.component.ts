/*
 * Copyright(c) RIB Software GmbH
 */

import {AfterViewInit, Component, inject, ViewChild, ViewContainerRef, OnDestroy, Input} from '@angular/core';
import { PopupService } from '../../services/popup.service';

/**
 * Popup container
 */
@Component({
	selector: 'ui-common-popup-container',
	templateUrl: './popup-container.component.html',
	styleUrls: ['./popup-container.component.scss']
})
export class UiCommonPopupContainerComponent implements AfterViewInit, OnDestroy {
	/**
	 * ng container
	 */
	@ViewChild('popupContainer', {read: ViewContainerRef})
	public popupContainer!: ViewContainerRef;

	/**
	 * Is primary popup container?
	 * There should be only one primary popup container in the app.
	 */
	@Input()
	public primary: boolean = false;

	private popupService = inject(PopupService);

	/**
	 * After view initialized
	 */
	public ngAfterViewInit() {
		if (!this.popupService.viewContainer || this.primary) {
			this.popupService.viewContainer = this.popupContainer;
		} else {
			console.warn('<ui-common-popup-container> is global and exist in the mainframe, please remove duplicated container!');
		}
	}

	/**
	 * Destroying
	 */
	public ngOnDestroy() {
		if(this.popupService.viewContainer === this.popupContainer) {
			this.popupService.viewContainer = null;
		}
	}
}
