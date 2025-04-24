/*
 * Copyright(c) RIB Software GmbH
 */
import { inject, Injectable } from '@angular/core';
import { BasicsSharedCustomizeLookupOverloadProvider, BasicsSharedLookupOverloadProvider } from '@libs/basics/shared';
import { ISubsidiaryLookupEntity } from '@libs/businesspartner/interfaces';
import {
	BusinessPartnerLookupService,
	BusinesspartnerSharedSubsidiaryLookupService
} from '@libs/businesspartner/shared';
import { prefixAllTranslationKeys } from '@libs/platform/common';
import {
	createLookup,
	FieldType,
	ILayoutConfiguration,
	ILookupContext,
	UiCommonLookupDataFactoryService
} from '@libs/ui/common';
import { IPpsCommonBizPartnerEntity } from '../../model/entities/pps-common-biz-partner-entity.interface';
import { PpsCommonBizPartnerFromsHelper } from './pps-common-biz-partner-froms-helper.service';
/**
 * PPS Header BusinessPartner layout service
 */
@Injectable({
	providedIn: 'root',
})
export class PpsCommonBusinessPartnerLayoutConfiguration {
	private lookupServiceFactory = inject(UiCommonLookupDataFactoryService);
	private fromsHelper = inject(PpsCommonBizPartnerFromsHelper);

	/**
	 * Generate layout config
	 */
	public generateLayout(): ILayoutConfiguration<IPpsCommonBizPartnerEntity> {
		return {
			groups: [
				{
					gid: 'basicData',
					attributes: ['BusinessPartnerFk', 'RoleFk', 'SubsidiaryFk', 'TelephoneNumberFk', 'Email', 'IsLive', 'Remark', 'From']
				},
			],
			labels: {
				...prefixAllTranslationKeys('cloud.common.', {
					basicData: { key: 'entityProperties' },
					BusinessPartnerFk: { key: 'entityBusinessPartner' },
					SubsidiaryFk: { key: 'entitySubsidiary' },
					IsLive: { key: 'entityIsLive' },
					Remark: { key: 'entityRemark' },
					TelephoneNumberFk: { key: 'TelephoneDialogPhoneNumber' },
					Email: { key: 'email' },
				}),
				...prefixAllTranslationKeys('project.main.', {
					RoleFk: { key: 'entityRole' },
				}),
				...prefixAllTranslationKeys('productionplanning.common.', {
					From: { key: 'from' }
				}),
			},
			overloads: {
				BusinessPartnerFk: {
					type: FieldType.Lookup,
					lookupOptions: createLookup({
						dataServiceToken: BusinessPartnerLookupService,
						displayMember: 'BusinessPartnerName1',
					})
				},
				RoleFk: BasicsSharedCustomizeLookupOverloadProvider.provideBpRoleReadonlyLookupOverload(),
				SubsidiaryFk: {
					type: FieldType.Lookup,
					lookupOptions: createLookup({
						dataServiceToken: BusinesspartnerSharedSubsidiaryLookupService,
						displayMember: 'AddressLine',
						showClearButton: true,
						clientSideFilter: {
							execute(item: ISubsidiaryLookupEntity, context: ILookupContext<ISubsidiaryLookupEntity, IPpsCommonBizPartnerEntity>): boolean {
								return (!context.entity?.BusinessPartnerFk || context.entity.BusinessPartnerFk <= 0 || item.BusinessPartnerFk === context.entity.BusinessPartnerFk);
							}
						}
					})
				},
				TelephoneNumberFk: BasicsSharedLookupOverloadProvider.providerTelephoneDialogComponentOverload(true),
				// TelephoneNumberFk: {
				// 	readonly: true,
				// },
				Email: {
					readonly: true,
				},
				From: {
					type: FieldType.Lookup,
					lookupOptions: createLookup({
						dataService: this.lookupServiceFactory.fromItems(this.fromsHelper.getFroms(), {
							uuid: '',
							idProperty: 'id',
							valueMember: 'id',
							displayMember: 'description'
						})
					})
				},
			}
		};
	}
}
