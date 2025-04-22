/*
 * Copyright(c) RIB Software GmbH
 */
import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PlatformConfigurationService } from '@libs/platform/common';

/**
 * Service to handle fetching grid data for source window components.
 */

@Injectable({
	providedIn: 'root',
})
export class UiBusinessBaseSourceWindowGridDataService {
	private http = inject(HttpClient);
	private configService = inject(PlatformConfigurationService);

	/**
	 * Fetch grid data from the provided API URL.
	 * @param apiUrl The URL of the API to fetch data from.
	 * @param requestData The request body to be sent.
	 * @returns Observable containing an array of type T.
	 */
	public fetchGridData<T>(apiUrl: string, requestData: object): Observable<T[]> {
		return this.http.post<T[]>(this.configService.webApiBaseUrl + apiUrl, requestData);
	}
}
