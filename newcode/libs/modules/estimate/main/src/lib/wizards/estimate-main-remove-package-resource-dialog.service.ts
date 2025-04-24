/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import { EstimateMainService } from '../containers/line-item/estimate-main-line-item-data.service';
import { PlatformConfigurationService, ServiceLocator } from '@libs/platform/common';
import { HttpClient } from '@angular/common/http';
import { IEstPkgResourceEntity } from '../model/entities/common/estimate-main-resource-entity.interface';
import { map } from 'rxjs';
import { IPrcPackageEntity } from '../model/entities/common/estimate-main-prc-package-entity.interface';

@Injectable({ providedIn: 'root' })

/**
 * Service to manage the removal of package resources in the estimate main module.
 */
export class EstimateMainRemovePackageResourcesDialogService {

    /**
     * Injected instance of EstimateMainService.
     */
    private estimateMainService = inject(EstimateMainService);

    /**
     * Injected instance of HttpClient.
     */
    private http = ServiceLocator.injector.get(HttpClient);

    /**
     * API endpoint for fetching package resources.
     */
    private endPoint: string = 'estimate/main/resource/getlistbypackage';

    /**
     * Injected instance of PlatformConfigurationService.
     */
    private readonly configService = inject(PlatformConfigurationService);

    /**
     * List of package resources.
     */
    public dataList: IEstPkgResourceEntity[] = [];

    /**
     * Loading state indicator.
     */
    public isLoading = false;

    /**
     * Estimate scope level.
     */
    private estimateScope: number = 0;

    /**
     * Retrieves the list of package resources.
     * @returns {IEstPkgResourceEntity[]} List of package resources.
     */
    public getList(): IEstPkgResourceEntity[] {
        return this.dataList;
    }

    /**
     * Adds items to the dataList and marks them as checked.
     * @param {IEstPkgResourceEntity[]} data - List of package resources to add.
     */
    public addItems(data: IEstPkgResourceEntity[]): void {
        if (data == null) {
            this.dataList = [];
            return;
        }
        this.dataList = data ? data : [];

        this.dataList.forEach((item) => {
            item.IsChecked = true;
        });
    }

    /**
     * Retrieves the current data items.
     * @returns {IEstPkgResourceEntity[]} List of current data items.
     */
    public getDataItem(): IEstPkgResourceEntity[] {
        return this.dataList;
    }

    /**
     * Sets the data list based on the wizard state and selected packages.
     * @param {boolean} isWizardOpen - Indicates if the wizard is open.
     * @param {any[]} packagesToFilter - List of packages to filter.
     * @param {number} selectedScope - Selected scope level.
     */
    public setDataList(isWizardOpen: boolean, packagesToFilter: IPrcPackageEntity[], selectedScope: number): void {

        this.estimateScope = selectedScope;
        if (isWizardOpen) {
            const selectedLineItems = selectedScope === 1
                ? this.estimateMainService.getList()
                : this.estimateMainService.getSelection();

            const filterData: IFilterData = {
                SelectedLevel: this.getEstimateScope(),
                EstLineItemIds: selectedLineItems.map((item) => item.Id),
                EstHeaderIds: this.estimateMainService.getSelection().map((item) => item.EstHeaderFk),
                PrcPackageIds: packagesToFilter.map((item) => item.Id)
            };

            const selectedPackages = packagesToFilter && packagesToFilter.length > 0 ? packagesToFilter : []; // getPackagesToRemove
            filterData.PrcPackageIds = selectedPackages.length > 0 ? selectedPackages.map((item) => item.Id) : [];

            this.setIsLoading(true);

            this.http
                .post<IEstPkgResourceEntity[]>(
                    `${this.configService.webApiBaseUrl}${this.endPoint}`,
                    filterData
                )
                .pipe(
                    map((data: IEstPkgResourceEntity[]) => {

                        // estimateMainCommonService.translateCommentCol(item);
                        // estimateMainResourceDetailService.setResourcesBusinessPartnerName

                        this.addItems(data);
                        this.setIsLoading(false);
                        this.dataList = [];
                    })
                )
                .subscribe({
                    error: (err) => {
                        this.setIsLoading(false);
                    }
                });
        } else {
            this.dataList = [];
        }
    }

    /**
     * Retrieves the estimate scope level.
     * @returns {string} Estimate scope level.
     */
    private getEstimateScope(): string {
        if (this.estimateScope === 1 || this.estimateScope === 2) {
            return 'SelectedLineItems';
        } else {
            return 'AllItems';
        }
    }

    /**
     * Refreshes the grid by updating the data list.
     */
    public refreshGrid(): void {
        const updatedDataList = [...this.dataList];
        this.addItems(updatedDataList);
    }

    /**
     * Returns the parent service instance.
     * @returns {unknown} Parent service instance.
     */
    public parentService(): unknown {
        return this.estimateMainService;
    }

    /**
     * Retrieves the list of package resources to remove.
     * @returns {IEstPkgResourceEntity[]} List of package resources to remove.
     */
    public getPackageResourcesToRemove(): IEstPkgResourceEntity[] {
        let filteredList: IEstPkgResourceEntity[] = [];
        if (this.dataList && this.dataList.length > 0) {
            filteredList = this.dataList.filter((item) => item.IsChecked);
            return filteredList;
        }
        return filteredList;
    }

    /**
     * Sets the loading state.
     * @param {boolean} value - Loading state value.
     */
    public setIsLoading(value: boolean): void {
        this.isLoading = value;
    }

    /**
     * Retrieves the loading state.
     * @returns {boolean} Loading state.
     */
    public getIsLoading(): boolean {
        return this.isLoading;
    }

}


// Interface for filter data
export interface IFilterData {
    SelectedLevel: string;
    EstLineItemIds: number[];
    EstHeaderIds: number[];
    PrcPackageIds: number[];
}