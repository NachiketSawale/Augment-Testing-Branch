/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { DataServiceFlatNode, IDataServiceChildRoleOptions, IDataServiceEndPointOptions } from '@libs/platform/data-access';
import { ServiceRole } from '@libs/platform/data-access';
import { IDataServiceOptions } from '@libs/platform/data-access';
import { IIdentificationData,PlatformConfigurationService,PlatformTranslateService } from '@libs/platform/common';
import { BasicsEfbsheetsDataService } from './basics-efbsheets-data.service';
import { IBasicsEfbsheetsComplete } from '../model/entities/basics-efbsheets-complete.interface';
import { IBasicsEfbsheetsCrewMixCostCodeComplete } from '../model/entities/basics-efbsheets-crew-mix-cost-code-complete.interface';
import { inject, Injectable, InjectionToken } from '@angular/core';
import { PlatformHttpService } from '@libs/platform/common';
import { UiCommonMessageBoxService } from '@libs/ui/common';
import { IBasicsEfbsheetsCrewMixCostCodeEntity, IBasicsEfbsheetsEntity } from '@libs/basics/interfaces';

export const BASICS_EFBSHEETS_CREW_MIX_COST_CODE_DATA_TOKEN = new InjectionToken<BasicsEfbsheetsCrewMixCostCodeDataService>('basicsEfbsheetsCrewMixCostCodeDataToken');
@Injectable({
    providedIn: 'root',
})

export class BasicsEfbsheetsCrewMixCostCodeDataService extends DataServiceFlatNode<IBasicsEfbsheetsCrewMixCostCodeEntity, IBasicsEfbsheetsEntity, IBasicsEfbsheetsComplete, IBasicsEfbsheetsCrewMixCostCodeComplete> {
    private parentService: BasicsEfbsheetsDataService;
    private dataList : IBasicsEfbsheetsCrewMixCostCodeEntity[] = [];
    private readonly httpService = inject(PlatformHttpService);
    private readonly configService = inject(PlatformConfigurationService);
    private readonly translateService = inject(PlatformTranslateService);
    private readonly messageBoxService = inject(UiCommonMessageBoxService);

    public constructor(basicsEfbsheetsDataService: BasicsEfbsheetsDataService) {
        const options: IDataServiceOptions<IBasicsEfbsheetsCrewMixCostCodeEntity> = {
            apiUrl: 'basics/efbsheets/crewmixcostcodes',

            readInfo: <IDataServiceEndPointOptions>{
                endPoint: 'list',
                prepareParam: (ident: IIdentificationData) => {
                    return { EstCrewMixFk: ident.pKey1 };
                },
                usePost: true
            },
            createInfo: <IDataServiceEndPointOptions>{
                endPoint: 'create',
            },
            updateInfo: <IDataServiceEndPointOptions>{
                endPoint: 'update'
            },
            deleteInfo: <IDataServiceEndPointOptions>{
                endPoint: 'multidelete'
            },
            roleInfo: <IDataServiceChildRoleOptions<IBasicsEfbsheetsCrewMixCostCodeEntity, IBasicsEfbsheetsEntity, IBasicsEfbsheetsComplete>>{
                role: ServiceRole.Node,
                itemName: 'EstCrewMix2CostCode',
                parent: basicsEfbsheetsDataService
            }
        };

        super(options);
        this.parentService = basicsEfbsheetsDataService;
    }

    /**
     * @brief Provides the payload for creating a new entity.
     *
     * This method generates the payload for creating a new entity by retrieving the selected parent entity
     * and extracting its `Id` to set the `EstCrewMixFk` in the returned payload. If no parent entity is selected,
     * an empty object is returned. The method also contains a commented-out section that is intended for future
     * implementation when the `estimateMainLookupService` is ready.
     *
     * @returns An object representing the payload for creating a new entity.
     *         If a parent entity is selected, it includes `EstCrewMixFk`. Otherwise, an empty object is returned.
     */
    protected override provideCreatePayload(): object {
        const parentSelection = this.getSelectedParent();
        if (parentSelection) {
            return {
                EstCrewMixFk : parentSelection.Id
            };
        }
        return {};
    }

    /**
     * @brief Handles the successful loading of data and updates the internal list.
     *
     * This method is called when data is successfully loaded. It casts the loaded data to an array of
     * `IBasicsEfbsheetsCrewMixCostCodeEntity[]`, adds the items to the internal list using the `addItems` method,
     * and returns the updated list of `IBasicsEfbsheetsCrewMixCostCodeEntity` entities.
     * @returns The updated list of `IBasicsEfbsheetsCrewMixCostCodeEntity` entities after the items are added.
     */
    protected override onLoadSucceeded(loaded: object): IBasicsEfbsheetsCrewMixCostCodeEntity[] {
        this.addItems(loaded as IBasicsEfbsheetsCrewMixCostCodeEntity[], true);
        return this.dataList;
    }

    /**
     * @brief Indicates whether the current instance should be registered by method.
     *
     * This method always returns true, indicating that registration is permitted.
     *
     * @return `true` if registration by method is allowed; otherwise, `false`.
     */
    public override registerByMethod(): boolean {
        return true;
    }

    public override createUpdateEntity(modified: IBasicsEfbsheetsCrewMixCostCodeEntity | null): IBasicsEfbsheetsCrewMixCostCodeComplete {
        return {
            MainItemId: modified?.Id,
            EstCrewMix2CostCode: modified ?? null,
        } as unknown as IBasicsEfbsheetsCrewMixCostCodeComplete;
    }

    /**
     * @brief Adds items to the data list, ensuring unique entries and refreshing the state.
     *
     * This method updates the `dataList` property by adding items from the provided array.
     * If `fromUpdate` is true, the `dataList` is replaced entirely with the new items.
     * Otherwise, the method ensures that only unique items, determined by the `Id` property,
     * are added to the existing `dataList`. The method also handles null or undefined input
     * by clearing the `dataList`. After updating, it invokes the `refresh` method to update the UI.
     */
    private addItems(items: IBasicsEfbsheetsCrewMixCostCodeEntity[], fromUpdate: boolean) {
        if (fromUpdate) {
            this.dataList = [...items];
        }
        if (!items) {
            this.dataList = [];
            return;
        }

        this.dataList = this.dataList || [];
        items.forEach((item: IBasicsEfbsheetsCrewMixCostCodeEntity) => {
            const matchItem = this.dataList.find((existingItem) => existingItem.Id === item.Id);
            if (!matchItem) {
                this.dataList.push(item);
            }
        });
        this.refresh();
    }

    /**
     * @brief Refreshes the data by reloading it from the parent selection.
     *
     * This method checks if there is a selected parent entity. If a parent is selected,
     * it triggers a reload of the data by calling the `load` method with an object containing
     * an `id` of `0`. This method is typically used to ensure that the latest data is
     * loaded when the parent entity is available.
     *
     * @note If there is no parent selection, no action is taken.
     */
    public refresh() {
        const parentSelection = this.getSelectedParent();
        if (parentSelection) {
            this.load({ id: 0 });
        }
    }

    /**
     * @brief Updates the cost codes by sending a request to the server with the updated data.
     *
     * This method gathers the necessary data from the current selection and constructs an object
     * to be sent in an HTTP POST request. It includes information about the crew mix, selected entities,
     * and cost codes. The request is sent to the specified endpoint URL for updating the cost codes.
     *
     * If the request is successful, the updated result is returned. If an error occurs, an error message
     * is logged and the method returns `null`.
     *
     * @returns A promise that resolves to the updated `IBasicsEfbsheetsCrewMixCostCodeEntity` if successful, or `null` if there is an error.
     */
    public updateCostCodes() :  Promise<IBasicsEfbsheetsCrewMixCostCodeEntity | null> {
        const parentUpdate: IBasicsEfbsheetsComplete = {} as IBasicsEfbsheetsComplete;
        const updateData = parentUpdate;
        updateData.EstCrewMixes = this.parentService.getSelection() || null;
		updateData.EstCrewMix = this.parentService.getSelectedEntity();
        updateData.MainItemId = updateData.EstCrewMix?.Id ?? null;
        
        const selectedCostCodeEntity = this.getSelectedEntity();
        updateData.EstCrewMix2CostCode = selectedCostCodeEntity ? [selectedCostCodeEntity] : [];

        const url = `${this.configService.webApiBaseUrl}basics/efbsheets/crewmixcostcodes/update`;

        // Send HTTP POST request
        return this.httpService.post<IBasicsEfbsheetsCrewMixCostCodeEntity>(url, updateData)
            .then((result) => {
                if (result) {
                                                                                                                                                 //TODO estimateMainLookupService is not ready
                    /*$injector.get('estimateMainLookupService').clearCache();
                    $injector.get('estimateMainLookupService').getEstCostCodesTreeForAssemblies().then( function(result) {
                        // const list = CollectionHelper.Flatten(result, (e) => e.CostCodes);

                        //TODO: $injector.get('basicsLookupdataLookupDescriptorService').updateData('estcostcodeslist', list);

                        updatePromise = null;
                        const title = this.translateService.instant('basics.efbsheets.crewMixToCostCodes');
                        const msg = this.translateService.instant('basics.efbsheets.crewMixToCostCodesSuccess');
                        this.messageBoxService.showMsgBox(msg, title, 'info').then(function (response) {
                                  if (response.ok === true) {
                                this.gridRefresh();
                            }
                        });
                    });*/
                }
                return result;
            })
            .catch((error) => {
                 console.error('Error updating cost codes:', error);
                 return null;
        });
    }

    /**
     * @brief Determines if the given entity is a child of the specified parent key.
     *
     * @param parentKey The parent key object of type `IBasicsEfbsheetsEntity`.
     * @param entity The entity object of type `IBasicsEfbsheetsCrewMixCostCodeEntity`.
     *
     * @return `true` if `entity.EstCrewMixFk` matches `parentKey.Id`, indicating
     *         the entity is a child of the parent; `false` otherwise.
     */
    public override isParentFn(parentKey: IBasicsEfbsheetsEntity, entity: IBasicsEfbsheetsCrewMixCostCodeEntity): boolean {
        return entity.EstCrewMixFk === parentKey.Id;
    }
}
