/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */
import { Injectable, inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, Subject, of } from 'rxjs';

import { IDownloadInitialize } from '../model/interface/download-initialize.interface';
import { IDownload } from '../model/interface/download.interface';
import { ICheck } from '../model/interface/check.interface';
import { IInitializeLeftMenu } from '../model/interface/initialize-left-menu.interface';
import { IExportToken } from '../model/interface/export-token-data.interface';
import { ISecurityToken } from '../model/interface/security-token.interface';
import { ISwaggerData } from '../model/interface/swagger-data.interface';

import { PlatformHttpService } from '@libs/platform/common';

@Injectable({
	providedIn: 'root',
})

/**
 * Service represent the api calls for the web API Help.
 */
export class WebApiHelpMainService {

	/**
	 * The Base url for API call.
	 */
	private url = 'cloud/help/';

	/**
	 * The SearchUrl for swagger APi doc.
	 */
	public searchUrl = 'cloud/help/getapis?searchKey=';

	/**
	 * Inject PlatformHttpService.
	 */
	private http = inject(PlatformHttpService);

	/**
	 * search data for filtering.
	 */
	private searchInputFilter = '';

	/**
	 * Page number for filtering.
	 */
	private pageNumberFilter = '1';

	/**
	 *  Behavior Subject to store search data.
	 */
	public searchData$ = new BehaviorSubject('');

	/**
	 * Provide updated search data.
	 */
	private searchD$ = this.searchData$.asObservable();

	/**
	 * Behavior Subject to store page number.
	 */
	public pageNumber$ = new BehaviorSubject('1');

	/**
	 * Provide updated page number.
	 */
	public pageNum$ = this.pageNumber$.asObservable();

	/**
	 * Behavior Subject to store reload button flag value.
	 */

	public reloadButtonFlag$ = new BehaviorSubject(false);

	/**
	 * Provide updated flag value.
	 */
	public reloadButton$ = this.reloadButtonFlag$.asObservable();

	/**
	 * Subject for leftmwnubar data.
	 */
	public leftmenubarData$ = new Subject<string[]>();

	/**
	 * get the reload flag data.
	 * @returns {boolen} flag for reload
	 */
	public getReloadFlagValue(): Observable<boolean> {
		return this.reloadButton$;
	}

	/**
	 * get the serach data.
	 * @returns {string} search data.
	 */
	public getSearch(): Observable<string> {
		return this.searchD$;
	}

	/**
	 * set the updates serch data value to the searchData behavior subject.
	 * @param { string } latestValue  The latest updated value.
	 * @returns { void } send data to the searchData behavior subject.
	 */
	public setSearchInput(latestValue: string): void {
		return this.searchData$.next(latestValue);
	}

	/**
	 * get the page number.
	 * @returns {string} page number.
	 */
	public getPageNumber(): Observable<string> {
		return this.pageNum$;
	}

	/**
	 * set the updated page number to the pageNumber behavior subject.
	 * @param { string } latestPageNumber The Latest Updated page number.
	 * @returns { void } send data to the pageNumber behavior subject.
	 */
	public setPageNumber(latestPageNumber: string): void {
		return this.pageNumber$.next(latestPageNumber);
	}

	/**
	 * concate the serach result and page number.
	 * @returns { string } make concate string with search result and page number.
	 */
	public get searchFilter(): string {
		this.searchInput();
		this.pageInput();
		return ('?searchKey=' + this.searchInputFilter + '&page=' + this.pageNumberFilter) as string;
	}

	/**
	 * To get updated serch result.
	 */
	public searchInput(): void {
		this.getSearch().subscribe((res: string) => {
			this.searchInputFilter = res.replace('%5B', '[').replace('%5D', ']');
		});
	}

	/**
	 * To get updated page number.
	 */
	public pageInput(): void {
		this.getPageNumber().subscribe((res: string) => {
			this.pageNumberFilter = res;
		});
	}

	/**
	 * API call to get left menu bar data.
	 * @returns { Observable } observable for left menu bar data.
	 */
	public getLeftMenubarData(): Observable<IInitializeLeftMenu> {
		return this.http.get$<IInitializeLeftMenu>(this.url + 'init');
	}

	/**
	 * API call to get data for swagger documentation
	 * @param searchedData { string }  Search Input
	 * @param pageNumber { number }	 Selected page number
	 * @param reloadFlag { boolean } flag for reload the page
	 * @returns {observable} observable data for swagger documentation
	 */
	public getDataFromPageNumber(searchedData: string, pageNumber: number, reloadFlag: boolean): Observable<ISwaggerData> {
		return this.http.get$<ISwaggerData>(this.url + 'getapis?searchKey=' + searchedData + '&page=' + pageNumber + '&reload=' + reloadFlag);
	}

	/**
	 * API call for get autherization token
	 * @returns  {Observable} observable token value
	 */
	public getAuthorizeToken(): Observable<HttpResponse<string>> {
		return this.http.get$(this.url + 'export/authorize', { observe: 'response' as 'body', responseType: 'text' as 'json' });
	}

	/**
	 * API call for initialize download from autherize token
	 * @param { string } securityToken token which is get from autherize api
	 * @returns  {Observable} observable of security token
	 */
	public getInitialize(securityToken: string): Observable<IDownloadInitialize> {
		const data: ISecurityToken = {
			SearchFilter: this.searchFilter,
			SecurityToken: securityToken,
		};

		return this.http.post$<IDownloadInitialize>(this.url + 'export/initialize', data);
	}

	/**
	 * API call for check the token and serched value
	 * @param { string } exportToken  the token value
	 * @returns  {Observable} observable of object that gives the progress
	 */
	public getCheck(exportToken: string): Observable<ICheck> {
		const data: IExportToken = {
			exportToken: exportToken,
			SearchFilter: this.searchFilter,
		};
		return this.http.post$<ICheck>(this.url + 'export/check', data);
	}

	/**
	 * API call for download the zip file
	 * @param { string } securityToken
	 * @param { string } exportToken
	 * @returns {Observable} observable
	 */
	public getDownload(securityToken: string, exportToken: string): Observable<IDownload> {
		const formData: FormData = new FormData();
		formData.append('exportToken', exportToken);
		formData.append('securityToken', securityToken);
		return this.http.post$<IDownload>(this.url + 'export/download', formData);
	}

	/**
	 * filter the search input data
	 */
	public searchData(response: string[], query: string | null): Observable<string[]> {
		const data = of(response.filter((item) => item.toLowerCase().includes(query!.toLowerCase())));
		return data;
	}

	/**
	 * API call for get flag for download button for diseble and enable
	 * @returns {Observable} observable boolean value for download button diseble and enable
	 */
	public getDownloadEnabledFlag() {
		return this.http.get$<boolean>(this.url + 'export/checkenabledfulldownload');
	}

}
