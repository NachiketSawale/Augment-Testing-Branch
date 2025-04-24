/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';

import { Subscription } from 'rxjs';

import { IModules } from '../../model/interface/modules.interface';
import { ISubmodules } from '../../model/interface/sub-modules.interface';
import { IEntityTags } from '../../model/interface/entity-tags.interface';
import { IInitializeLeftMenu } from '../../model/interface/initialize-left-menu.interface';

import { WebApiHelpMainService } from '../../services/webapihelp-main.service';

import { cssClass } from '../../model/enum/web-api-help-style-class.enum';
import { SearchChar } from '../../model/enum/search.enum';

/**
 * This component is for left menu bar.
 */
@Component({
	selector: 'webapihelp-main-leftmenu',
	templateUrl: './webapihelp-main-leftmenu.component.html',
	styleUrls: ['./webapihelp-main-leftmenu.component.scss'],
})
export class WebApiHelpMainLeftMenuComponent implements OnInit, OnDestroy {
	/**
	 * This is for left menubar open and close css class.
	 */
	@Output() public newCssStyle: EventEmitter<string> = new EventEmitter<string>();

	/**
	 * This is for selected item.
	 */
	@Output() public searchValue: EventEmitter<string> = new EventEmitter<string>();

	/**
	 * This is Enum object for concate the url string.
	 */
	private searchChar = SearchChar;

	/**
	 * This is Enum for provide the class list.
	 */
	private cssStyle = cssClass;

	/**
	 * Injection for WebApiHelp Service
	 */
	private webApiHelpService = inject(WebApiHelpMainService);

	/**
	 * Subscription for left menubar data
	 */
	private leftMenubarDataSubscription$!: Subscription;

	/**
	 * Subscription for download button flag.
	 */
	private downloadButtonSubscription$!: Subscription;

	/**
	 * Left menu style class
	 */
	public leftMenuStyle = this.cssStyle.toggleOut;

	/**
	 * Left menu bar Data.
	 */
	public leftMenubarData!: IModules[];

	/**
	 *  Left menu bar Data.
	 */
	public leftMenubarItems!: IModules[];

	/**
	 * flag for open and close the chiled node.
	 */
	public activeFlag = false;

	/**
	 * flag for open and close the sub chiled node.
	 */
	public accordianRotateFlag = false;

	/**
	 * This flag is used for add style display block.
	 */
	public parentMenuToggle = false;

	/**
	 * This flag is used for add style display block.
	 */
	public childMenuToggle = false;

	/**
	 * for save the parent node index number.
	 */
	public parentMenuIndexToggle!: number;

	/**
	 * for save the child node index number.
	 */
	public childMenuIndexToggle!: number;

	/**
	 * Router Injection
	 */
	private router = inject(Router);

	/**
	 * download button flag.
	 */
	public downloadBtnFlag!: boolean;

	public ngOnInit(): void {
		this.leftMenubarGetData();
		this.checkDownloadEnabled();
	}

	/**
	 * For open and close the left menu bar.
	 */
	public leftMenubarToggle(): void {
		this.leftMenuStyle === this.cssStyle.toggleIn ? (this.leftMenuStyle = this.cssStyle.toggleOut) : (this.leftMenuStyle = this.cssStyle.toggleIn);
		this.newCssStyle.emit(this.leftMenuStyle);
	}

	/**
	 * Subscribe the left menu bar data
	 */
	public leftMenubarGetData(): void {
		this.leftMenubarDataSubscription$ = this.webApiHelpService.getLeftMenubarData().subscribe(
			(res: IInitializeLeftMenu) => {
				const data = JSON.stringify(res);
				this.leftMenubarData = JSON.parse(data).modules;
				this.leftMenubarItems = JSON.parse(data).modules;
				this.webApiHelpService.leftmenubarData$.next(JSON.parse(data).apiRoutes);
			},
			(error) => {
				throw new Error(error);
			},
		);
	}

	/**
	 * For open and close the child node
	 * @param { ISubmodules[] } subModules  Array of sub menu data
	 * @param { number } index Indexing number
	 */
	public openChildNode(subModules: ISubmodules[], index: number): void {
		this.parentMenuIndexToggle = index;
		if (subModules.length !== 0) {
			this.parentMenuToggle = !this.parentMenuToggle;
			this.accordianRotateFlag ? (this.accordianRotateFlag = false) : null;
			this.childMenuToggle ? (this.childMenuToggle = false) : null;
		}
		this.activeFlag = !this.activeFlag;
	}

	/**
	 * load the swagger when seletd the left menu bar item
	 * @param { string } menuName Name of the parent item
	 * @param { string } subModuleName Name of the child item
	 * @param { string } entityTagName Name of the sub child item
	 */
	public swaggerLoadFromApi(menuName: string, subModuleName: string, entityTagName: string): void {
		let searchKey: string;
		if (entityTagName !== this.searchChar.EmptySpace) {
			const newEntityTagName = entityTagName.replace(/ /g, this.searchChar.Twenty);
			searchKey = this.searchChar.FiveB + menuName + this.searchChar.FullStop + subModuleName + this.searchChar.FullStop + newEntityTagName + this.searchChar.FiveD;
		} else {
			searchKey = this.searchChar.FiveB + menuName + this.searchChar.FullStop + subModuleName + this.searchChar.FiveD;
		}
		this.searchValue.emit(searchKey);
		this.webApiHelpService.setSearchInput(searchKey);
	}

	/**
	 * For open the Child node
	 * @param { IEntityTags[] } entityTags Array of sub child data.
	 * @param { number } index The index number.
	 * @param { string } menuName  The Name of the parent item.
	 * @param { String } subModuleName The name of the child item.
	 */
	public openSubChildNode(entityTags: IEntityTags[], index: number, menuName: string, subModuleName: string): void {
		entityTags.length !== 0 ? (this.accordianRotateFlag = !this.accordianRotateFlag) : (this.accordianRotateFlag = false);
		this.childMenuIndexToggle = index;
		entityTags.length !== 0 ? (this.childMenuToggle = !this.childMenuToggle) : null;
		this.swaggerLoadFromApi(menuName, subModuleName, '');
	}

	/**
	 * To filter the Left menu bar
	 * @param { string } inputValue Searched value.
	 */
	public filterSidebar(inputValue: string): void {
		this.leftMenubarItems = Object.assign([], this.leftMenubarData).filter((cl: IModules, i: number) => {
			if (cl.name.toLowerCase().includes(inputValue.toLowerCase())) {
				this.removeElementStyleClass(cl, i);
				return cl.name.toLowerCase().includes(inputValue.toLowerCase());
			} else if (cl.subModules.some((c: ISubmodules) => c.name.toLowerCase().includes(inputValue.toLowerCase()))) {
				return cl.subModules.some((c: ISubmodules, j: number) => {
					document.getElementById('active_' + i)?.classList.add('active-menu');
					document.getElementById('subModule_' + j)?.classList.remove('close-sub-menu');
					document.getElementById('subModule_' + j)?.classList.add('open-sub-menu');
					return c.name.toLowerCase().includes(inputValue.toLowerCase());
				});
			} else if (cl.subModules.some((c: ISubmodules) => c.entityTags.some((e) => e.name.toLowerCase().includes(inputValue.toLowerCase())))) {
				return cl.subModules.some((c: ISubmodules, j: number) => {
					return c.entityTags.some((e: IEntityTags, k: number) => {
						document.getElementById('active_' + i)?.classList.add('active-menu');
						document.getElementById('subModule_' + j)?.classList.remove('close-sub-menu');
						document.getElementById('subModule_' + j)?.classList.add('open-sub-menu');
						document.getElementById('childActive_' + j)?.classList.add('active-menu');
						document.getElementById('entityTag_' + k)?.classList.remove('close-sub-menu');
						document.getElementById('entityTag_' + k)?.classList.add('open-sub-menu');
						return e.name.toLowerCase().includes(inputValue.toLowerCase());
					});
				});
			} else {
				this.removeElementStyleClass(cl, i);
				return;
			}
		});
	}

	/**
	 * Add and Remove classes from
	 * @param { IModules } cl this is Mobule object
	 * @param { number }i  Index number
	 */
	public removeElementStyleClass(cl: IModules, i: number): void {
		cl.subModules.forEach((c: ISubmodules, j: number) => {
			c.entityTags.forEach((element, k) => {
				document.getElementById('active_' + i)?.classList.remove('active-menu');
				document.getElementById('subModule_' + j)?.classList.remove('open-sub-menu');
				document.getElementById('subModule_' + j)?.classList.add('close-sub-menu');
				document.getElementById('childActive_' + j)?.classList.remove('active-menu');
				document.getElementById('entityTag_' + k)?.classList.add('close-sub-menu');
				document.getElementById('entityTag_' + k)?.classList.remove('open-sub-menu');
			});
		});
	}

	/**
	 * for download button flage for enable/disable
	 */
	public checkDownloadEnabled() {
		this.downloadButtonSubscription$ = this.webApiHelpService.getDownloadEnabledFlag().subscribe(
			(res) => {
				this.downloadBtnFlag = res;
			},
			(error) => {
				throw new Error(error);
			},
		);
	}

	/**
	 * For navigat to the download page
	 */
	public navigateToDownloadPage() {
		this.router.navigate(['/webapihelp/webapi-help', { outlets: { clientArea: 'download' } }]);
	}

	public ngOnDestroy(): void {
		this.leftMenubarDataSubscription$.unsubscribe();
		this.downloadButtonSubscription$.unsubscribe();
	}
}
