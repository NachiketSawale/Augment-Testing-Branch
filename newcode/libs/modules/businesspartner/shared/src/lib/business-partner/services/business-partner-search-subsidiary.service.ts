/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PlatformConfigurationService } from '@libs/platform/common';
import { firstValueFrom } from 'rxjs';
import { BusinessPartnerSetting } from '../model/business-partner-setting';
import { BusinessPartnerSubsidiaryRequest } from '../model/business-partner-subsidiary-request';
import { LocationDistanceParameters } from '../model/business-partner-request';
import { IBusinessPartnerSearchSubsidiaryEntity } from '@libs/businesspartner/interfaces';


/**
 * Business Partner Subsidiary search Service
 */

@Injectable({
	providedIn: 'root'
})
export class BusinessPartnerSearchSubsidiaryService {

	private readonly http = inject(HttpClient);
	private readonly configService = inject(PlatformConfigurationService);

	/**
	 * get Search
	 */
	public async search(search: BusinessPartnerSetting, bpId: number, selectedSubsidiaryFk: number | undefined): Promise<IBusinessPartnerSearchSubsidiaryEntity[]> {
		const request = this.createSearchRequest(search, bpId);
		//todo  #DEV-18187 The current query logic should not be in procurement, and it needs to be migrated to bp module in the later stage
		const resp = await firstValueFrom(this.http.post<IBusinessPartnerSearchSubsidiaryEntity[]>(this.configService.webApiBaseUrl + 'businesspartner/main/lookup/subsidiary/search', request));

		if (selectedSubsidiaryFk) {
			const selectedSubsidiary = resp.find(item => item.Id === selectedSubsidiaryFk);
			if (selectedSubsidiary) {
				selectedSubsidiary.IsChecked = true;
			}
		} else {
			resp.forEach(item => (item.IsChecked = item.IsMainAddress));
		}
		return resp;
	}

	private createSearchRequest(setting: BusinessPartnerSetting, bpId: number): BusinessPartnerSubsidiaryRequest {
		const distanceParameters = setting.DistanceParameters || new LocationDistanceParameters();
		distanceParameters.businessPartnerFk = bpId;

		const request = new BusinessPartnerSubsidiaryRequest();
		request.isLocation = setting.Location.IsActive ?? false;
		request.isDistance = setting.Location?.IsRegionalActive ?? false;
		request.isRegional = !request.isDistance;
		request.isPrcStructure = setting.PrcStructure.IsActive ?? false;
		request.distanceId = request.regionalCountryId = setting.Location?.SelectedItemFk ?? null;
		request.regionalAddressElement = setting.Location?.AddressElement ?? null;
		request.structureFk = setting.PrcStructure?.SelectedItemFk ?? null;
		request.distanceParameters = distanceParameters;
		request.isCommonBidder = setting.isEnhanceBidder;

		return request;
	}
}