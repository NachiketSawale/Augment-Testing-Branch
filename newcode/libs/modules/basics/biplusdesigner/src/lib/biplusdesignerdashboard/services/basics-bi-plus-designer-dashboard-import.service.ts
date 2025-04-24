/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { PlatformConfigurationService } from '@libs/platform/common';
import { IDashboardImport } from '../model/basics-bi-plus-designer-dashboard-import.interface';

@Injectable({
	providedIn: 'root',
})

/**
 *Dashboard Import Service
 */
export class BasicBiPlusDesignerDashboardImportService {
	/**
	 * inject HttpClient
	 */

	private http = inject(HttpClient);
	/**
	 * Inject PlatformConfigurationService
	 */
	private configService = inject(PlatformConfigurationService);

	/**
	 * get Dashboard import Details
	 *
	 * @param {string} dashboardUrl url string
	 * @returns {Observable<IDashboardImport[]>}
	 */
	public getDashboardImport(dashboardUrl: string): Observable<IDashboardImport[]> {
		const data = {
			url: dashboardUrl,
		};
		return this.http.post<IDashboardImport[]>(this.configService.webApiBaseUrl + 'basics/biplusdesigner/dashboard/import', data);
	}
}
