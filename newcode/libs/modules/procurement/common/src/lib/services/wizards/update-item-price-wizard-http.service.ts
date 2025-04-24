/*
 * Copyright(c) RIB Software GmbH
 */
import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CollectionHelper, PlatformConfigurationService } from '@libs/platform/common';
import {  IProcurementCommonUpdatePriceDataComplete } from '../../model/entities/procurement-common-upate-item-price-entity.interface';
import { ProcurementUpdatePriceWizardOption } from '../../model/enums/procurement-update-item-price-option.enum';

@Injectable({
	providedIn: 'root'
})
export abstract class IProcurementCommonUpdateItemPriceWizardHttpService {
	private readonly http = inject(HttpClient);
	private readonly configService = inject(PlatformConfigurationService);

	public fillGridFromItemsData(dataItem: IProcurementCommonUpdatePriceDataComplete) {
		const currencyItems = dataItem.basicOption === ProcurementUpdatePriceWizardOption.SelectItems ? dataItem.selectedItems : dataItem.itemList;
		const selectIds = currencyItems.map(item => {
			return item.Id;
		});
		const headerParentContext = dataItem.headerParentContext;
		return this.http.post(`${this.configService.webApiBaseUrl}basics/common/historicalprice/prcitem`,
			{
				prcItemIds: selectIds,
				materialId: null,
				startDate: dataItem.updatePriceParam.priceForm.startDate,
				endDate: dataItem.updatePriceParam.priceForm.endDate,
				queryFromQuotation: dataItem.updatePriceParam.priceForm.isCheckQuote,
				queryFromContract: dataItem.updatePriceParam.priceForm.isCheckContract,
				queryFromMaterialCatalog: dataItem.updatePriceParam.priceForm.isCheckMaterialCatalog,
				queryNeutralMaterial: dataItem.updatePriceParam.priceForm.isCheckNeutralMaterial,
				matPriceListId: dataItem.updatePriceParam.priceForm.priceConditionFk,
				materialType: dataItem.updatePriceParam.priceForm.priceConditionFk && dataItem.updatePriceParam.priceForm.priceConditionFk > 0 ? -2 : dataItem.updatePriceParam.priceForm.priceConditionFk,
				projectId: headerParentContext.projectFk,
				itemDate: headerParentContext.dateOrdered,
				//itemDate: parent ? (parent.DateQuoted || parent.DateOrdered || parent.DateReceived) : null,
				businessPartnerId: headerParentContext.businessPartnerFk,
				headerCurrencyId: headerParentContext.currencyFk,
				headerProjectId: headerParentContext.projectFk,
				HeaderExchangeRate: headerParentContext.exchangeRate
			});
	}

	public checkPrcItemUom(dataItem: IProcurementCommonUpdatePriceDataComplete, module: number) {
		//todo here need get selected from gridData. need framework support get grid from step component
		const selectGridData = CollectionHelper.Flatten(dataItem.updatePriceParam.priceResultSet, (item) => {
			return item.Children || [];
		}).filter(item => item.Selected);
		const headerParentId = dataItem.parentId;
		const headerParenttPrcHeaderEntity = dataItem.headerParentPrcHeaderEntity;
		const headerParentContext = dataItem.headerParentContext;
		return this.http.post(`${this.configService.webApiBaseUrl}procurement/common/UpdateItemPrice/checkPrcItemUom`, {
			childItems: selectGridData,
			module: module,
			parentId: headerParentId,
			ExchangeRate: headerParentContext.exchangeRate,
			ParentTaxCodeFk: headerParenttPrcHeaderEntity.TaxCodeFk ? headerParenttPrcHeaderEntity.TaxCodeFk : -1,
			ParentVatGroupFk: headerParentContext.vatGroupFk
		});
	}

	public updateItem(dataItem: IProcurementCommonUpdatePriceDataComplete, module: number) {
		//todo here need get selected from gridData. need framework support get grid from step component
		const selectGridData = CollectionHelper.Flatten(dataItem.updatePriceParam.priceResultSet, (item) => {
			return item.Children || [];
		}).filter(item => item.Selected);
		const headerParentId = dataItem.parentId;
		const headerParentPrcHeaderEntity = dataItem.headerParentPrcHeaderEntity;
		const headerParentContext = dataItem.headerParentContext;
		return this.http.post(`${this.configService.webApiBaseUrl}procurement/common/UpdateItemPrice/updatePrcItemPrice`, {
			childItems: selectGridData,
			module: module,
			parentId: headerParentId,
			ExchangeRate: headerParentContext.exchangeRate,
			ParentTaxCodeFk: headerParentPrcHeaderEntity.TaxCodeFk ? headerParentPrcHeaderEntity.TaxCodeFk : -1,
			ParentVatGroupFk: headerParentContext.vatGroupFk
		});
	}
}