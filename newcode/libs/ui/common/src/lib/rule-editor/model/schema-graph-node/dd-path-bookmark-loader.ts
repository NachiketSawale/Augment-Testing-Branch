/*
 * Copyright(c) RIB Software GmbH
 */

import { inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { PlatformConfigurationService } from '@libs/platform/common';

/**
 * Responsible to load path bookmark
 */
export class DdPathBookmarkLoader {
	private http = inject(HttpClient);
	private configService = inject(PlatformConfigurationService);

	/**
	 * Loads bookmarks by table name
	 * @param tableName
	 */
	public loadBookmarks(tableName?: string) {
		const httpParam = this.getHttpParam('tableName', tableName??'');
		return this.loadBookmarksHttp(httpParam);
	}

	/**
	 * Load bookmarks by module name
	 * @param moduleName
	 */
	public loadBookmarksByModule(moduleName?: string) {
		const httpParam = this.getHttpParam('moduleName', moduleName??'');
		return this.loadBookmarksHttp(httpParam);
	}

	private getHttpParam(key: string, value: string) {
		return new HttpParams().set(key, value);
	}

	private loadBookmarksHttp(httpParams: HttpParams) {
		return this.http.get(this.configService.webApiBaseUrl + 'basics/common/ddpathbookmark/fortable', {
			params: httpParams
		});
	}
}