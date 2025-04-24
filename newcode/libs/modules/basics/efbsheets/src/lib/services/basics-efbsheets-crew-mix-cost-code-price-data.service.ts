/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable, InjectionToken } from '@angular/core';

import { DataServiceFlatNode, ServiceRole, IDataServiceOptions, IDataServiceChildRoleOptions, IDataServiceEndPointOptions } from '@libs/platform/data-access';
import { ICostCodeEntity } from '@libs/basics/costcodes';
import { BasicsEfbsheetsDataService } from './basics-efbsheets-data.service';
import { IBasicsEfbsheetsCrewMixCostCodePriceComplete } from '../model/entities/basics-efbsheets-crew-mix-cost-code-price-complete.interface';
import { IBasicsEfbsheetsComplete } from '../model/entities/basics-efbsheets-complete.interface';
import { PlatformConfigurationService, PlatformHttpService, PlatformTranslateService } from '@libs/platform/common';
import { IYesNoDialogOptions, StandardDialogButtonId, UiCommonMessageBoxService } from '@libs/ui/common';
import { BasicsEfbsheetsCrewMixCostCodeDataService } from './basics-efbsheets-crew-mix-cost-code-data.service';
import { IBasicsEfbsheetsCrewMixCostCodeComplete } from '../model/entities/basics-efbsheets-crew-mix-cost-code-complete.interface';
import { IBasicsEfbsheetsCrewMixCostCodeEntity } from '@libs/basics/interfaces';

export const BASICS_EFBSHEETS_CREW_MIX_COST_CODE_PRICE_DATA_TOKEN = new InjectionToken<BasicsEfbsheetsCrewMixCostCodePriceDataService>('basicsEfbsheetsCrewMixCostCodePriceDataToken');

@Injectable({
	providedIn: 'root',
})
export class BasicsEfbsheetsCrewMixCostCodePriceDataService extends DataServiceFlatNode<ICostCodeEntity, IBasicsEfbsheetsCrewMixCostCodePriceComplete, IBasicsEfbsheetsCrewMixCostCodeEntity, IBasicsEfbsheetsCrewMixCostCodeComplete> {
	private configurationService = inject(PlatformConfigurationService);

	private readonly messageBoxService = inject(UiCommonMessageBoxService);
	private readonly httpService = inject(PlatformHttpService);
	private readonly translateService = inject(PlatformTranslateService);
	private basicsEfbsheetsDataService = inject(BasicsEfbsheetsDataService);
	private basicsEfbsheetsCrewMixCostCodeDataService = inject(BasicsEfbsheetsCrewMixCostCodeDataService);
	private dataList: ICostCodeEntity[] = [];
	public constructor(basicsEfbsheetsCrewMixCostCodeDataService: BasicsEfbsheetsCrewMixCostCodeDataService) {
		const options: IDataServiceOptions<ICostCodeEntity> = {
			apiUrl: 'basics/efbsheets/crewmixcostcodes',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'getcostcodepricelist',
				prepareParam: () => {
					const selection = basicsEfbsheetsCrewMixCostCodeDataService.getSelectedEntity();
					return {
						CostCodeId: selection?.MdcCostCodeFk ?? 0,
						filter: ''
					};
				},
				usePost: true
			},
			roleInfo: <IDataServiceChildRoleOptions<ICostCodeEntity, IBasicsEfbsheetsCrewMixCostCodeEntity, IBasicsEfbsheetsCrewMixCostCodeComplete>>{
				role: ServiceRole.Node,
				itemName: 'CostcodePriceList',
				parent: basicsEfbsheetsCrewMixCostCodeDataService,
			},
		};

		super(options);
	}

	/**
 * @brief Creates an update entity from a modified cost code entity.
 
 * @param modified The cost code entity to be modified. Can be `null`.
 * 
 * @return An instance of `IBasicsEfbsheetsCrewMixCostCodePriceComplete` 
 *         populated with data from the modified entity, or an undefined entity 
 *         if the modified parameter is null.
 *
 * @note The `Id` property defaults to `0` if it is not present in the modified entity.
 */
	public override createUpdateEntity(modified: ICostCodeEntity | null): IBasicsEfbsheetsCrewMixCostCodePriceComplete {
		if (modified) {
			return {
				Id: modified.Id ?? 0,
				CostcodePriceList: modified,
			} as unknown as IBasicsEfbsheetsCrewMixCostCodePriceComplete;
		}
		return undefined as unknown as IBasicsEfbsheetsCrewMixCostCodePriceComplete;
	}

	/**
	 * @brief Updates the cost codes price list based on the selected crew mix and entity.
	 * @return A promise that resolves to the result of the HTTP post request.
	 *         If the result is truthy, it triggers the modal dialog.
	 *
	 * @note Ensure that there is a valid selection in `EstCrewMix` and `CostcodePriceList`
	 * before calling this method, as it directly accesses their properties.
	 */
	public updateCostCodesPriceList() {
		const parentUpdate: IBasicsEfbsheetsComplete = {} as IBasicsEfbsheetsComplete;
		const updateData = parentUpdate;
		updateData.EstCrewMixes = this.basicsEfbsheetsDataService.getSelection() || null;
		updateData.EstCrewMix = this.basicsEfbsheetsDataService.getSelectedEntity();	
		updateData.MainItemId = updateData.EstCrewMix?.Id ?? null;
	
		updateData.CostcodePriceList = this.getSelectedEntity();
	
		const endPointURL = 'basics/efbsheets/crewmixcostcodes/updatecostcodepricelist';
		return this.httpService.post<ICostCodeEntity>(endPointURL, updateData).then((result) => {
			if (result) {
				this.clickYesNoModalDailog();
			}
			return result;
		});
	}
	
	// function registerListLoaded(callBackFn) {     // TODO: listLoaded is from PlatformMessenger
	// 	service.listLoaded.register(callBackFn);
	// }

	// function unregisterListLoaded(callBackFn) {
	// 	service.listLoaded.unregister(callBackFn);
	// }

	/**
	 * @brief Adds new items to the dataList and updates the grid.
	 *
	 * @param items The array of `ICostCodeEntity` items to be added.
	 *              If `null` or `undefined`, `dataList` is reset to an empty array.
	 * @param fromUpdate A flag indicating if the `dataList` should be completely replaced
	 *                   with the provided `items`. If `true`, `dataList` is overwritten.
	 *
	 * @note The `dataList` is initialized as an empty array and must remain an array type.
	 */
	private addItems(items: ICostCodeEntity[], fromUpdate: boolean) {
		if (fromUpdate) {
			this.dataList = [...items];
		}
		if (!items) {
			this.dataList = [];
			return;
		}

		this.dataList = this.dataList || [];
		items.forEach((item: ICostCodeEntity) => {
			const matchItem = this.dataList.find((existingItem) => existingItem.Id === item.Id);
			if (!matchItem) {
				this.dataList.push(item);
			}
		});
		this.refresh();
	}

	/**
	 * @brief Displays a confirmation dialog and handles the user’s response.
	 * @return A `Promise` that resolves when the dialog has been shown and the user's response
	 *         has been processed. (Currently, the method does not return a value as the final
	 *         implementation for the service call is not complete.)
	 */
	public async clickYesNoModalDailog() {
		const options: IYesNoDialogOptions = {
			defaultButtonId: StandardDialogButtonId.Yes,
			id: 'YesNoModal',
			dontShowAgain: true,
			showCancelButton: false,
			headerText: this.translateService.instant('basics.efbsheets.costCodePriceList').text,
			bodyText: this.translateService.instant('basics.efbsheets.crewMixToCostCodePriceListSuccess').text,
		};
		const result = await this.messageBoxService.showYesNoDialog(options);

		if (result?.closingButtonId === StandardDialogButtonId.Ok) {
			const readData = {
				CostCodeId: this.basicsEfbsheetsCrewMixCostCodeDataService.getSelection()?.[0]?.MdcCostCodeFk || 0,
			};
			const endPointURL = 'basics/efbsheets/crewmixcostcodes/updatecostcodepricelist';
			return this.httpService.post<ICostCodeEntity[]>(endPointURL, readData).then((result) => {
				return this.setList(result);
			});
		}
	}

	/**
	 * @brief Refreshes the data by reloading it based on the selected parent.
	 *
	 * This method checks if a parent entity is selected using `getSelectedParent()`.
	 * If a parent is selected, it triggers the `load` function with a default parameter
	 * `{ id: 0 }` to reload the data.
	 *
	 * @note This method depends on `getSelectedParent()` to determine if a parent selection exists.
	 */

	public refresh() {
		const parentSelection = this.getSelectedParent();
		if (parentSelection) {
			this.load({ id: 0 });
		}
	}
}
