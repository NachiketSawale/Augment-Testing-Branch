/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import {
	BASICS_SCOPE_ENTITY_LAYOUT_GENERATOR,
	IMaterialScopeEntity
} from '@libs/basics/interfaces';
import {  ILayoutConfiguration, ILookupContext } from '@libs/ui/common';
import { LazyInjectable, PlatformLazyInjectorService, prefixAllTranslationKeys } from '@libs/platform/common';
import { BUSINESSPARTNER_RELATED_LOOKUP_PROVIDER_TOKEN, ISubsidiaryLookupEntity, ISupplierLookupEntity } from '@libs/businesspartner/interfaces';

/**
 * Scope layout service
 */
@Injectable({
	providedIn: 'root',
})
@LazyInjectable({
	token: BASICS_SCOPE_ENTITY_LAYOUT_GENERATOR,
	useAngularInjection: true,
})
export class BasicsMaterialScopeLayoutService<T extends IMaterialScopeEntity> {
	private readonly lazyInjector = inject(PlatformLazyInjectorService);

	public async generateLayout(): Promise<ILayoutConfiguration<T>> {
		const bpRelatedLookupProvider = await this.lazyInjector.inject(BUSINESSPARTNER_RELATED_LOOKUP_PROVIDER_TOKEN);

		return <ILayoutConfiguration<T>>{
			groups: [
				{
					gid: 'basicData',
					title: {
						key: 'cloud.common.entityProperties',
						text: 'Basic Data',
					},
					attributes: [
						'MatScope',
						'DescriptionInfo',
						'BusinessPartnerFk',
						'SubsidiaryFk',
						'SupplierFk',
						'BusinessPartnerProdFk',
						'SubsidiaryProdFk',
						'SupplierProdFk',
						'CommentText',
						'Remark',
						'UserDefined1',
						'UserDefined2',
						'UserDefined3',
						'UserDefined4',
						'UserDefined5',
						'IsSelected',
					],
				},
			],
			labels: {
				...prefixAllTranslationKeys('basics.material.', {
					MatScope: {
						key: 'entityMatScope',
						text: 'Material Scope',
					},
					BusinessPartnerProdFk: {
						key: 'entityBusinessPartnerProd',
						text: 'Business Partner Producer',
					},
					SubsidiaryProdFk: {
						key: 'entitySubsidiaryProd',
						text: 'Subsidiary Producer',
					},
					SupplierProdFk: {
						key: 'entitySupplierProd',
						text: 'Supplier Producer',
					},
					IsSelected: {
						key: 'entityIsSelected',
						text: 'Is Selected',
					},
				}),
				...prefixAllTranslationKeys('cloud.common.', {
					DescriptionInfo: {
						key: 'entityDescription',
						text: 'Description',
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
					CommentText: {
						key: 'entityCommentText',
						text: 'Comment',
					},
					Remark: {
						key: 'entityRemark',
						text: 'Remarks',
					},
					UserDefined1: {
						key: 'entityUserDefined',
						text: 'User-Defined 1',
						params: { p_0: '1' },
					},
					UserDefined2: {
						key: 'entityUserDefined',
						text: 'User-Defined 2',
						params: { p_0: '2' },
					},
					UserDefined3: {
						key: 'entityUserDefined',
						text: 'User-Defined 3',
						params: { p_0: '3' },
					},
					UserDefined4: {
						key: 'entityUserDefined',
						text: 'User-Defined 4',
						params: { p_0: '4' },
					},
					UserDefined5: {
						key: 'entityUserDefined',
						text: 'User-Defined 5',
						params: { p_0: '5' },
					},
				}),
			},
			overloads: {
				BusinessPartnerFk: bpRelatedLookupProvider.getBusinessPartnerLookupOverload(),
				SubsidiaryFk: bpRelatedLookupProvider.getSubsidiaryLookupOverload({
					showClearButton: true,
					customServerSideFilter: {
						key: 'businesspartner-main-subsidiary-common-filter',
						execute(context: ILookupContext<ISubsidiaryLookupEntity, T>) {
							return {
								BusinessPartnerFk: context.entity ? ((e) => e.BusinessPartnerFk)(context.entity) : null,
								SupplierFk: context.entity ? ((e) => e.SupplierFk)(context.entity) : null,
							};
						},
					},
				}),
				SupplierFk: bpRelatedLookupProvider.getSupplierLookupOverload({
					showClearButton: true,
					customServerSideFilter: {
						key: 'businesspartner-main-supplier-common-filter',
						execute(context: ILookupContext<ISupplierLookupEntity, T>) {
							return {
								BusinessPartnerFk: context.entity ? ((e) => e.BusinessPartnerFk)(context.entity) : null,
								SubsidiaryFk: context.entity ? ((e) => e.SubsidiaryFk)(context.entity) : null,
							};
						},
					},
				}),
				BusinessPartnerProdFk: bpRelatedLookupProvider.getBusinessPartnerLookupOverload(),
				SubsidiaryProdFk: bpRelatedLookupProvider.getSubsidiaryLookupOverload({
					showClearButton: true,
					customServerSideFilter: {
						key: 'businesspartner-main-subsidiary-common-filter',
						execute(context: ILookupContext<ISubsidiaryLookupEntity, T>) {
							return {
								BusinessPartnerFk: context.entity ? ((e) => e.BusinessPartnerProdFk)(context.entity) : null,
								SupplierFk: context.entity ? ((e) => e.SupplierProdFk)(context.entity) : null,
							};
						},
					},
				}),
				SupplierProdFk: bpRelatedLookupProvider.getSupplierLookupOverload({
					showClearButton: true,
					customServerSideFilter: {
						key: 'businesspartner-main-supplier-common-filter',
						execute(context: ILookupContext<ISupplierLookupEntity, T>) {
							return {
								BusinessPartnerFk: context.entity ? ((e) => e.BusinessPartnerProdFk)(context.entity) : null,
								SubsidiaryFk: context.entity ? ((e) => e.SubsidiaryProdFk)(context.entity) : null,
							};
						},
					},
				}),
				//TODO: This was not considered in angular JS, if islive = false, isselected should be readonly. If isselected = true, islive is readonly
			},
		};
	}
}