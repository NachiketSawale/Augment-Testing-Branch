/*
 * Copyright(c) RIB Software GmbH
 */

import { IEstMainConfigComplete, ITotalsConfigComplete } from '@libs/estimate/interfaces';
import { lastValueFrom } from 'rxjs';
import { TotalsConfigTypeLookupDataService } from '../../../../lookups/totals-config/totals-config-type-lookup-data.service';
import { inject, Injectable } from '@angular/core';
import { PlatformConfigurationService } from '@libs/platform/common';
import { HttpClient } from '@angular/common/http';
import { TotalsConfigDetailDataService } from '../totals-config-detail/totals-config-detail-data.service';
import { CostCodeAssignmentDetailDataService } from '../cost-code-assignment-detail/cost-code-assignment-detail-data.service';
import { cloneDeep } from 'lodash';

/**
 * totals config data service
 */
@Injectable({
	providedIn: 'root',
})
export class TotalsConfigDataService {
	private currentItem: ITotalsConfigComplete = {};
	private http = inject(HttpClient);
	private readonly platformConfigurationService = inject(PlatformConfigurationService);
	private readonly totalsConfigTypeLookupDataService = inject(TotalsConfigTypeLookupDataService);
	private readonly totalsConfigDetailDataService = inject(TotalsConfigDetailDataService);
	private readonly costCodeAssignmentDetailDataService = inject(CostCodeAssignmentDetailDataService);

	/**
	 * load data
	 * @param typeId
	 */
	public async load(typeId: number): Promise<ITotalsConfigComplete | void> {
		this.totalsConfigTypeLookupDataService.setSelectedItemId(typeId);
		const item = await lastValueFrom(this.totalsConfigTypeLookupDataService.getItemByKey({ id: typeId }));
		if (item && item.Id) {
			const data = await lastValueFrom(this.http.get<IEstMainConfigComplete>(this.platformConfigurationService.webApiBaseUrl + 'estimate/main/totalsconfig/complete?strConfigFk=' + item.TotalsconfigFk));
			data.EstTotalsConfigType = item;
			this.setFormDataFromComplete(data, this.currentItem);
			return this.currentItem;
		}
	}

	/**
	 * set form data from complete data
	 * @param data
	 * @param formData
	 */
	public setFormDataFromComplete(data: IEstMainConfigComplete, formData: ITotalsConfigComplete) {
		this.currentItem = formData;
		const completeData = {
			IsUpdTotals: data.IsUpdTotals,
			EstTotalsConfigType: data.EstTotalsConfigType,
			EstTotalsConfig: data.EstTotalsConfig,
			EstTotalsConfigDetails: data.EstTotalsConfigDetails,
			EstCostcodeAssignDetails: data.EstCostcodeAssigDetails,
		};
		this.currentItem.estTolConfigTypeFk = completeData.EstTotalsConfigType ? completeData.EstTotalsConfigType.Id : 0;
		let contextId = 0;
		if (data.ContextFk) {
			contextId = data.ContextFk;
		} else if (data.EstConfigType && data.EstConfigType.MdcContextFk) {
			contextId = data.EstConfigType.MdcContextFk;
		} else if (data.EstTotalsConfigType) {
			//TODO-Walt:estimateMainCostCodeAssignmentDetailLookupDataService missing
			//estimateMainCostCodeAssignmentDetailLookupDataService.setContextId(data.EstTotalsConfigType.ContextFk);
		}

		this.totalsConfigTypeLookupDataService.setMdcContextId(contextId);
		this.totalsConfigTypeLookupDataService.setSelectedItemId(this.currentItem.estTolConfigTypeFk);
		this.currentItem.estTotalsConfigDesc = completeData.EstTotalsConfig && completeData.EstTotalsConfig.DescriptionInfo ? completeData.EstTotalsConfig.DescriptionInfo.Translated : null;
		this.currentItem.ActivateLeadingStr = completeData.EstTotalsConfig ? completeData.EstTotalsConfig.ActivateLeadingStr : false;
		this.currentItem.LeadingStr = completeData.EstTotalsConfig ? completeData.EstTotalsConfig.LeadingStr || 1 : 1;

		if (completeData.EstTotalsConfig && completeData.EstTotalsConfig.LeadingStr && [5, 6].indexOf(completeData.EstTotalsConfig.LeadingStr) > -1) {
			this.currentItem.LeadingStrPrjCostgroup = completeData.EstTotalsConfig.LeadingStr === 5 ? completeData.EstTotalsConfig.LeadingStrPrjCostgroup : '';
			this.currentItem.LeadingStrEntCostgroup = completeData.EstTotalsConfig.LeadingStr === 6 ? completeData.EstTotalsConfig.LeadingStrEntCostgroup : null;
		}

		this.currentItem.EstTotalsConfigDetails = completeData.EstTotalsConfigDetails ? completeData.EstTotalsConfigDetails : [];
		this.currentItem.costCodeAssignmentDetails = completeData.EstCostcodeAssignDetails ? completeData.EstCostcodeAssignDetails : [];

		const estTotalsConfigFk = data.EstConfig ? data.EstConfig.EstTotalsconfigFk : null;
		const estTotalsConfigTypeFk = data.EstConfig ? data.EstConfig.EstTotalsconfigtypeFk : null;

		this.currentItem.isEditTolConfigType = !estTotalsConfigTypeFk && !!estTotalsConfigFk;

		completeData.IsUpdTotals = !!completeData.EstTotalsConfig;

		this.totalsConfigDetailDataService.clear();
		this.totalsConfigDetailDataService.setDataList(this.currentItem.EstTotalsConfigDetails);

		this.costCodeAssignmentDetailDataService.clear();
		this.costCodeAssignmentDetailDataService.setDataList(this.currentItem.costCodeAssignmentDetails);
		//TODO-Walt
		// estimateMainTotalsConfigTypeService.loadData();
		//
		// service.onItemChange.fire(currentItem);
	}

	/**
	 * provide current estimate config type, config updateData
	 * @param data
	 */
	public provideUpdateData(data: IEstMainConfigComplete) {
		data.IsDefaultTotals = !this.currentItem.isEditTolConfigType;
		data.EstTotalsConfigType = this.currentItem.EstTotalsConfigType;
		if (!data.EstTotalsConfig) {
			data.EstTotalsConfig = {
				Id: 0,
				DescriptionInfo: {
					Translated: '',
					Description: '',
					DescriptionTr: 0,
					DescriptionModified: true,
					Modified: true,
					VersionTr: 0,
					OtherLanguages: null,
				},
			};
		}
		if (data.EstTotalsConfig && data.EstTotalsConfig.DescriptionInfo) {
			data.EstTotalsConfig.DescriptionInfo.Description = this.currentItem.estTotalsConfigDesc ?? '';
			data.EstTotalsConfig.DescriptionInfo.Translated = this.currentItem.estTotalsConfigDesc ?? '';
			data.EstTotalsConfig.DescriptionInfo.Modified = true;
		}

		data.IsUpdTotals = this.currentItem.IsUpdTotals;
		// update specific totals
		data.EstTotalsConfigDetailsToSave = this.totalsConfigDetailDataService.getItemsToSave();
		data.EstTotalsConfigDetailsToDelete = this.totalsConfigDetailDataService.getItemsToDelete();

		// Handle project cost code before saving
		const costCodeAssignmentsDetailsToSave = cloneDeep(this.costCodeAssignmentDetailDataService.getAllList());
		costCodeAssignmentsDetailsToSave.forEach((configDetailToSave) => {
			if (configDetailToSave.IsCustomProjectCostCode === true) {
				configDetailToSave.Project2mdcCstCdeFk = configDetailToSave.MdcCostCodeFk;
				configDetailToSave.MdcCostCodeFk = null;
			} else {
				configDetailToSave.Project2mdcCstCdeFk = null;
			}
		});
		data.EstCostcodeAssigDetailsToSave = costCodeAssignmentsDetailsToSave;
		data.EstCostcodeAssigDetailsToDelete = this.costCodeAssignmentDetailDataService.getItemsToDelete();

		data.EstTotalsConfig.ActivateLeadingStr = this.currentItem.ActivateLeadingStr;
		data.EstTotalsConfig.LeadingStr = this.currentItem.LeadingStr;

		if (this.currentItem.LeadingStr && [5, 6].indexOf(this.currentItem.LeadingStr) > -1) {
			data.EstTotalsConfig.LeadingStrPrjCostgroup = this.currentItem.LeadingStr === 5 ? this.currentItem.LeadingStrPrjCostgroup : '';
			data.EstTotalsConfig.LeadingStrEntCostgroup = this.currentItem.LeadingStr === 6 ? this.currentItem.LeadingStrEntCostgroup : null;
		}

		data.EstTotal2CostTypeDetailsToSave = this.totalsConfigDetailDataService.getTotal2CostTypeDetailsToSave(data.EstTotalsConfigDetails);
		data.EstTotal2ResourceFlagDetailsToSave = this.totalsConfigDetailDataService.getTotal2ResourceFlagDetailsToSave(data.EstTotalsConfigDetails);
	}
}
