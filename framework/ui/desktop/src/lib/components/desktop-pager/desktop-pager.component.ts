/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */
import { Component, HostListener, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IDefaultPage } from '../../models/interfaces/default-page.interface';
import { IDesktopPager } from '../../models/interfaces/desktop-pager.interface';
import { DesktopLayoutSettingsService } from '../../services/desktop-layout-settings.service';

@Component({
	selector: 'ui-desktop-pager',
	templateUrl: './desktop-pager.component.html',
	styleUrls: ['./desktop-pager.component.scss'],
})
/**
 * Component for Pager of the Dashboard
 */
export class UiDesktopPagerComponent implements OnInit {
	/**
	 * Variable for pager which contains total pages and current pages
	 */
	pager: IDesktopPager = { totalPages: 0, currentPage: 0 };

	/**
	 * Variable for the data of page
	 */
	@Input() pageInformation!: IDefaultPage[];

	constructor(private router: Router, private desktopLayoutSettingsService: DesktopLayoutSettingsService) { }

	ngOnInit(): void {
		if (this.pageInformation) {
			this.pager.totalPages = this.pageInformation.length;
		}
	}

	/**
	 * To move the page after listening the keyboard
	 * @param {Event} event to listen event
	 */

	@HostListener('window:keydown', ['$event'])
	onArrowKeys(event: any): void {
		if (event.keyCode === 37 || event.keyCode === 39) {
			const nextPageIndex = event.keyCode === 37 ? this.getPrevPage(this.pager.currentPage - 1) : this.getNextPage(this.pager.currentPage + 1);
			this.setPage(nextPageIndex);
		}
	}

	/**
	 * To navigate the page according to its pageIndex
	 * @param {number} pageIndex
	 */
	setPage(pageIndex: number): void {
		const url = this.desktopLayoutSettingsService.getNexPageForPager(pageIndex, this.pageInformation);
		this.router.navigate(['app/' + url]);
	}

	/**
	 * To navigate the page to its next page-group
	 * @param currentPage take the index of its currentPage
	 * @returns {number}
	 */
	getNextPage(currentPage: number): number {
		if (currentPage > this.pageInformation.length - 1) {
			return (this.pager.currentPage = 0);
		} else {
			return (this.pager.currentPage += 1);
		}
	}

	/**
	 *To navigate the page to its previous page-group
	 * @param currentPage take the index of its currentPage
	 * @returns {number}
	 */
	getPrevPage(currentPage: number): number {
		if (currentPage < 0) {
			return (this.pager.currentPage = this.pageInformation.length - 1);
		} else {
			return (this.pager.currentPage -= 1);
		}
	}
}
