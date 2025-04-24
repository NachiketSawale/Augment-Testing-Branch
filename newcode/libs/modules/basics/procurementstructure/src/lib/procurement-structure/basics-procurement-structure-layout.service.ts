/*
 * Copyright(c) RIB Software GmbH
 */
import { inject, Injectable } from '@angular/core';
import { PlatformLazyInjectorService, prefixAllTranslationKeys } from '@libs/platform/common';
import { ILayoutConfiguration, TypedConcreteFieldOverload } from '@libs/ui/common';
import { BasicsSharedLookupOverloadProvider, BasicsSharedCustomizeLookupOverloadProvider } from '@libs/basics/shared';
import { BASICS_COST_CODES_LOOKUP_PROVIDER_TOKEN, IBasicsCostCodeLookupProvider } from '@libs/basics/interfaces';
import { IPrcStructureEntity } from '@libs/basics/interfaces';

/**
 * Procurement structure layout service
 */
@Injectable({
	providedIn: 'root',
})
export class BasicsProcurementStructureLayoutService {

	/**
	 * Generate layout config
	 */
	private readonly lazyInjector = inject(PlatformLazyInjectorService);

	private costCodeLookupAndAdditionalFields(basicsCostCodeProvider: IBasicsCostCodeLookupProvider, descriptionColumnKey: string) {
		return {
			...basicsCostCodeProvider.GenerateBasicsCostCodeLookup(),
			additionalFields: [
				{
					displayMember: 'DescriptionInfo.Translated',
					label: {
						key: descriptionColumnKey,
					},
					column: true,
					singleRow: false,
				},
			],
		} as TypedConcreteFieldOverload<IPrcStructureEntity>;
	}

	public async generateLayout(): Promise<ILayoutConfiguration<IPrcStructureEntity>> {

		const basicsCostCodeProvider = await this.lazyInjector.inject(BASICS_COST_CODES_LOOKUP_PROVIDER_TOKEN);

		return {
			groups: [
				{
					gid: 'basicData',
					title: {
						text: 'Basic Data',
						key: 'cloud.common.entityProperties'
					},
					attributes: [
						'Code',
						'DescriptionInfo',
						'PrcStructureTypeFk',
						'IsLive'
					]
				},
				{
					gid: 'technicalCostCodes',
					title: {
						text: 'Technical Cost Codes',
						key: 'basics.procurementstructure.technicalCostCodesGroup'
					},
					attributes: [
						'CostCodeFk',
						'CostCodeURP1Fk',
						'CostCodeURP2Fk',
						'CostCodeURP3Fk',
						'CostCodeURP4Fk',
						'CostCodeURP5Fk',
						'CostCodeURP6Fk',
						'AllowAssignment',
						'CostCodeVATFk',
						'IsFormalHandover',
						'IsApprovalRequired',
						'IsStockExcluded',
						'ScurveFk',
						'ClerkPrcFk',
						'ClerkReqFk',
						'CommentTextInfo',
						'PrcConfigHeaderFk',
						'BasLoadingCostId'
					]
				}
			],
			labels: {
				...prefixAllTranslationKeys('cloud.common.', {
					'Code': {
						text: 'Code',
						key: 'entityCode'
					},
					'DescriptionInfo': {
						text: 'Description',
						key: 'entityDescription'
					},
					'PrcStructureTypeFk': {
						text: 'Type',
						key: 'entityType'
					},
					'IsLive': {
						text: 'Active',
						key: 'entityIsLive'
					},
					'CommentTextInfo': {
						text: 'Comment',
						key: 'entityCommentText'
					},
				}),
				...prefixAllTranslationKeys('basics.procurementstructure.', {
					'CostCodeFk': {
						text: 'Cost Code',
						key: 'costCode'
					},
					'CostCodeURP1Fk': {
						text: 'Cost Code URP 1',
						key: 'costCodeURP1'
					},
					'CostCodeURP2Fk': {
						text: 'Cost Code URP 2',
						key: 'costCodeURP2'
					},
					'CostCodeURP3Fk': {
						text: 'Cost Code URP 3',
						key: 'costCodeURP3'
					},
					'CostCodeURP4Fk': {
						text: 'Cost Code URP 4',
						key: 'costCodeURP4'
					},
					'CostCodeURP5Fk': {
						text: 'Cost Code URP 5',
						key: 'costCodeURP5'
					},
					'CostCodeURP6Fk': {
						text: 'Cost Code URP 6',
						key: 'costCodeURP6'
					},
					'AllowAssignment': {
						text: 'Allow Assignment',
						key: 'allowAssignment'
					},
					'CostCodeVATFk': {
						text: 'Cost Code (VAT)',
						key: 'costCodeVAT'
					},
					'IsFormalHandover': {
						text: 'Is Formal Handover',
						key: 'isFormalHandover'
					},
					'IsApprovalRequired': {
						text: 'Is Approval Required',
						key: 'isApprovalRequired'
					},
					'IsStockExcluded': {
						text: 'Is Stock Excluded',
						key: 'isStockExcluded'
					},
					'ScurveFk': {
						text: 'S-Curve',
						key: 'scurveFk'
					},
					'ClerkPrcFk': {
						text: 'Responsible Role',
						key: 'responsibleRole'
					},
					'ClerkReqFk': {
						text: 'Requisition Owner Role',
						key: 'requisitionOwnerRole'
					},
					'PrcConfigHeaderFk': {
						text: 'Configuration Header',
						key: 'configuration'
					},
					'BasLoadingCostId': { //TODO should correct it with better naming convention
						text: 'Loading Cost',
						key: 'basLoadingCost'
					}
				}),
			},
			overloads: {
				IsLive: {
					readonly: true
				},
				PrcStructureTypeFk: BasicsSharedLookupOverloadProvider.providerBasicsProcurementStructureTypeLookupOverload(false),
				ClerkPrcFk: BasicsSharedCustomizeLookupOverloadProvider.provideClerkRoleLookupOverload(true),
				ClerkReqFk: BasicsSharedCustomizeLookupOverloadProvider.provideClerkRoleLookupOverload(true),
				PrcConfigHeaderFk: BasicsSharedLookupOverloadProvider.provideProcurementConfigurationHeaderLookupOverload(true),
				ScurveFk: BasicsSharedCustomizeLookupOverloadProvider.provideSCurveLookupOverload(true),
				BasLoadingCostId: BasicsSharedCustomizeLookupOverloadProvider.provideLoadingCostLookupOverload(false),
				CostCodeFk: this.costCodeLookupAndAdditionalFields(basicsCostCodeProvider, 'basics.procurementstructure.costCodeDescription'),
				CostCodeVATFk: this.costCodeLookupAndAdditionalFields(basicsCostCodeProvider, 'basics.procurementstructure.costCodeVATDescription'),
				CostCodeURP1Fk: this.costCodeLookupAndAdditionalFields(basicsCostCodeProvider, 'basics.procurementstructure.costCodeURP1Description'),
				CostCodeURP2Fk: this.costCodeLookupAndAdditionalFields(basicsCostCodeProvider, 'basics.procurementstructure.costCodeURP2Description'),
				CostCodeURP3Fk: this.costCodeLookupAndAdditionalFields(basicsCostCodeProvider, 'basics.procurementstructure.costCodeURP3Description'),
				CostCodeURP4Fk: this.costCodeLookupAndAdditionalFields(basicsCostCodeProvider, 'basics.procurementstructure.costCodeURP4Description'),
				CostCodeURP5Fk: this.costCodeLookupAndAdditionalFields(basicsCostCodeProvider, 'basics.procurementstructure.costCodeURP5Description'),
				CostCodeURP6Fk: this.costCodeLookupAndAdditionalFields(basicsCostCodeProvider, 'basics.procurementstructure.costCodeURP6Description'),
			}
		};
	}
}