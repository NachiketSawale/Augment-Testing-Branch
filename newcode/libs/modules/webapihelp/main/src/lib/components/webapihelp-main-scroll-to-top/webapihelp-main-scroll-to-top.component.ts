/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */
import { Component, HostListener } from '@angular/core';

import { cssClass } from '../../model/enum/web-api-help-style-class.enum';
/**
 * This component provide button to scroll to top.
 */
@Component({
	selector: 'webapihelp-main-scroll-to-top',
	templateUrl: './webapihelp-main-scroll-to-top.component.html',
	styleUrls: ['./webapihelp-main-scroll-to-top.component.scss'],
})
export class WebApiHelpMainScrollToTopComponent {
	/**
	 * show hide button
	 */
	public isShow!: boolean;

	/**
	 * Top position to start showing
	 */
	public startIndexPosition = 100;

	/**
	 * list of classes
	 */
	public cssStyle = cssClass;


	/**
	 * Check Scrolling
	 */

	@HostListener('window:scroll', ['$event'])
	public checkScroll() {
		const scrollPosition = window.scrollY;
		scrollPosition >= this.startIndexPosition ? this.isShow = true : this.isShow = false;
	}

	/**
	 * For scroll to top
	 */
	public scrollToTop(): void {
		window.scroll({
			top: 0,
			left: 0,
			behavior: this.cssStyle.trasitionTopSmooth
		});
	}
}
