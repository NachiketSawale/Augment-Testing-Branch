/*
 * Copyright(c) RIB Software GmbH
 */

import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { PlatformConfigurationService } from '@libs/platform/common';
import { Observable} from 'rxjs';
import { ISystemInfo } from '../interfaces/system-info.interface';

@Injectable({
    providedIn: 'root'
})
export class AboutDialogDetailService { 

    private platformConfigurationService = inject(PlatformConfigurationService);

    public constructor(private http: HttpClient) { }

    /**
     * Constructs the complete API URL by combining the base web API URL from the platform configuration
     * service with the provided endpoint.
     * @param {string} endpoint
     * @returns {string} 
     */
    public getServiceApiUrl(endpoint: string): string {
        return `${this.platformConfigurationService.webApiBaseUrl}${endpoint}`;
    }

    /**
     * Retrieves dialog details data from the specified API endpoint
     * @param {string} endpoint - The specific API endpoint for fetching dialog details data.
     * @returns {Observable<ISystemInfo>} An observable that represents the asynchronous HTTP GET request                        
     */
    public getDialogDetailsData(endpoint: string): Observable<ISystemInfo> {
        const apiUrl = this.getServiceApiUrl(endpoint);
        return this.http.get<ISystemInfo>(apiUrl);
    }
}