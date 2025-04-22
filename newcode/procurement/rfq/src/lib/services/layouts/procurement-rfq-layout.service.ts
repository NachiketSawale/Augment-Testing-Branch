/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { createLookup, FieldType, ILayoutConfiguration, LookupSimpleEntity } from '@libs/ui/common';
import {
	BasicsCompanyLookupService,
	BasicsSharedClerkLookupService,
	BasicsSharedLookupOverloadProvider, BasicsSharedProcurementStrategyLookupService
} from '@libs/basics/shared';
import { IBasicsClerkEntity, ICompanyEntity } from '@libs/basics/interfaces';
import { LazyInjectable, prefixAllTranslationKeys } from '@libs/platform/common';
import { IProcurementRfqHeaderLayoutService, IRfqHeaderEntity, RFQ_HEADER_LAYOUT_SERVICE } from '@libs/procurement/interfaces';
import {
	IRfqLookupEntity,
	PrcRfqStatusLookupService,
	PrcSharedPrcConfigEntity,
	PrcSharedPrcConfigLookupService,
	ProcurementShareRfqLookupService,
	RfqTypeLookupService,
	RfqStatusEntity,
	IRfqTypeEntity,
	IPrcContractTypeEntity,
	PrcContractTypeLookupService,
	IPrcAwardMethodEntity,
	PrcAwardMethodLookupService
} from '@libs/procurement/shared';
import { BusinesspartnerSharedEvaluationSchemaLookupService } from '@libs/businesspartner/shared';
import { ProjectSharedLookupService } from '@libs/project/shared';
import { IProjectEntity } from '@libs/project/interfaces';

/**
 * Procurement layout service
 */
@LazyInjectable({
	token: RFQ_HEADER_LAYOUT_SERVICE,
	useAngularInjection: true
})
@Injectable({
	providedIn: 'root',
})
export class ProcurementRfqLayoutService implements IProcurementRfqHeaderLayoutService {

	/**
	 * Generate layout config
	 */
	public generateLayout(): ILayoutConfiguration<IRfqHeaderEntity> {
		return {
			groups: [
				{
					gid: 'baseGroup',
					attributes: ['Id', 'RfqStatusFk', 'Code', 'RfqHeaderFk', 'DateRequested', 'DateCanceled', 'CurrencyFk', 'ProjectFk', 'ProjectStatusFk', 'RfqTypeFk', 'PrcContractTypeFk',
						'ClerkPrcFk', 'ClerkReqFk', 'PrcAwardMethodFk', 'PrcConfigurationFk', 'PrcStrategyFk', 'PaymentTermPaFk', 'PaymentTermFiFk',
						'PaymentTermAdFk', 'PlannedStart', 'PlannedEnd', 'EvaluationSchemaFk', 'BillingSchemaFk', 'DateDelivery', 'PrcStructureCode', 'PrcStructureDescription']
				},
				{
					gid: 'supplierGroup',
					attributes: ['AwardReference', 'DateQuoteDeadline', 'TimeQuoteDeadline', 'LocaQuoteDeadline', 'DateAwardDeadline']
				},
				{
					gid: 'deliveryRequirementsGroup',
					attributes: ['Remark']
				},
				{
					gid: 'packageGroup',
					attributes: ['PackageNumber', 'PackageDescription', 'AssetMasterCode', 'AssetMasterDescription', 'PackageDeliveryAddress', 'PackageTextInfo']
				},
				{
					gid: 'userDefinedGroup',
					attributes: ['UserDefined1', 'UserDefined2', 'UserDefined3', 'UserDefined4', 'UserDefined5']
				}
			],
			overloads: {
				Id: {readonly: true},
				RfqStatusFk: {
					type: FieldType.Lookup,
					lookupOptions: createLookup<IRfqHeaderEntity, RfqStatusEntity>({
						dataServiceToken: PrcRfqStatusLookupService,
						showClearButton: true,
						displayMember: 'Description'
					})
				},
				RfqHeaderFk: {
					type: FieldType.Lookup,
					lookupOptions: createLookup<IRfqHeaderEntity, IRfqLookupEntity>({
						dataServiceToken: ProcurementShareRfqLookupService,
						showClearButton: true,
						descriptionMember: 'Code'
					})
				},
				CurrencyFk: BasicsSharedLookupOverloadProvider.provideCurrencyLookupOverload(true),
				ProjectFk: {
					type: FieldType.Lookup,
					lookupOptions: createLookup<IRfqHeaderEntity, IProjectEntity>({
						dataServiceToken: ProjectSharedLookupService
					})
				},
				RfqTypeFk: {
					type: FieldType.Lookup,
					lookupOptions: createLookup<IRfqHeaderEntity, IRfqTypeEntity>({
						dataServiceToken: RfqTypeLookupService
					})
				},
				PrcContractTypeFk: {
					type: FieldType.Lookup,
					lookupOptions: createLookup<IRfqHeaderEntity, IPrcContractTypeEntity>({
						dataServiceToken: PrcContractTypeLookupService
					})
				},
				CompanyFk: {
					type: FieldType.Lookup,
					lookupOptions: createLookup<IRfqHeaderEntity, ICompanyEntity>({
						dataServiceToken: BasicsCompanyLookupService,
						showDescription: true,
						descriptionMember: 'CompanyName'
					})
				},
				ClerkPrcFk: {
					type: FieldType.Lookup,
					lookupOptions: createLookup<IRfqHeaderEntity, IBasicsClerkEntity>({
						dataServiceToken: BasicsSharedClerkLookupService,
						showClearButton: true,
						showDescription: true,
						descriptionMember: 'Description'
					})
				},
				ClerkReqFk: {
					type: FieldType.Lookup,
					lookupOptions: createLookup<IRfqHeaderEntity, IBasicsClerkEntity>({
						dataServiceToken: BasicsSharedClerkLookupService,
						showClearButton: true,
						showDescription: true,
						descriptionMember: 'Description'
					})
				},
				PrcAwardMethodFk: {
					type: FieldType.Lookup,
					lookupOptions: createLookup<IRfqHeaderEntity, IPrcAwardMethodEntity>({
						dataServiceToken: PrcAwardMethodLookupService,
						showDescription: true,
						descriptionMember: 'Description'
					})
				},
				PrcConfigurationFk: {
					type: FieldType.Lookup,
					lookupOptions: createLookup<IRfqHeaderEntity, PrcSharedPrcConfigEntity>({
						dataServiceToken: PrcSharedPrcConfigLookupService,
						showDescription: true,
						descriptionMember: 'DescriptionInfo.Translated'
					})
				},
				PrcStrategyFk: {
					type: FieldType.Lookup,
					lookupOptions: createLookup<IRfqHeaderEntity, LookupSimpleEntity>({
						dataServiceToken: BasicsSharedProcurementStrategyLookupService,
						showDescription: true,
						descriptionMember: 'Description'
					})
				},
				PaymentTermPaFk: BasicsSharedLookupOverloadProvider.providePaymentTermListLookupOverload(true),
				PaymentTermFiFk: BasicsSharedLookupOverloadProvider.providePaymentTermListLookupOverload(true),
				PaymentTermAdFk: BasicsSharedLookupOverloadProvider.providePaymentTermListLookupOverload(true),
				EvaluationSchemaFk: {
					type: FieldType.Lookup,
					lookupOptions: createLookup<IRfqHeaderEntity, LookupSimpleEntity>({
						dataServiceToken: BusinesspartnerSharedEvaluationSchemaLookupService
					})
				},
				BillingSchemaFk: BasicsSharedLookupOverloadProvider.provideBillingSchemaLookupOverload(true),
			},
			labels: {
				...prefixAllTranslationKeys('procurement.rfq' + '.', {
					Code: {key: 'code', text: 'RfQ Code'},
					RfqHeaderFk: {key: 'headerRfqCode', text: 'Basis RfQ'},
					PrcContractTypeFk: {key: 'headerPrcContractType'},
					PrcConfigurationFk: {key: 'headerConfiguration', text: 'Configuration'},
					PrcStrategyFk: {key: 'headerStrategy', text: 'Strategy'},
					AwardReference: {key: 'headerAwardReference', text: 'Award Reference'},
					LocaQuoteDeadline: {key: 'headerLocalQuoteDeadline', text: 'Local'},
					PackageNumber: {key: 'packageNumber', text: 'Package Number'},
					AssetMasterCode: {key: 'assetMasterCode', text: 'Asset Master Code'},
					PackageDeliveryAddress: {key: 'packageDeliveryAddress', text: 'Package Delivery Address'},
					supplierGroup: {key: 'headerGroupDesiredSupplier', text: 'Submission Requirements'},
					deliveryRequirementsGroup: {key: 'headerGroupDeliveryRequirements', text: 'Delivery Requirements'},
					packageGroup: {key: 'packageGroup', text: 'Package Group'}
				}),
				...prefixAllTranslationKeys('cloud.common.', {
					Id: {key: 'entityId'},
					RfqStatusFk: {key: 'entityStatus', text: 'Status'},
					RfqTypeFk: {key: 'entityType', text: 'Type'},
					DateRequested: {key: 'entityDateRequested'},
					DateCanceled: {key: 'entityCancelled'},
					ClerkPrcFk: {key: 'entityResponsible', text: 'Responsible'},
					ClerkReqFk: {key: 'entityRequisitionOwner', text: 'Requisition Owner'},
					PrcAwardMethodFk: {key: 'entityAwardMethod', text: 'Award Method'},
					DateDelivery: {key: 'dateDelivered', text: 'Date Delivered'},
					ProjectFk: {key: 'entityProjectName', text: 'Project'},
					CurrencyFk: {key: 'entityCurrency', text: 'Currency'},
					CompanyFk: {key: 'entityCompany'},
					PaymentTermPaFk: {key: 'entityPaymentTermPA', text: 'Payment Term (PA)'},
					PaymentTermFiFk: {key: 'entityPaymentTermFI', text: 'Payment Term (FI)'},
					PaymentTermAdFk: {key: 'entityPaymentTermAD', text: 'Payment Term (AD)'},
					Remark: {key: 'entityRemark'},
					DateQuoteDeadline: {key: 'entityDeadline', text: 'Deadline'},
					TimeQuoteDeadline: {key: 'entityTime', text: 'Time'},
					UserDefined1: {key: 'entityUserDefined', params: {p_0: '1'}},
					UserDefined2: {key: 'entityUserDefined', params: {p_0: '2'}},
					UserDefined3: {key: 'entityUserDefined', params: {p_0: '3'}},
					UserDefined4: {key: 'entityUserDefined', params: {p_0: '4'}},
					UserDefined5: {key: 'entityUserDefined', params: {p_0: '5'}},
					PrcStructureCode: {key: 'entityStructureCode', text: 'Structure Code'},
					PrcStructureDescription: {key: 'entityStructureDescription', text: 'Structure Description'},
					PackageDescription: {key: 'entityPackageDescription', text: 'Package Description'},
					BillingSchemaFk: {key: 'entityBillingSchema', text: 'Billing Schema'}
				}),
				...prefixAllTranslationKeys('procurement.common.', {
					DateDelivery: {key: 'transaction.dateDelivered', text: 'Date Delivered'},
					PackageTextInfo: {key: 'entityPackageTextInfo', text: 'Package Text Info'},
				}),
				...prefixAllTranslationKeys('procurement.package.', {
					PlannedStart: { key: 'entityPlannedStart', text: 'Planned Start' },
					PlannedEnd: { key: 'entityPlannedEnd', text: 'Planned End' },
					AssetMasterDescription: { key: 'entityAssetMasterDescription', text: 'Asset Master Description' },
					userDefinedGroup: { key: 'entityUserDefined', text: 'UserDefined' },
					DateAwardDeadline: { key: 'dateAwardDeadline' },
					DateRequested: { key: 'dateRequested' }
				}),
				...prefixAllTranslationKeys('businesspartner.main.', {
					EvaluationSchemaFk: {key: 'entityEvaluationSchemaFk', text: 'Evaluation Schema'}
				})
			}
		};
	}
}
