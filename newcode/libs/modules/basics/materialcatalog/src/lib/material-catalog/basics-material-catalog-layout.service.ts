/*
 * Copyright(c) RIB Software GmbH
 */
import { firstValueFrom } from 'rxjs';
import { inject, Injectable } from '@angular/core';
import { FieldType, ILayoutConfiguration } from '@libs/ui/common';
import { HttpClient } from '@angular/common/http';
import { PlatformConfigurationService, PlatformLazyInjectorService, prefixAllTranslationKeys } from '@libs/platform/common';
import { BasicsSharedCustomizeLookupOverloadProvider, BasicsSharedLookupOverloadProvider, IMaterialCatalogEntity, Rubric } from '@libs/basics/shared';
import { ProcurementSharedLookupOverloadProvider } from '@libs/procurement/shared';
import { BUSINESSPARTNER_RELATED_LOOKUP_PROVIDER_TOKEN } from '@libs/businesspartner/interfaces';

/**
 * Material catalog layout service
 */
@Injectable({
	providedIn: 'root',
})
export class BasicsMaterialCatalogLayoutService {
	private isInternetFields?: boolean;
	private readonly http = inject(HttpClient);
	private readonly config = inject(PlatformConfigurationService);
	private readonly lazyInjector = inject(PlatformLazyInjectorService);

	private async checkIsInternetFields() {
		if (this.isInternetFields === undefined) {
			this.isInternetFields = (await firstValueFrom(this.http.get(this.config.webApiBaseUrl + 'basics/common/systemoption/internetfields'))) as boolean;
		}
		return this.isInternetFields;
	}

	/**
	 * Generate layout config
	 */
	public async generateLayout(): Promise<ILayoutConfiguration<IMaterialCatalogEntity>> {
		let basicFields: (keyof IMaterialCatalogEntity)[] = ['MaterialCatalogTypeFk', 'BasRubricCategoryFk', 'Code', 'DescriptionInfo', 'ValidFrom', 'ValidTo', 'ClerkFk', 'DataDate', 'IsLive', 'IsTicketsystem', 'ConHeaderFk'];

		await this.checkIsInternetFields();
		const bpRelatedLookupProvider = await this.lazyInjector.inject(BUSINESSPARTNER_RELATED_LOOKUP_PROVIDER_TOKEN);
		if (!this.isInternetFields) {
			basicFields = basicFields.concat(['Url', 'IsInternetCatalog', 'UrlUser', 'UrlPassword']);
		}

		return {
			groups: [
				{
					gid: 'basicData',
					title: {
						text: 'Basic Data',
						key: 'cloud.common.entityProperties',
					},
					attributes: basicFields,
				},
				{
					gid: 'supplierGroup',
					title: {
						text: 'Supplier',
						key: 'cloud.common.entitySupplier',
					},
					attributes: ['BusinessPartnerFk', 'SubsidiaryFk', 'SupplierFk'],
				},
				{
					gid: 'termsGroup',
					title: {
						text: 'Terms',
						key: 'basics.materialcatalog.termsGroup',
					},
					attributes: ['PaymentTermFk', 'PaymentTermFiFk', 'PaymentTermAdFk', 'PrcIncotermFk', 'IsNeutral'],
				},
			],
			labels: {
				...prefixAllTranslationKeys('cloud.common.', {
					MaterialCatalogTypeFk: {
						key: 'entityType',
						text: 'Type',
					},
					Code: {
						key: 'entityCode',
						text: 'Code',
					},
					IsLive: {
						key: 'entityIsLive',
						text: 'Active',
					},
					ClerkFk: {
						key: 'entityResponsible',
						text: 'Responsible',
					},
					BusinessPartnerFk: {
						key: 'entityBusinessPartner',
						text: 'Business Partner',
					},
					SubsidiaryFk: {
						key: 'entitySubsidiary',
						text: 'Branch',
					},
					SupplierFk: {
						key: 'entitySupplier',
						text: 'Supplier',
					},
					PaymentTermFk: {
						key: 'entityPaymentTermPA',
						text: 'Payment Term (PA)',
					},
					PrcIncotermFk: {
						key: 'entityIncoterms',
						text: 'Incoterms',
					},
					DescriptionInfo: {
						key: 'entityDescription',
						text: 'Description',
					},
					ConHeaderFk: {
						key: 'entityContract',
						text: 'Contract',
					},
					PaymentTermFiFk: {
						key: 'entityPaymentTermFI',
						text: 'Payment Term (FI)',
					},
					PaymentTermAdFk: {
						key: 'entityPaymentTermAD',
						text: 'Payment Term (AD)',
					},
				}),
				...prefixAllTranslationKeys('basics.materialcatalog.', {
					ValidFrom: {
						key: 'validFrom',
						text: 'Valid From',
					},
					ValidTo: {
						key: 'validTo',
						text: 'Valid To',
					},
					DataDate: {
						key: 'entityPriceVersionDataDate',
						text: 'Record Date',
					},
					IsTicketsystem: {
						key: 'isTicketSystem',
						text: 'Is Ticket System',
					},
					IsInternetCatalog: {
						key: 'IsInternetCatalog',
						text: 'Is Internet Catalog',
					},
					IsNeutral: {
						key: 'isNeutral',
						text: 'Neutral Material',
					},
					BasRubricCategoryFk: {
						key: 'baseRubricCategory',
						text: 'Rubric Category',
					},
					Url: {
						key: 'url',
						text: 'Url',
					},
					UrlUser: {
						key: 'urlUser',
						text: 'Url User',
					},
					UrlPassword: {
						key: 'urlPassword',
						text: 'Url Password',
					},
				}),
				...prefixAllTranslationKeys('basics.material.', {
					IsChecked: {
						key: 'record.filter',
						text: 'filter',
					},
				}),
			},
			overloads: {
				IsLive: {
					readonly: true,
				},
				MaterialCatalogTypeFk: BasicsSharedCustomizeLookupOverloadProvider.provideMaterialCatalogTypeLookupOverload(false),
				ClerkFk: BasicsSharedLookupOverloadProvider.providerBasicsClerkLookupOverload(true, 'cloud.common.entityResponsibleDescription'),
				BasRubricCategoryFk: BasicsSharedLookupOverloadProvider.provideRubricCategoryLookupOverload(false, {
					key: 'mdc-material-catalog-rubric-category-filter',
					execute() {
						return 'RubricFk = ' + Rubric.Material;
					},
				}),
				BusinessPartnerFk: bpRelatedLookupProvider.getBusinessPartnerLookupOverload({
					showClearButton: true,
				}),
				SubsidiaryFk: bpRelatedLookupProvider.getSubsidiaryLookupOverload({
					showClearButton: true,
					serverFilterKey: 'businesspartner-main-subsidiary-common-filter',
					restrictToBusinessPartners: (entity) => entity.BusinessPartnerFk,
					restrictToSuppliers: (entity) => entity.SupplierFk,
				}),
				SupplierFk: bpRelatedLookupProvider.getSupplierLookupOverload({
					showClearButton: true,
					serverFilterKey: 'businesspartner-main-supplier-common-filter',
					restrictToBusinessPartners: (entity) => entity.BusinessPartnerFk,
					restrictToSubsidiaries: (entity) => entity.SubsidiaryFk,
				}),
				PaymentTermFk: BasicsSharedLookupOverloadProvider.providePaymentTermLookupOverload(true, 'cloud.common.entityPaymentTermPaDescription'),
				PaymentTermAdFk: BasicsSharedLookupOverloadProvider.providePaymentTermLookupOverload(true, 'cloud.common.entityPaymentTermAdDescription'),
				PaymentTermFiFk: BasicsSharedLookupOverloadProvider.providePaymentTermLookupOverload(true, 'cloud.common.entityPaymentTermFiDescription'),
				UrlPassword: {
					type: FieldType.Password,
				},
				ConHeaderFk: ProcurementSharedLookupOverloadProvider.provideContractReadonlyLookupOverload('basics.materialcatalog.entityContractDescription'),
				PrcIncotermFk: BasicsSharedLookupOverloadProvider.provideIncotermsLookupOverload(true, 'basics.common.entityIncotermDescription'),
			},
		};
	}
}
