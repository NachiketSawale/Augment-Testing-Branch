/*
 * Copyright(c) RIB Software GmbH
 */

import { inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { FieldType, ICustomDialogOptions, IGridConfiguration, UiCommonDialogService } from '@libs/ui/common';
import { PlatformConfigurationService } from '@libs/platform/common';
import { IBasicsEfbsheetsEntity } from '@libs/basics/interfaces';
import { BasicsEfbSheetsCopyMasterCrewMixesComponent } from '../components/basics-efb-sheets-copy-master-crew-mixes.component';

/**
 * BasicsEfbsheetsCopyMasterCrewMixService - Service for the copy master crew mix dialog
 */
export class BasicsEfbsheetsCopyMasterCrewMixService {

    /**
     * Dialog service for showing dialogs
     */
    private readonly dialogService = inject(UiCommonDialogService);

    /**
     * Configuration service for getting the web api base url
     */
    private readonly configurationService = inject(PlatformConfigurationService);

    /**
     * Http client service for making http requests
     */
    protected http = inject(HttpClient);

    /**
     * Lookup data for the master crew mix items
     */
    private lookupData: {
        estCrewMixItems: IBasicsEfbsheetsEntity[] | null;
        searchMasterCrewMixItemsPromise: Observable<IBasicsEfbsheetsEntity[]> | null;
    } = {
            estCrewMixItems: null,
            searchMasterCrewMixItemsPromise: null
        };

    /**
     * getStandardConfigForListView - Get the standard configuration for the list view
     * @returns IGridConfiguration<IBasicsEfbsheetsEntity>
     */
    public getStandardConfigForListView(): IGridConfiguration<IBasicsEfbsheetsEntity> {
        return {
            columns: [
                {
                    id: 'code',
                    model: 'Code',
                    type: FieldType.Code,
                    label: { text: 'Code', key: 'cloud.common.entityCode' },
                    sortable: true,
                    visible: true,
                    readonly: true,
                    width: 200
                },
                {
                    id: 'desc',
                    model: 'DescriptionInfo',
                    type: FieldType.Translation,
                    label: { text: 'Description', key: 'cloud.common.entityDescription' },
                    sortable: true,
                    visible: true,
                    readonly: true,
                    width: 300
                },
            ]
        };
    }

    /**
     * showMasterCrewMixDialog - Show the master crew mix dialog
     * @returns Observable<IBasicsEfbsheetsEntity[]>
     */
    public async showMasterCrewMixDialog() {
        const modalOptions: ICustomDialogOptions<void, BasicsEfbSheetsCopyMasterCrewMixesComponent> = {
            width: '70%',
            headerText: 'basics.efbsheets.masterCrewMixes',
            resizeable: true,
            id: 'b0b2f9bab961417d8ae14cfd260d624e',
            showCloseButton: true,
            bodyComponent: BasicsEfbSheetsCopyMasterCrewMixesComponent, // Use the component here
            bodyProviders: [
                { provide: BasicsEfbsheetsCopyMasterCrewMixService, useClass: BasicsEfbsheetsCopyMasterCrewMixService },
            ],
        };
        return this.dialogService.show(modalOptions);
    }

    /**
     * getSearchList - Get the search list of master crew mix items
     * @param filterValue 
     * @returns Observable<IBasicsEfbsheetsEntity[]>
     */
    public getSearchList(filterValue?: string): Observable<IBasicsEfbsheetsEntity[]> {
        const apiUrl = `${this.configurationService.webApiBaseUrl}basics/efbsheets/crewmixes/listbyfilter?filterValue=${filterValue || ''}`;

        if (!filterValue && this.lookupData.estCrewMixItems) {
            return of(this.lookupData.estCrewMixItems);
        }

        if (!this.lookupData.searchMasterCrewMixItemsPromise) {
            this.lookupData.searchMasterCrewMixItemsPromise = this.http.get<IBasicsEfbsheetsEntity[]>(apiUrl).pipe(
                tap(() => (this.lookupData.searchMasterCrewMixItemsPromise = null))
            );
        }
        return this.lookupData.searchMasterCrewMixItemsPromise;
    }

    /**
     * getListAsync - Get the list of master crew mix items asynchronously
     * @returns Observable<IBasicsEfbsheetsEntity[]>
     */
    public getListAsync(): Observable<IBasicsEfbsheetsEntity[]> {
        if (this.lookupData.estCrewMixItems) {
            return of(this.lookupData.estCrewMixItems);
        }
        return this.getEstCrewMixMasterPromise().pipe(
            tap(data => (this.lookupData.estCrewMixItems = data))
        );
    }

    /**
     * getEstCrewMixMasterPromise - Get the master crew mix items
     * @returns Observable<IBasicsEfbsheetsEntity[]>
     */
    public getEstCrewMixMasterPromise(): Observable<IBasicsEfbsheetsEntity[]> {
        return this.http.get<IBasicsEfbsheetsEntity[]>(
            `${this.configurationService.webApiBaseUrl}basics/efbsheets/crewmixes/list`
        );
    }

    /**
     * getList - Get the list of master crew mix items
     * @returns IBasicsEfbsheetsEntity[]
     */
    public getList(): IBasicsEfbsheetsEntity[] {
        return this.lookupData.estCrewMixItems && this.lookupData.estCrewMixItems.length > 0
            ? this.lookupData.estCrewMixItems
            : [];
    }

    /**
     * getItemByKey - Get the item by key
     * @param value 
     * @returns Observable<IBasicsEfbsheetsEntity[]>
     */
    public getItemByKey(value: string): Observable<IBasicsEfbsheetsEntity[]> {
        return this.getSearchList(value);
    }

    /**
     * clear - Clear the lookup data
     */
    public clear(): void {
        this.lookupData.estCrewMixItems = [];
    }

    /**
     * setMasterCrewMixItems - Set the master crew mix items
     * @param estMasterCrewMixItems 
     */
    public setMasterCrewMixItems(estMasterCrewMixItems: IBasicsEfbsheetsEntity[]): void {
        this.lookupData.estCrewMixItems = estMasterCrewMixItems;
    }

    /**
     * selectItems - Select the items
     * @param selectedRows 
     */
    public selectItems(selectedRows: IBasicsEfbsheetsEntity[]) {
        return this.lookupData.estCrewMixItems;
    }

}
