/*
 * Copyright(c) RIB Software GmbH
 */

import { IPrcSuggestedBidderEntity } from '@libs/procurement/interfaces';
import {
	CountryEntity,
	createLookup,
	FieldType,
	ILayoutConfiguration,
	UiCommonCountryLookupService
} from '@libs/ui/common';
import { PrcSharedPrcConfigLookupService } from '@libs/procurement/shared';
import { inject, Injectable, Injector, ProviderToken } from '@angular/core';
import { CompleteIdentification, IEntityIdentification, prefixAllTranslationKeys } from '@libs/platform/common';
import { ProcurementCommonSuggestBiddersDataService } from './procurement-common-suggest-bidders-data.service';
import {
	BusinessPartnerLookupService,
	BusinesspartnerSharedContactLookupService,
	BusinesspartnerSharedSubsidiaryLookupService,
} from '@libs/businesspartner/shared';
import { IBusinessPartnerSearchMainEntity, ISubsidiaryLookupEntity } from '@libs/businesspartner/interfaces';

/**
 * Common procurement suggest bidder layout service
 */
@Injectable({
	providedIn: 'root'
})
export class ProcurementCommonSuggestBiddersLayoutService {
	private readonly injector = inject(Injector);
	private readonly prcConfigLookup = inject(PrcSharedPrcConfigLookupService);

	public async generateLayout<T extends IPrcSuggestedBidderEntity, PT extends IEntityIdentification, PU extends CompleteIdentification<PT>>(config: {
		dataServiceToken: ProviderToken<ProcurementCommonSuggestBiddersDataService<T, PT, PU>>,
	}): Promise<ILayoutConfiguration<T>> {
		//const dataService = this.injector.get(config.dataServiceToken);
		//const headerService = dataService.parentService;
		return <ILayoutConfiguration<T>>{
			groups: [
				{
					gid: 'baseGroup',
					attributes: ['BusinessPartnerFk', 'SubsidiaryFk', 'BpName1', 'BpName2', 'Street', 'City', 'Zipcode', 'Email', 'CountryFk', 'Telephone', 'UserDefined1',
						'UserDefined2', 'UserDefined3', 'UserDefined4', 'UserDefined5', 'CommentText', 'Remark', 'SupplierFk', 'ContactFk']
				}
			],
			labels: {
				...prefixAllTranslationKeys('cloud.common.', {
					BusinessPartnerFk: { text: 'Status', key: 'entityStatus' },
					ContactFk: { text: 'Contact First Name', key: 'contactFirstName' },
					SubsidiaryFk: { text: 'Subsidiary', key: 'entitySubsidiary' },
					BpName1: { text: 'Business Partner Name1', key: 'entityBusinessPartnerName1' },
					BpName2: { text: 'Business Partner Name2', key: 'entityBusinessPartnerName2' },
					Street: { text: 'entityStreet', key: 'Street' },
					City: { text: 'entityCity', key: 'City' },
					Zipcode: { text: 'entityZipCode', key: 'Zip Code' },
					Email: { text: 'E-Mail', key: 'email' },
					CountryFk: { text: 'Country', key: 'entityCountry' },
					Telephone: { text: 'Phone Number', key: 'TelephoneDialogPhoneNumber' },
					UserDefined1: { text: 'UserDefined1', key: 'entityUserDefined1' },
					UserDefined2: { text: 'UserDefined2', key: 'entityUserDefined2' },
					UserDefined3: { text: 'UserDefined3', key: 'entityUserDefined3' },
					UserDefined4: { text: 'UserDefined4', key: 'entityUserDefined4' },
					UserDefined5: { text: 'UserDefined5', key: 'entityUserDefined5' },
					CommentText: { text: 'Comment', key: 'entityCommentText' },
					Remark: { text: 'Remarks', key: 'entityRemark' },
				})
			},
			overloads: {
				BusinessPartnerFk: {
					type: FieldType.Lookup,
					lookupOptions: createLookup<IPrcSuggestedBidderEntity, IBusinessPartnerSearchMainEntity>({
						dataServiceToken: BusinessPartnerLookupService
					})
				},
				ContactFk:{
					type: FieldType.Lookup,
					lookupOptions: createLookup({
						dataServiceToken: BusinesspartnerSharedContactLookupService
					})
				},
				SubsidiaryFk: {
					type: FieldType.Lookup,
					lookupOptions: createLookup<IPrcSuggestedBidderEntity, ISubsidiaryLookupEntity>({ dataServiceToken: BusinesspartnerSharedSubsidiaryLookupService})
				},
				CountryFk: {
					type: FieldType.Lookup,
					lookupOptions: createLookup<IPrcSuggestedBidderEntity, CountryEntity>({
						dataServiceToken: UiCommonCountryLookupService,
						displayMember: 'Description',
					})
				},
			}
		};
	}
}