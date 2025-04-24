/*
 * Copyright(c) RIB Software GmbH
 */

import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map, of } from 'rxjs';
import { PlatformConfigurationService, Translatable } from '@libs/platform/common';
import { IExcelFileUploadResponse } from '../model/wizards/interfaces/excel-file-upload-response.interface';
import { IResourceCategory } from '../model/wizards/interfaces/resource-category.interface';
import { IFilters } from '../model/wizards/interfaces/filters.interface';

@Injectable({
    providedIn: 'root'
})

/**
 * Service responsible for handling import and export operations related to cloud translation.
 * @remarks
 * This service provides methods for loading resource categories, retrieving languages, executing imports, performing status and validation checks,
 * clearing temporary import tables, and uploading files to the backend.
 */
export class CloudTranslationImportExportService {

    private readonly configService = inject(PlatformConfigurationService);
    private readonly http = inject(HttpClient);

    /**
     * The WebApiBaseUrl      
     */
    public webApiBaseUrl: string = this.configService.webApiBaseUrl;

    /**
     * The Resource categories.     
     */
    public resourceCategories: IResourceCategory[] = [];

    /**
     * Loads resource categories from the backend.
     */
        public loadResourceCategories():Observable<boolean>{
            if (this.resourceCategories.length === 0) {
                return this.http.get<IResourceCategory[]>(`${this.webApiBaseUrl}cloud/Translation/resource/categories`)
                
                    .pipe(
                        map(result => {
                            this.resourceCategories = result;
                            return true;
                        })
                    );
            } else {
                return of(false);
            }
        }

    /**
     * Retrieves languages from the backend.
     */
    public getLanguages():Observable<string[]>{
        return this.http.get<string[]>(`${this.webApiBaseUrl}cloud/Translation/import/languages`);
    }

    /**
     * Clears a temporary import table on the backend.
     * @param {Translatable} uuidImport - The UUID of the import operation.
     * @returns {Observable<object>} 
     */
    public clearTempTable(uuidImport: Translatable) : Observable<object> {
        const requestData = { uuid: uuidImport };
        return this.http.post(`${this.webApiBaseUrl}cloud/Translation/import/clear`, requestData);
    }

    /**
     * Executes an import process on the backend.
     * @param {Translatable[]} selectedCultures - Array of selected cultures.
     * @param {Translatable} userId - The ID of the user initiating the import.
     * @param {boolean} [isResetChanged] - Indicates whether changes should be reset.
     * @param {Translatable} [uuidImport] - The UUID of the import operation.
     * @returns {Observable<object>} 
     */
    public executeImport(selectedCultures: Translatable[], userId: Translatable, isResetChanged?: boolean, uuidImport?: Translatable): Observable<object> {
        const requestData = {
            cultures: selectedCultures,
            userId: userId,
            isResetChanged: isResetChanged || false,
            uuid: uuidImport
        };
        return this.http.post(`${this.webApiBaseUrl}cloud/Translation/import/executeImport`, requestData);
    }

    /**
     * Executes an import process directly on the backend.
     * @param {Translatable[]} selectedCultures - Array of selected cultures.
     * @param {Translatable} userId - The ID of the user initiating the import.
     * @param {boolean} [isResetChanged=false] - Indicates whether changes should be reset.
     * @param {Translatable} [uuidImport] - The UUID of the import operation.
     * @returns {Observable<object>} 
     */
    public executeImportDirect(selectedCultures: Translatable[], userId: Translatable, isResetChanged?: boolean, uuidImport?: Translatable): Observable<object> {
        const requestData = {
            cultures: selectedCultures,
            userId: userId,
            isResetChanged: isResetChanged || false,
            uuid: uuidImport
        };
        return this.http.post(`${this.webApiBaseUrl}cloud/Translation/import/executeImportDirect`, requestData);
    }

    /**
     * Performs status and validation checks for an import process.
     * @param {Translatable[]} selectedCultures - Array of selected cultures.
     * @param {Translatable} userId - The ID of the user initiating the import.
     * @param {boolean} [isResetChanged] - Indicates whether changes should be reset.
     * @param {Translatable} [uuidImport] - The UUID of the import operation.
     * @returns {Observable<object>} 
     */
    public statusAndValidationCheck(selectedCultures: Translatable[], userId: Translatable, isResetChanged?: boolean, uuidImport?: Translatable): Observable<object> {
        const requestData = {
            cultures: selectedCultures,
            userId: userId,
            isResetChanged: isResetChanged || false,
            uuid: uuidImport
        };
        return this.http.post(`${this.webApiBaseUrl}cloud/Translation/import/preview`, requestData);
    }

    /**
     * Uploads a file to the backend.
     * @param {File} file - The file to be uploaded.
     * @returns {Observable<IUploadResponse>} An Observable representing the result of the file upload    operation on the backend.
     */
    public uploadFile(file: File): Observable<IExcelFileUploadResponse> {
        const formData = new FormData();
        formData.append('file', file);
        return this.http.post<IExcelFileUploadResponse>(`${this.webApiBaseUrl}cloud/Translation/import/uploadFile`, formData);
    }

    /**
     *  Executes an export with the provided filter criteria.
     */
    public exportWithFilter(selectedLanguages: string[], filter: IFilters) {
        const requestData = {
            columns: selectedLanguages,
            untranslated: filter.untranslated || false,
            changed: filter.changed || false,
            resourceRemark: filter.resourceRemark === undefined ? true : filter.resourceRemark,
            path: filter.path || false,
            parameterInfo: filter.parameterInfo || false,
            translationRemark: filter.translationRemark || false,
            addCategory: filter.addCategory || false,
            categories: filter.categories
        };

        return this.http.post(`${this.webApiBaseUrl}cloud/Translation/import/executeExport`, requestData, {
            observe: 'response',
            responseType: 'text'
        }).pipe(
            map((response: HttpResponse<string>) => {
                if (response.body !== null) {
                    try {
                        const parsedBody = JSON.parse(response.body);
                        return {
                            data: parsedBody.data,
                            status: response.status
                        };
                    } catch (e) {
                        return {
                            data: response.body,
                            status: response.status
                        };
                    }
                } else {
                    return {
                        data: '',
                        status: response.status
                    };
                }
            })
        );
    }
}
