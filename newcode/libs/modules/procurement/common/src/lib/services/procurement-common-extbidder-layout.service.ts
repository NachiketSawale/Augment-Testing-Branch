/*
 * Copyright(c) RIB Software GmbH
 */
import { inject, Injectable, Injector } from '@angular/core';
import { createLookup, FieldType, ILayoutConfiguration, ILookupContext, UiCommonLookupDataFactoryService } from '@libs/ui/common';
import { prefixAllTranslationKeys } from '@libs/platform/common';
import { IProcurementCommonExtBidderEntity } from '../model/entities/procurement-common-extbidder-entity.interface';
import { BusinessPartnerLookupService, BusinesspartnerSharedStatusLookupService, BusinesspartnerSharedSubsidiaryLookupService } from '@libs/businesspartner/shared';
import { ISubsidiaryLookupEntity } from '@libs/businesspartner/interfaces';

/**
 * events layout service
 */
@Injectable({
	providedIn: 'root',
})
export class ProcurementCommonExtBidderLayoutService {
	private readonly injector = inject(Injector);

	public async generateConfig<T extends IProcurementCommonExtBidderEntity>(): Promise<ILayoutConfiguration<T>> {
		return <ILayoutConfiguration<T>>{
			groups: [
				{
					gid: 'basicData',
					title: {
						text: 'Basic Data',
						key: 'cloud.common.entityProperties',
					},
					attributes: [
						'BpdStatusFk',
						'ContactFk',
						'SubsidiaryFk',
						'BpName1',
						'BpName2',
						'Street',
						'City',
						'Zipcode',
						'Email',
						'CountryFk',
						'Telephone',
						'RoleFk',
						'UserDefined1',
						'UserDefined2',
						'UserDefined3',
						'UserDefined4',
						'UserDefined5',
						'CommentText',
						'Remark',
					],
				},
			],
			labels: {
				...prefixAllTranslationKeys('cloud.common.', {
					BpdStatusFk: { key: 'entityStatus', text: 'Status' },
					SubsidiaryFk: { key: 'entitySubsidiary', text: 'Subsidiary' },
					BpName2: { key: 'entityBusinessPartnerName2', text: 'Business Partner Name2' },
					Street: { key: 'entityStreet', text: 'Street' },
					City: { key: 'entityCity', text: 'City' },
					Zipcode: { key: 'entityZipCode', text: 'Zip Code' },
					Email: { key: 'email', text: 'E-Mail' },
					CountryFk: { key: 'entityCountry', text: 'Country' },
					Telephone: { key: 'TelephoneDialogPhoneNumber', text: 'Phone Number' },
					CommentText: { key: 'entityCommentText', text: 'Comment' },
					Remark: { key: 'entityRemark', text: 'Remarks' },
				}),
				...prefixAllTranslationKeys('procurement.common.', {
					ContactFk: { key: 'contactFirstName', text: 'Contact First Name' },
					BpName1: { key: 'entityBusinessPartnerName1', text: 'Business Partner' },
					RoleFk: { key: 'entityBPRole', text: 'BP Role' },
					UserDefined1: { key: 'userDefined1', text: 'User Defined 1' },
					UserDefined2: { key: 'userDefined2', text: 'User Defined 2' },
					UserDefined3: { key: 'userDefined3', text: 'User Defined 3' },
					UserDefined4: { key: 'userDefined4', text: 'User Defined 4' },
					UserDefined5: { key: 'userDefined5', text: 'User Defined 5' },
				}),
			},
			overloads: {
				BpdStatusFk: {
					type: FieldType.Lookup,
					lookupOptions: createLookup({
						dataServiceToken: BusinesspartnerSharedStatusLookupService,
					}),
				},
				BpName1: {
					type: FieldType.Lookup,
					lookupOptions: createLookup({
						dataServiceToken: BusinessPartnerLookupService,
						displayMember: 'BusinessPartnerName1',
					}),
				},
				SubsidiaryFk: {
					type: FieldType.Lookup,
					lookupOptions: createLookup({
						dataServiceToken: BusinesspartnerSharedSubsidiaryLookupService,
						showClearButton: true,
						serverSideFilter: {
							key: 'businesspartner-main-subsidiary-common-filter',
							execute(context: ILookupContext<ISubsidiaryLookupEntity, T>) {
								return {
									BusinessPartnerFk: context.entity ? context.entity.BusinessPartnerFk : null,
								};
							},
						},
					}),
				},
				RoleFk: {
					type: FieldType.Lookup,
					lookupOptions: createLookup({
						dataService: this.injector.get(UiCommonLookupDataFactoryService).fromSimpleDataProvider('basics.customize.bprole', {
							uuid: '6385bdd89602476a86cecb953dacdf68',
							valueMember: 'Id',
							displayMember: 'Description',
							showClearButton: false,
						}),
					}),
				},
				CountryFk: {
					type: FieldType.Lookup,
					lookupOptions: createLookup({
						dataService: this.injector.get(UiCommonLookupDataFactoryService).fromSimpleDataProvider('basics.lookup.country', {
							uuid: '6385bdd89602476a86cecb953dacdf69',
							valueMember: 'Id',
							displayMember: 'Description',
							showClearButton: false,
						}),
					}),
				},
			},
			transientFields: [
				{
					id:'ContactFk',
					model: 'ContactFk',
					type: FieldType.Description,
					label: { key: 'procurement.common.contactFamilyName' },
				},
				{
					id:'ContactFk',
					model: 'ContactFk',
					type: FieldType.Description,
					label: { key: 'procurement.rfq.rfqBusinessPartnerContactTitle' },
				},
				{
					id:'ContactFk',
					model: 'ContactFk',
					type: FieldType.Description,
					label: { key: 'procurement.rfq.rfqBusinessPartnerContactTel1' },
				},
				{
					id:'ContactFk',
					model: 'ContactFk',
					type: FieldType.Description,
					label: { key: 'procurement.rfq.rfqBusinessPartnerContactTel2' },
				},
				{
					id:'ContactFk',
					model: 'ContactFk',
					type: FieldType.Description,
					label: { key: 'procurement.rfq.rfqBusinessPartnerContactTelefax' },
				},
				{
					id:'ContactFk',
					model: 'ContactFk',
					type: FieldType.Description,
					label: { key: 'procurement.rfq.rfqBusinessPartnerContactMobile' },
				},
				{
					id:'ContactFk',
					model: 'ContactFk',
					type: FieldType.Description,
					label: { key: 'procurement.rfq.rfqBusinessPartnerContactInternet' },
				},
				{
					id:'ContactFk',
					model: 'ContactFk',
					type: FieldType.Email,
					label: { key: 'procurement.rfq.rfqBusinessPartnerContactEmail' },
				},
				{
					id:'ContactFk',
					model: 'ContactFk',
					type: FieldType.Description,
					label: { key: 'procurement.rfq.rfqBusinessPartnerContactSubsidiaryDescription' },
				},
				{
					id:'ContactFk',
					model: 'ContactFk',
					type: FieldType.Description,
					label: { key: 'procurement.rfq.rfqBusinessPartnerContactSubsidiaryAddress' },
				},
			],
		};
	}
}
