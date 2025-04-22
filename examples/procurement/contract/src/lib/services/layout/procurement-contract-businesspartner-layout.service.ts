/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import { BUSINESSPARTNER_RELATED_LOOKUP_PROVIDER_TOKEN, IContactLookupEntity } from '@libs/businesspartner/interfaces';
import { BusinesspartnerSharedContactLookupService } from '@libs/businesspartner/shared';
import { ITranslatable, LazyInjectable, PlatformLazyInjectorService, prefixAllTranslationKeys } from '@libs/platform/common';
import { CONTRACT_CONFIRM_BUSINESS_PARTNER_LAYOUT_SERVICE, IContractBusinesspartnerLayout, IRfqBusinessPartnerEntity } from '@libs/procurement/interfaces';
import { createLookup, FieldType, IAdditionalLookupField, ILayoutConfiguration, ILookupContext } from '@libs/ui/common';


/**
 * Layout service for contract confirm businesspartner wizard container.
 */
@Injectable({
	providedIn: 'root'
})
@LazyInjectable({
	token: CONTRACT_CONFIRM_BUSINESS_PARTNER_LAYOUT_SERVICE,
	useAngularInjection: true
})
export class ProcurementContractBusinesspartnerLayoutService implements IContractBusinesspartnerLayout {
	private readonly lazyInjector = inject(PlatformLazyInjectorService);

	/**
	 *
	 * @returns layout configuration required for business partner container of contract confirm wizard.
	 */
	public async generateLayout(): Promise<ILayoutConfiguration<IRfqBusinessPartnerEntity>> {
		const bpRelatedLookupProvider = await this.lazyInjector.inject(BUSINESSPARTNER_RELATED_LOOKUP_PROVIDER_TOKEN);
		return {
			groups: [
				{
					gid: 'baseGroup',
					title: {
						key: 'cloud.common.entityProperties',
						text: 'Basic Data',
					},
					attributes: ['BusinessPartnerFk', 'ContactFk', 'SubsidiaryFk'],
				},
			],
			labels: {
				...prefixAllTranslationKeys('procurement.common.', {
					ContactFk: {
						key: 'ContactFirstName',
						text: 'Contact First Name',
					},
				}),
				...prefixAllTranslationKeys('businesspartner.main.import.', {
					BusinessPartnerFk: {
						key: 'businessPartnerName1',
						text: 'Business Partner'
					}
				}),
				...prefixAllTranslationKeys('procurement.rfq.', {
					SubsidiaryFk: { key: 'wizard.businessPartner.BranchEmail', text: 'Branch E-mail' },

				})
			},
			overloads: {
				BusinessPartnerFk: {
					...bpRelatedLookupProvider.getBusinessPartnerLookupOverload({
						showClearButton: true,
						filterIsLive: true,
						additionalFields: [createAdditionalField('bpEmail', 'Email', { text: 'Email', key: 'procurement.rfq.rfqBusinessPartnerBpEmail' })],
					}),
					readonly: true,
				},
				ContactFk: {
					type: FieldType.Lookup,
					readonly: true,
					lookupOptions: createLookup({
						dataServiceToken: BusinesspartnerSharedContactLookupService,
						showClearButton: true,
						serverSideFilter: {
							key: 'prc-subcontactor-bpdcontact-filter',
							execute(context: ILookupContext<IContactLookupEntity, IRfqBusinessPartnerEntity>) {
								return {
									BusinessPartnerFk: context.entity ? context.entity.BusinessPartnerFk : null,
									SubsidiaryFk: context.entity ? context.entity.SubsidiaryFk : null,

								};
							}
						}
					}),
					additionalFields: [
						createAdditionalField('ContactLastName', 'LastName', { text: 'Contact Last Name' }),
						createAdditionalField('ContactEmail', 'Email', { text: 'Contact Email', key: 'procurement.rfq.rfqBusinessPartnerContactEmail' }),

					],
				},
				SubsidiaryFk: {
					...bpRelatedLookupProvider.getSubsidiaryLookupOverload({
						showClearButton: true,
						displayMember: 'BpSubsidiaryEmail',
						serverFilterKey: 'businesspartner-main-subsidiary-common-filter',
						restrictToBusinessPartners: (entity) => entity.BusinessPartnerFk,
						additionalFields: [
							createAdditionalField('BpSubsidiaryEmail', 'Branch E-mail', { text: 'Branch E-mail', key: 'procurement.rfq.wizard.businessPartner.BranchEmail' }),

						],
					}),
					readonly: true
				}
			},
		};
	}


}


const createAdditionalField = function (id: string, displayMember: string, label: ITranslatable): IAdditionalLookupField {
	return {
		id: id,
		displayMember: displayMember,
		label: label,
		column: true,
		singleRow: true,
	};
};
