/*
 * Copyright(c) RIB Software GmbH
 */
import { createLookup, FieldType, ILayoutConfiguration, ILookupContext } from '@libs/ui/common';
import { Injectable } from '@angular/core';
import {  prefixAllTranslationKeys } from '@libs/platform/common';
import { IPrcSubreferenceEntity } from '../model/entities';
import { BasicsSharedLookupOverloadProvider} from '@libs/basics/shared';
import {
	BusinessPartnerLookupService,
	BusinesspartnerSharedContactLookupService,
	BusinesspartnerSharedSubsidiaryLookupService,
	BusinesspartnerSharedSupplierLookupService,
} from '@libs/businesspartner/shared';
import { IContactLookupEntity, ISubsidiaryLookupEntity, ISupplierLookupEntity } from '@libs/businesspartner/interfaces';

/**
 * Common procurement subcontractor layout service
 */
@Injectable({
	providedIn: 'root'
})
export class ProcurementCommonSubcontractorLayoutService {

	public async generateLayout<T extends IPrcSubreferenceEntity>(): Promise<ILayoutConfiguration<T>> {
		return <ILayoutConfiguration<T>>{
			groups: [
				{
					gid: 'baseGroup',
					attributes: ['PrcStructureFk', 'BpdBusinesspartnerFk', 'BpdSubsidiaryFk', 'BpdSupplierFk', 'BpdContactFk', 'Description', 'UserDefinedDate1', 'UserDefinedDate2', 'UserDefinedDate3', 'UserDefinedDate4', 'UserDefinedDate5']
				}
			],
			labels: {
				...prefixAllTranslationKeys('cloud.common.', {
					PrcStructureFk: {text: 'Structure', key: 'entityStructureCode'},
					BpdBusinesspartnerFk:{text: 'Business Partner', key: 'entityBusinessPartner'},
					BpdSubsidiaryFk:{text: 'Subsidiary', key: 'entitySubsidiary'},
					BpdSupplierFk:{text: 'Supplier', key: 'entitySupplier'},
					BpdContactFk:{text: 'Family Name', key: 'contactFamilyName'},
					Description:{text: 'Comment', key: 'entityComment'},
					UserDefinedDate1: {text: 'User Defined Date 1', key: 'entityUserDefinedDate', params: {'p_0': '1'}},
					UserDefinedDate2: {text: 'User Defined Date 2', key: 'entityUserDefinedDate', params: {'p_0': '1'}},
					UserDefinedDate3: {text: 'User Defined Date 3', key: 'entityUserDefinedDate', params: {'p_0': '1'}},
					UserDefinedDate4: {text: 'User Defined Date 4', key: 'entityUserDefinedDate', params: {'p_0': '1'}},
					UserDefinedDate5: {text: 'User Defined Date 5', key: 'entityUserDefinedDate', params: {'p_0': '1'}}
				})
			},
			overloads: {
				PrcStructureFk: BasicsSharedLookupOverloadProvider.providerBasicsProcurementStructureLookupOverload(true),
				BpdBusinesspartnerFk: {
					type: FieldType.Lookup,
					lookupOptions: createLookup({
						dataServiceToken: BusinessPartnerLookupService
					})
				},
				BpdSubsidiaryFk:{
					type: FieldType.Lookup,
					lookupOptions: createLookup({
						dataServiceToken: BusinesspartnerSharedSubsidiaryLookupService,
						showClearButton: true,
						serverSideFilter: {
							key: 'businesspartner-main-subsidiary-common-filter',
							execute(context: ILookupContext<ISubsidiaryLookupEntity, IPrcSubreferenceEntity>) {
								return {
									BusinessPartnerFk: context.entity ? context.entity.BpdBusinesspartnerFk : null,
									SupplierFk: context.entity ? context.entity.BpdSupplierFk : null
								};
							}
						}
					})
				},
				BpdSupplierFk:{
					type: FieldType.Lookup,
					lookupOptions: createLookup({
						dataServiceToken: BusinesspartnerSharedSupplierLookupService,
						showClearButton: true,
						serverSideFilter: {
							key: 'businesspartner-main-supplier-common-filter',
							execute(context: ILookupContext<ISupplierLookupEntity, IPrcSubreferenceEntity>) {
								return {
									BusinessPartnerFk: context.entity ? context.entity.BpdBusinesspartnerFk : null,
									SubsidiaryFk: context.entity ? context.entity ?.BpdSubsidiaryFk : null
								};
							}
						}
					})
				},
				BpdContactFk:{
					type: FieldType.Lookup,
					lookupOptions: createLookup({
						dataServiceToken: BusinesspartnerSharedContactLookupService,
						showClearButton: true,
						serverSideFilter: {
							key: 'prc-subcontactor-bpdcontact-filter',
							execute(context: ILookupContext<IContactLookupEntity, IPrcSubreferenceEntity>) {
								return {
									BusinessPartnerFk: context.entity ? context.entity.BpdBusinesspartnerFk : null,
									SubsidiaryFk: context.entity ? context.entity.BpdSubsidiaryFk : null
								};
							}
						}
					})
				},
				UserDefinedDate1: {
					type: FieldType.DateUtc
				},
				UserDefinedDate2: {
					type: FieldType.DateUtc
				},
				UserDefinedDate3: {
					type: FieldType.DateUtc
				},
				UserDefinedDate4: {
					type: FieldType.DateUtc
				},
				UserDefinedDate5: {
					type: FieldType.DateUtc
				}
				//todo-pel: addition fields, depend on the framework ready
			}
		};
	}
}