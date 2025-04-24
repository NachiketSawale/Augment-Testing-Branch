/*
 * Copyright(c) RIB Software GmbH
 */

import * as _ from 'lodash';
import {Observable, map} from 'rxjs';
import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {PlatformConfigurationService} from '@libs/platform/common';
import {UiCommonDialogService} from '@libs/ui/common';
import {IMaterialSearchEntity} from '../model/interfaces/material-search-entity.interface';
import {
    IMaterialSearchValidation,
    MATERIAL_SEARCH_VALIDATIONS
} from '../model/interfaces/material-search-validation.interface';
import {
    BasicsSharedMaterialSearchValidationComponent
} from '../components/material-search-validation/material-search-validation.component';

/**
 * Handle internet material catalog
 */
@Injectable({
    providedIn: 'root'
})
export class MaterialInternetService {
    protected http = inject(HttpClient);
    protected configurationService = inject(PlatformConfigurationService);
    private dialogService = inject(UiCommonDialogService);

    /**
     * Put internet material to server database.
     * @param material
     * @returns {*}
     */
    public putInternetMaterial(materials: IMaterialSearchEntity[]) {
        return this.http.post(this.configurationService.webApiBaseUrl + 'basics/publicapi/material/1.0/putmaterialfrominternet', {
            Identifiers: materials.map((material) => {
                return {
                    InternetCatalogId: material.InternetCatalogFk,
                    MaterialId: material.Id,
                    CatalogFk: material.MdcMaterialCatalogFk,
                    MdcMatPriceverFk: material.MdcMatPriceverFk
                };
            })
        });
    }

    /**
     * Check internet material, copy from internet to local.
     * @param items
     */
    public copyInternetMaterials(items: IMaterialSearchEntity[]): Observable<IMaterialSearchEntity[]> {
        return new Observable(o => {
            const localItems = items.filter((item) => {
                return _.isNil(item.InternetCatalogFk);
            });

            const internetItems = items.filter((item) => {
                return !_.isNil(item.InternetCatalogFk);
            });

            if (internetItems.length) {
                // copy material from specified url.
                this.putInternetMaterial(internetItems).subscribe((res) => {
                    const response = res as CopyInternetMaterialsResponse;

                    if (response.Success) {
                        // copy successfully, return new material id.
                        o.next(localItems.concat(response.Materials));
                    } else {
                        this.showValidation(response.ValidationResults);
                        o.error('failed');
                    }
                });
            } else {
                o.next(items);
            }
        });
    }

    /**
     * Show errors during material import.
     */
    public showValidation(validations: IMaterialSearchValidation[]) {
        this.dialogService.show({
            bodyComponent: BasicsSharedMaterialSearchValidationComponent,
            bodyProviders: [{provide: MATERIAL_SEARCH_VALIDATIONS, useValue: validations}]
        });
    }

    /**
     * Get material documents
     * @param item
     */
    public getMaterialDocuments(item: IMaterialSearchEntity) {
        if (item.InternetCatalogFk) {
            return this.getMaterialDocumentsFromInternet(item.Id, item.InternetCatalogFk);
        }

        return this.getMaterialDocumentsById(item.Id);
    }

    private getMaterialDocumentsById(materialId: number) {
        return this.http.post(this.configurationService.webApiBaseUrl + 'basics/material/document/listbyparent', {PKey1: materialId}).pipe(map((response) => {
            return this.filterBySupport(response as MaterialDocumentsResponse);
        }));
    }

    /**
     * Get documents of material from internet catalog
     * @param materialId
     * @param catalogId
     */
    private getMaterialDocumentsFromInternet(materialId: number, catalogId: number) {
        return this.http.get(this.configurationService.webApiBaseUrl + 'basics/material/commoditysearch/1.0/internetDoc?materialId=' + materialId + '&catalogId=' + catalogId).pipe(map((response) => {
                return this.filterBySupport(response as MaterialDocumentsResponse);
            }
        ));
    }

    private filterBySupport(data: MaterialDocumentsResponse) {
        const maindatas = data.Main;
        const typedatas = data.DocumentType;

        const showTypeMap = {};
        const showMains: { DocumentTypeFk: number }[] = [];

        _.forEach(typedatas, (supporType) => {
            _.set(showTypeMap, supporType.Id, supporType);
        });

        data.DocumentType = _.values(showTypeMap);

        _.forEach(maindatas, (maindata) => {
            if (_.has(showTypeMap, maindata.DocumentTypeFk)) {
                showMains.push(maindata);
            }
        });

        data.Main = showMains;

        return data;
    }
}

interface CopyInternetMaterialsResponse {
    Success: boolean;
    Materials: IMaterialSearchEntity[];
    ValidationResults: IMaterialSearchValidation[];
}

interface MaterialDocumentsResponse {
    Main: { DocumentTypeFk: number }[];
    DocumentType: { Id: number }[];
}