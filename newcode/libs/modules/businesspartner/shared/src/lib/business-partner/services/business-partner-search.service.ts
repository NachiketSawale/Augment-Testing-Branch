/*
 * Copyright(c) RIB Software GmbH
 */

import { BehaviorSubject, firstValueFrom, map, Observable } from 'rxjs';
import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PlatformConfigurationService } from '@libs/platform/common';
import { BusinessPartnerRequest, CertificateInfo, LocationDistanceParameters } from '../model/business-partner-request';
import { BusinessPartnerSetting } from '../model/business-partner-setting';
import { BusinessPartnerResponse } from '../model/business-partner-response';


/**
 * Business Partner search Service
 */
@Injectable({
	providedIn: 'root'
})

export class BusinessPartnerSearchService {

	public searchDataSubject = new BehaviorSubject<BusinessPartnerResponse>(new BusinessPartnerResponse());
	public searchData$ = this.searchDataSubject.asObservable();

	protected readonly http = inject(HttpClient);
	protected readonly configService = inject(PlatformConfigurationService);
	//todo  #DEV-18187 The current query logic should not be in procurement, and it needs to be migrated to bp module in the later stage
	protected readonly queryPath = this.configService.webApiBaseUrl + 'businesspartner/main/lookup/';


	/**
	 * get SearchList
	 */
	public getSearchList(search: BusinessPartnerSetting): Observable<BusinessPartnerResponse> {
		const request = this.createSearchRequest(search);
		return this.http.post(this.queryPath + 'bp/searchslice', request).pipe(
			map(res => res as BusinessPartnerResponse)
		);
	}

	public sendSearchData(data: BusinessPartnerResponse) {
		this.searchDataSubject.next(data);
	}

	//todo When the dialogUserSettingService function is invoked
	public async checkBidderSearchPreAllocation() {
		return await this.getSystemOption('isbiddersearchpreallocation');
	}

	public async checkApprovedBP() {
		return await this.getSystemOption('isapprovedbp');
	}

	public async checkSetDefaultContactInPBLookup() {
		return await this.getSystemOption('issetdefaultcontactinbplookup');
	}

	private createSearchRequest(setting: BusinessPartnerSetting): BusinessPartnerRequest {
		const request = new BusinessPartnerRequest();
		request.isLocation = setting.Location.IsActive ?? false;
		request.isCharacteristic = setting.Characteristic.IsActive ?? false;
		request.isEvaluation = setting.Evaluation.IsActive ?? false;
		request.isRegional = setting.Location?.IsRegionalActive ?? false;
		request.isDistance = !request.isRegional;
		request.isPrcStructure = setting.PrcStructure.IsActive ?? false;
		request.isApprovedBP = setting.Status.isApprovedBP ?? false;
		request.isBusinesspartnerstatus = setting.Status.IsActive ?? false;
		request.isBusinesspartnerstatus2 = setting.Status2.IsActive ?? false;
		request.isContractGrandTotal = setting.GrandTotal.IsActive ?? false;
		request.isFilterByStructure = setting.GrandTotal.isFilterByStructure ?? false;
		request.isContractedDateOrdered = setting.DateOrdered.IsActive ?? false;

		request.distanceId = request.regionalCountryId = setting.Location?.SelectedItemFk ?? null;
		request.regionalAddressElement = setting.Location?.AddressElement ?? null;

		request.evaluationId = setting.Evaluation.SelectedItemFk ?? null;
		request.evaluationPoint = setting.Evaluation.Point ?? null;

		request.basCharacteristicId = setting.Characteristic?.SelectedItemFk ?? null;
		request.characteristicOperation = setting.Characteristic.SelectedOp ?? null;
		request.characteristicValue2Compare = null; //todo This functionality is related to the framework functionality
		request.structureFk = setting.PrcStructure?.SelectedItemFk ?? null;
		request.businesspartnerstatusFks = setting.Status.SelectedItemsFk ?? [];
		request.businesspartnerstatus2Fks = setting.Status2.SelectedItemsFk ?? [];
		request.pageNumber = 0; //;
		request.pageSize = 200; //;
		request.grandTotalValue = setting.GrandTotal.Total ?? null;
		request.startDate = setting.DateOrdered.StartDate ?? null;
		request.endDate = setting.DateOrdered.EndDate ?? null;


		request.isBidderName = setting.SearchText != null && setting.SearchText != '' && setting.SearchText != undefined;
		request.bidderColumn = request.isBidderName ? [1] : [];//todo Since the platform-search-control component isn't complete yet
		request.bidderMode = request.isBidderName ? 1 : null;//todo  we'll have to use hard code for now
		request.bidderName = setting.SearchText;

		request.distanceParameters = setting.DistanceParameters || new LocationDistanceParameters();
		request.filterValue = '';// todo Since the platform-search-control component isn't complete yet
		request.grandTotalOperation = setting.GrandTotal.SelectedOp ?? null;
		request.headerId = setting.HeaderId;
		request.isCommonBidder = setting.isEnhanceBidder;
		request.certificateInfo = setting.Certificate || new CertificateInfo();

		return request;
	}

	private async getSystemOption(systemOptionName: string) {
		return await firstValueFrom(this.http.get(`${this.configService.webApiBaseUrl}basics/common/systemoption/${systemOptionName}`)) as boolean;
	}


}
