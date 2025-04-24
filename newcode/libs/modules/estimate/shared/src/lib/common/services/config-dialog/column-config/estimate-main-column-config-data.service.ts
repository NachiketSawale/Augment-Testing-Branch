/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { cloneDeep } from 'lodash';
import { ColumnConfigTypeLookupDataService } from '../../../../lookups/column-config/column-config-type-lookup-data.service';
import { lastValueFrom } from 'rxjs';
import { PlatformConfigurationService } from '@libs/platform/common';
import { IEstColumnConfigComplete, IEstColumnConfigDetailEntity, IEstimateMainColumnConfigComplete, IEstMainConfigComplete } from '@libs/estimate/interfaces';
import { EstimateMainColumnConfigDetailDataService } from '../column-config-detail/estimate-main-column-config-detail-data.service';

/**
 * estimate main column config data service
 */
@Injectable({
	providedIn: 'root',
})
export class EstimateMainEstColumnConfigDataService {
	private currentItem: IEstimateMainColumnConfigComplete = {};
	private estColumnConfigDetailsToSave: IEstColumnConfigDetailEntity[] = [];
	private http = inject(HttpClient);
	private readonly platformConfigurationService = inject(PlatformConfigurationService);
	private estimateMainColumnConfigTypeService = inject(ColumnConfigTypeLookupDataService);
	private columnConfigDetailDataService = inject(EstimateMainColumnConfigDetailDataService);

	/**
	 * load data
	 * @param typeId
	 */
	public async load(typeId: number): Promise<IEstimateMainColumnConfigComplete | void> {
		this.estimateMainColumnConfigTypeService.setSelectedItemId(typeId);
		const item = await lastValueFrom(this.estimateMainColumnConfigTypeService.getItemByKey({ id: typeId }));
		if (item && item.Id) {
			const estColumnConfigFk = item.ColumnconfigFk ? item.ColumnconfigFk : 0;

			const data = await lastValueFrom(this.http.get<IEstMainConfigComplete>(this.platformConfigurationService.webApiBaseUrl + 'estimate/main/columnconfig/complete?columnConfigFk=' + estColumnConfigFk));
			if (data.EstColumnConfigComplete) {
				data.EstColumnConfigComplete.estColumnConfigType = item;
			}
			this.setFormDataFromComplete(data, this.currentItem);
			return this.currentItem;
		}
	}

	/**
	 * set form data from complete data
	 * @param completeData
	 * @param formData
	 */
	public setFormDataFromComplete(completeData: IEstMainConfigComplete, formData: IEstimateMainColumnConfigComplete) {
		this.currentItem = formData;
		this.currentItem.estColConfigTypeFk = completeData.EstColumnConfigComplete && completeData.EstColumnConfigComplete.estColumnConfigType ? completeData.EstColumnConfigComplete.estColumnConfigType.Id : 0;
		this.currentItem.columnConfigDesc = completeData.EstColumnConfigComplete && completeData.EstColumnConfigComplete.estColumnConfig ? completeData.EstColumnConfigComplete.estColumnConfig.DescriptionInfo?.Translated ?? null : null;
		this.currentItem.columnConfigId = completeData.EstColumnConfigComplete && completeData.EstColumnConfigComplete.estColumnConfig ? completeData.EstColumnConfigComplete.estColumnConfig.Id : 0;
		this.currentItem.estColumnConfigDetails = completeData.EstColumnConfigComplete && completeData.EstColumnConfigComplete.estColumnConfigDetailsToSave ? completeData.EstColumnConfigComplete.estColumnConfigDetailsToSave : [];
		this.currentItem.estConfigColumnConfigFk = completeData.EstColumnConfigComplete && completeData.EstColumnConfigComplete.estColumnConfig ? completeData.EstColumnConfigComplete.estColumnConfig.Id : 0;
		this.currentItem.estConfigColumnConfigTypeFk = completeData.EstColumnConfigComplete && completeData.EstColumnConfigComplete.estColumnConfigType ? completeData.EstColumnConfigComplete.estColumnConfigType.Id : 0;
		const estColumnConfigFk = completeData.EstColumnConfigComplete && completeData.EstColumnConfigComplete.estConfig ? completeData.EstColumnConfigComplete.estConfig.EstColumnConfigFk : null;
		const estColumnConfigTypeFk = completeData.EstColumnConfigComplete && completeData.EstColumnConfigComplete.estConfig ? completeData.EstColumnConfigComplete.estConfig.EstColumnConfigTypeFk : null;
		this.currentItem.isEditColConfigType = !estColumnConfigTypeFk && !!estColumnConfigFk;
		this.setContext(completeData);
		if (this.currentItem.columnConfigId) {
			this.setDetailColumnConfigId(this.currentItem.columnConfigId);
		}
	}

	/**
	 * set detail column config id
	 * @param id
	 */
	public setDetailColumnConfigId(id: number): void {
		this.columnConfigDetailDataService.setColumnConfigId(id);
	}

	/**
	 * provide update data
	 * @param updateData
	 */
	public provideUpdateData(updateData: IEstMainConfigComplete): boolean {
		const saveData: IEstColumnConfigComplete = {} as IEstColumnConfigComplete;
		saveData.IsDefaultColConfig = !updateData.isEditColConfigType;
		saveData.estColumnConfig = cloneDeep(updateData.EstColumnConfigComplete!.estColumnConfig) || null;
		if (!saveData.estColumnConfig) {
			saveData.estColumnConfig = {
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
		if (saveData.estColumnConfig && saveData.estColumnConfig.DescriptionInfo) {
			saveData.estColumnConfig.DescriptionInfo.Translated = updateData.columnConfigDesc ?? '';
			saveData.estColumnConfig.DescriptionInfo.Modified = true;
		}
		saveData.estColumnConfigType = updateData.estColumnConfigType;
		saveData.IsUpdColumnConfig = updateData.IsUpdColumnConfig;

		if (!this.columnConfigDetailDataService.verifyColumnConfigListStatus()) {
			return false;
		}

		const configDetailsToSave = cloneDeep(this.columnConfigDetailDataService.getList());
		configDetailsToSave.forEach((configDetailToSave: IEstColumnConfigDetailEntity) => {
			if (configDetailToSave.IsCustomProjectCostCode) {
				configDetailToSave.Project2mdcCstCdeFk = configDetailToSave.MdcCostCodeFk;
				configDetailToSave.MdcCostCodeFk = null;
			} else {
				configDetailToSave.Project2mdcCstCdeFk = null;
			}
		});
		saveData.estColumnConfigDetailsToSave = configDetailsToSave;
		saveData.estColumnConfigDetailsToDelete = this.columnConfigDetailDataService.getItemsToDelete();
		updateData.EstColumnConfigComplete = cloneDeep(saveData);
		return true;
	}

	/**
	 * clear
	 */
	public clear(): void {
		this.currentItem = {};
		this.columnConfigDetailDataService.clear();
		this.estimateMainColumnConfigTypeService.clearMdcContextId();
		//this.estimateAllowanceAssignmentConfigTypeDataService.clearMdcContextId();
	}

	/**
	 * get column config details
	 */
	public getColumnConfigDetails() {
		return this.estColumnConfigDetailsToSave;
	}

	private setContext(completeItemData: IEstMainConfigComplete) {
		let contextId = 0;
		if (completeItemData.ContextFk) {
			contextId = completeItemData.ContextFk;
		} else if (completeItemData.EstConfigType && completeItemData.EstConfigType.MdcContextFk) {
			contextId = completeItemData.EstConfigType.MdcContextFk;
		}

		this.estimateMainColumnConfigTypeService.setMdcContextId(contextId);
		this.estimateMainColumnConfigTypeService.setSelectedItemId(this.currentItem.estColConfigTypeFk ?? null);
	}
}
