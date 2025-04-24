/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import { createLookup, FieldType, ILayoutConfiguration, UiCommonLookupDataFactoryService } from '@libs/ui/common';
import { IQtoMainHeaderGridEntity } from '../model/qto-main-header-grid-entity.class';
import { BasicsSharedClerkLookupService, BasicsSharedCustomizeLookupOverloadProvider, BasicsSharedProcurementStructureLookupService, BasicsSharedRubricCategoryByRubricAndCompanyLookupService, Rubric } from '@libs/basics/shared';
import { BusinessPartnerLookupService } from '@libs/businesspartner/shared';
import { ProjectSharedLookupService } from '@libs/project/shared';
import { prefixAllTranslationKeys } from '@libs/platform/common';
import { QtoTypeLookupService } from './lookups/qto-type-lookup.service';
import { IBusinessPartnerSearchMainEntity } from '@libs/businesspartner/interfaces';

/**
 * qto header service
 */
@Injectable({
	providedIn: 'root',
})
export class QtoMainHeaderLayoutService {
	private lookupServiceFactory = inject(UiCommonLookupDataFactoryService);

	public generateLayout(): ILayoutConfiguration<IQtoMainHeaderGridEntity> {
		return {
			groups: [
				{
					gid: 'default',
					attributes: [
						'Code',
						'DescriptionInfo',
						'QtoTypeFk',
						'QtoTargetType',
						'BasRubricCategoryFk',
						'QtoDate',
						'ProjectFk',
						'IsLive',
						'ClerkFk',
						'PerformedFrom',
						'PerformedTo',
						'BasGoniometerTypeFk',
						'NoDecimals',
						'UseRoundedResults',
						'Remark',
						'BoqHeaderFk',
						'QTOStatusFk',
						'BusinessPartnerFk',
						'OrdHeaderFk',
						'ConHeaderFk',
						'IsWQ',
						'IsAQ',
						'IsIQ',
						'IsBQ',
						'PrcStructureFk',
					],
				},
			],
			overloads: {
				//TODO: missing => code, formatter not ready -lnt
				QTOStatusFk: BasicsSharedCustomizeLookupOverloadProvider.provideQtoStatusReadonlyLookupOverload(),
				PrcStructureFk: {
					type: FieldType.Lookup,
					lookupOptions: createLookup({
						dataServiceToken: BasicsSharedProcurementStructureLookupService,
					}),
				},
				BusinessPartnerFk: {
					type: FieldType.Lookup,
					lookupOptions: createLookup<IQtoMainHeaderGridEntity, IBusinessPartnerSearchMainEntity>({
						dataServiceToken: BusinessPartnerLookupService,
					}),
				},
				BasRubricCategoryFk: {
					type: FieldType.Lookup,
					lookupOptions: createLookup({
						dataServiceToken: BasicsSharedRubricCategoryByRubricAndCompanyLookupService,
						serverSideFilter: {
							key: 'qto-main-rubric-category-lookup-filter',
							execute() {
								return {
									Rubric: Rubric.QTO,
								};
							},
						},
					}),
				},
				QtoTypeFk: {
					type: FieldType.Lookup,
					lookupOptions: createLookup({
						dataServiceToken: QtoTypeLookupService,
					}),
				},
				QtoTargetType: BasicsSharedCustomizeLookupOverloadProvider.provideQtoPurposeTypeReadonlyLookupOverload(),
				//TODO: missing => ConHeaderFk lookup -lnt
				//TODO: missing => OrdHeaderFk lookup -lnt
				//TODO: missing => BoqHeaderFk lookup -lnt
				ProjectFk: {
					type: FieldType.Lookup,
					lookupOptions: createLookup({
						dataServiceToken: ProjectSharedLookupService,
						descriptionMember: 'ProjectNo',
					}),
				},
				ClerkFk: {
					type: FieldType.Lookup,
					lookupOptions: createLookup({
						dataServiceToken: BasicsSharedClerkLookupService,
						showClearButton: true,
						descriptionMember: 'Description',
					}),
				},
				BasGoniometerTypeFk: BasicsSharedCustomizeLookupOverloadProvider.provideGoniometerTypeLookupOverload(true),
				//TODO: missing => NoDecimals - basics-common-limit-input -lnt
			},
			transientFields: [
				{
					id: 'ProjectName',
					model: 'ProjectFk',
					type: FieldType.Lookup,
					readonly: true,
					lookupOptions: createLookup({
						dataServiceToken: ProjectSharedLookupService,
						displayMember: 'ProjectName',
					}),
					label: { key: 'cloud.common.entityProjectName', text: 'Project Name' },
				},
				{
					id: 'ClerkDescription',
					model: 'ClerkFk',
					type: FieldType.Lookup,
					readonly: true,
					lookupOptions: createLookup({
						dataServiceToken: BasicsSharedClerkLookupService,
						displayMember: 'Description',
					}),
					label: { key: 'qto.main.contactDescription', text: 'Clerk Description' },
				},
			],
			labels: {
				...prefixAllTranslationKeys('cloud.common.', {
					Code: { key: 'entityCode', text: 'Code' },
					DescriptionInfo: { key: 'entityDescription', text: '*Description' },
					ProjectFk: { key: 'entityProject', text: 'Project Name' },
					Remark: { key: 'entityRemark', text: 'Remark' },
				}),
				...prefixAllTranslationKeys('qto.main.', {
					QtoTypeFk: { key: 'qtoTypeFk', text: 'QTO Type' },
					QtoTargetType: { key: 'QtoTargetType', text: 'QTO Purpose' },
					BasRubricCategoryFk: { key: 'BasRubricCategoryFk', text: 'Rubric Category' },
					QtoDate: { key: 'qtoDate', text: 'QTO Date' },
					IsLive: { key: 'isLive', text: 'Is Live' },
					ClerkFk: { key: 'customerCode', text: 'Clerk' },
					PerformedFrom: { key: 'performedFrom', text: 'Performed From' },
					PerformedTo: { key: 'performedTo', text: 'Performed To' },
					BasGoniometerTypeFk: { key: 'goniometer', text: 'Angular unit' },
					NoDecimals: { key: 'noDecimals', text: 'Rounding Precision' },
					UseRoundedResults: { key: 'useRoundedResults', text: 'Use Rounding' },
					BoqHeaderFk: { key: 'headerBoq', text: 'BoQ Reference No.' },
					QTOStatusFk: { key: 'entityQTOStatusFk', text: 'QTO Status' },
					BusinessPartnerFk: { key: 'BusinessPartnerFk', text: 'Business Partner' },
					OrdHeaderFk: { key: 'OrdHeaderFk', text: 'Contract' },
					ConHeaderFk: { key: 'ConHeaderFk', text: 'Contract / PO' },
					IsWQ: { key: 'isWq', text: 'IsWQ' },
					IsAQ: { key: 'isAQ', text: 'IsAQ' },
					IsIQ: { key: 'isIQ', text: 'IsIQ' },
					IsBQ: { key: 'isBQ', text: 'IsBQ' },
					PrcStructureFk: { key: 'PrcStructureFk', text: 'Procurement Structure' },
				}),
			},
		};
	}
}
