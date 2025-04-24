/*
 * Copyright(c) RIB Software GmbH
 */

import { IEstMainConfigComplete, IEstRoundingConfigDetailEntity, IRoundingConfigComplete } from '@libs/estimate/interfaces';
import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PlatformConfigurationService } from '@libs/platform/common';
import { lastValueFrom } from 'rxjs';
import { RoundingConfigTypeLookupDataService } from '../../../../lookups/rounding-config/rounding-config-type-lookup-date.service';
import { RoundingConfigDetailDataService } from '../rounding-config-detail/rounding-config-detail-data.service';

/**
 * Service for rounding config data.
 */
@Injectable({
	providedIn: 'root',
})
export class RoundingConfigDataService {
	private roundingConfigTypeLookupService = inject(RoundingConfigTypeLookupDataService);
	private roundingConfigDetailDataService = inject(RoundingConfigDetailDataService);

	private currentItem: IRoundingConfigComplete = {};
	private http = inject(HttpClient);
	private readonly platformConfigurationService = inject(PlatformConfigurationService);

	/**
	 * load data by rounding config type id
	 * @param typeId
	 */
	public async load(typeId?: number | null): Promise<IRoundingConfigComplete | void> {
		if (typeId) {
			this.roundingConfigTypeLookupService.setSelectedItemId(typeId);
			const roundingConfigType = await lastValueFrom(this.roundingConfigTypeLookupService.getItemByKey({ id: typeId }));
			if (roundingConfigType && roundingConfigType.Id) {
				const response = await this.getRoundingConfigComplete(typeId);
				response.EstRoundingConfigType = roundingConfigType;
				this.setFormDataFromComplete(response);
				return this.currentItem;
			}
		} else {
			const response = await this.getRoundingConfigComplete(0);
			this.setFormDataFromComplete(response);
			return this.currentItem;
		}
	}

	/**
	 * set form data from complete
	 * @param data
	 * @param formData
	 */
	public setFormDataFromComplete(data: IEstMainConfigComplete, formData ?: IRoundingConfigComplete): void {
		if(formData){
			this.currentItem = formData;
		}
		const completeData = {
			EstRoundingConfigType: data.EstRoundingConfigType,
			EstRoundingConfig: data.EstRoundingConfig,
			EstRoundingConfigDetails: data.EstRoundingConfigDetails,
		};
		this.currentItem.estRoundingConfigTypeFk = completeData.EstRoundingConfigType ? completeData.EstRoundingConfigType.Id : 0;
		this.roundingConfigTypeLookupService.setSelectedItemId(this.currentItem.estRoundingConfigTypeFk);
		this.currentItem.estRoundingConfigDesc = completeData.EstRoundingConfig && completeData.EstRoundingConfig.DescriptionInfo ? completeData.EstRoundingConfig.DescriptionInfo.Translated : null;
		this.currentItem.estRoundingConfigDetail = completeData.EstRoundingConfigDetails ? completeData.EstRoundingConfigDetails : [];

		const estRoundingConfigFk = data.EstConfig ? data.EstConfig.EstRoundingConfigFk : null;
		const estRoundingConfigTypeFk = data.EstConfig ? data.EstConfig.EstRoundingConfigTypeFk : null;

		this.currentItem.isEditRoundingConfigType = !estRoundingConfigTypeFk && !!estRoundingConfigFk;
		this.currentItem.IsUpdRoundingConfig = !!completeData.EstRoundingConfig;

		let contextId = 0;
		if (data.ContextFk) {
			contextId = data.ContextFk;
		} else if (data.EstConfigType && data.EstConfigType.MdcContextFk) {
			contextId = data.EstConfigType.MdcContextFk;
		}

		this.roundingConfigDetailDataService.setDataList(this.currentItem.estRoundingConfigDetail);
		this.roundingConfigTypeLookupService.setMdcContextId(contextId);
		this.roundingConfigTypeLookupService.setSelectedItemId(this.currentItem.estRoundingConfigTypeFk);
		this.roundingConfigTypeLookupService.getList().subscribe();

		//TODO-Walt
		//this.onItemChange.fire(this.currentItem);
	}

	/**
	 * provide update data
	 * @param data
	 */
	public provideUpdateData(data: IEstMainConfigComplete): void {
		data.IsDefaultRoundingConfig = !this.currentItem.isEditRoundingConfigType;
		data.EstRoundingConfigType = this.currentItem.EstRoundingConfigType;
		if (!data.EstRoundingConfig) {
			data.EstRoundingConfig = {
				Id: 0,
				EstimateRoundingConfigFk: 0,
				IsDefault: false,
				IsEnterprise: false,
				IsLive: false,
				LineItemContextFk: 0,
				Version: 0,
			};
		}
		if (!data.EstRoundingConfig.DescriptionInfo) {
			data.EstRoundingConfig.DescriptionInfo = {
				Translated: '',
				Description: '',
				DescriptionTr: 0,
				DescriptionModified: true,
				Modified: true,
				VersionTr: 0,
				OtherLanguages: null,
			};
		}
		data.EstRoundingConfig.DescriptionInfo.Description = this.currentItem.estRoundingConfigDesc || '';
		data.EstRoundingConfig.DescriptionInfo.Translated = this.currentItem.estRoundingConfigDesc || '';
		data.EstRoundingConfig.DescriptionInfo.Modified = true;
		data.IsUpdRoundingConfig = this.currentItem.IsUpdRoundingConfig;
		data.EstRoundingConfigDetailToSave = this.roundingConfigDetailDataService.getItemsToSave();
	}

	/**
	 * get rounding config description
	 */
	public getRoundingConfigDetail(): IEstRoundingConfigDetailEntity[] | undefined {
		return this.currentItem.estRoundingConfigDetail;
	}

	/**
	 * update rounding config description
	 * @param items
	 */
	public updateRoundingConfigDetail(items: IEstRoundingConfigDetailEntity[]): void {
		this.currentItem.estRoundingConfigDetail = items;

		//TODO-walt
		//this.onItemChange.fire(this.currentItem);
	}

	/**
	 * set rounding config type
	 * @param isUpdRoundingConfig
	 */
	public setIsUpdRoundingConfig(isUpdRoundingConfig: boolean): void {
		this.currentItem.IsUpdRoundingConfig = isUpdRoundingConfig;
	}

	/**
	 * clear data
	 */
	public clear(): void {
		this.currentItem = {};
		this.roundingConfigTypeLookupService.clearMdcContextId();
	}

	private async getRoundingConfigComplete(roundingConfigFk: number) {
		return lastValueFrom(
			this.http.get<IEstMainConfigComplete>(`${this.platformConfigurationService.webApiBaseUrl}estimate/main/roundingconfigcomplete/complete`, {
				params: {
					roundingConfigFk: roundingConfigFk,
				},
			}),
		);
	}
}
