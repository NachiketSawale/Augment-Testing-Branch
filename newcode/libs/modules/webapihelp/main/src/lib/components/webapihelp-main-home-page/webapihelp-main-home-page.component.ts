/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */
import { Component, OnDestroy } from '@angular/core';

import { cssClass } from '../../model/enum/web-api-help-style-class.enum';

/**
 * This is the main page where all WEB API content rendered
 */
@Component({
	selector: 'webapihelp-main-home-page',
	templateUrl: './webapihelp-main-home-page.component.html',
	styleUrls: ['./webapihelp-main-home-page.component.scss'],
})
export class WebApiHelpMainHomePageComponent implements OnDestroy {

	/**
	 * Searched input value
	 */
	public searchedContent = '';

	/**
	 * Enum classes for adding dynamically into html
	 */
	private cssStyle = cssClass;

	/**
	 * class for width of the body section
	 */
	public swaggerContentWidth = this.cssStyle.contentRight;

	/**
	 * This is for realod purpose
	 */
	public reloadFlag = false;

	/**
	 * Change css class by using event
	 * @param cssStyle {string}  classname which is create in scss file
	 */
	public changeClass(cssStyle: string): void {

		cssStyle === cssClass.toggleIn ? this.swaggerContentWidth = this.cssStyle.contentLeft : this.swaggerContentWidth = this.cssStyle.contentRight;

	}

	/**
	 * shared the search value with content component
	 * @param {string} searchData  coming from left menu bar and header
	 */
	public receivedSearchContent(searchData: string): void {
		this.searchedContent = searchData;
	}

	/**
	 * for reload the page
	 * @param {boolean} flag for reload
	 */
	public reloadFlagEvent(flag: boolean): void {
		this.reloadFlag = flag;
	}

	public ngOnDestroy(): void {
		this.reloadFlag = false;
	}
}
