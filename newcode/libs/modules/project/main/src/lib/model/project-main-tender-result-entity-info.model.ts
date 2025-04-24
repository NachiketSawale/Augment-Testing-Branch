/*
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo, IEntityInfo } from '@libs/ui/business-base';
import { ProjectMainTenderResultGridBehavior } from '../behaviors/project-main-tender-result-grid-behavior.service';
import { ProjectMainTenderResultDataService } from '../services/project-main-tender-result-data.service';
import { ProjectMainTenderResultValidationService } from '../services/project-main-tender-result-validation.service';
import { BasicsSharedCurrencyLookupService, BasicsSharedCustomizeLookupOverloadProvider } from '@libs/basics/shared';
import { createLookup, FieldType, ILookupContext } from '@libs/ui/common';
import { ProjectMainDataService, ProjectMainSaleLookupService } from '@libs/project/shared';
import { ISaleEntity, ITenderResultEntity } from '@libs/project/interfaces';
import { BusinesspartnerSharedSubsidiaryLookupService } from '@libs/businesspartner/shared';
import { prefixAllTranslationKeys } from '@libs/platform/common';

export const projectMainTenderResultEntityInfo: EntityInfo = EntityInfo.create({
	grid: {
		title: {key: 'project.main.entityTenderResultList'},
		behavior: ctx => ctx.injector.get(ProjectMainTenderResultGridBehavior)
	},
	form: {
		title: { key: 'project.main.entityTenderResultDetail' },
		containerUuid: '3dd9fa3c5742468db296da347a7f1c31',
	},
	dataService: ctx => ctx.injector.get(ProjectMainTenderResultDataService),
	validationService: ctx => ctx.injector.get(ProjectMainTenderResultValidationService),
	dtoSchemeId: {moduleSubModule: 'Project.Main', typeName: 'TenderResultDto'},
	permissionUuid: 'd161af4bc60047cc8961e186f889863a',
	layoutConfiguration: {
		groups: [
			{
				gid: 'baseGroup',
				attributes: ['StadiumFk', /*'BusinessPartnerFk',*/ 'BusinessPartner', 'SaleFk', 'Rank', 'IsActive', 'Quotation', 'Discount', 'GlobalPercentage', 'OtherDiscount',
					'FinalQuotation', 'NumberProposals', 'CommentText', 'IsBiddingConsortium', 'SubsidiaryFk', 'BasCurrencyFk']}
		],
		overloads: {
			StadiumFk: BasicsSharedCustomizeLookupOverloadProvider.provideProjectStadiumLookupOverload(true),
			// TODO: BusinessPartner lookup
			// BusinessPartnerFk: {
			// 	type: FieldType.Lookup,
			// 	lookupOptions: createLookup({
			// 		dataServiceToken: BusinessPartnerLookupService,
			// 		showClearButton: true
			// 	})
			// },
			SaleFk: {
				type: FieldType.Lookup,
				lookupOptions: createLookup({
					dataServiceToken: ProjectMainSaleLookupService,
					showClearButton: true,
					serverSideFilter: {
						key: '',
						execute(context: ILookupContext<ISaleEntity, ITenderResultEntity>) {
							return {
								ProjectId: context.injector.get(ProjectMainDataService).getSelection()[0].Id
							};
						}
					}
				})
			},
			SubsidiaryFk: {
				type: FieldType.Lookup,
				lookupOptions: createLookup({
					dataServiceToken: BusinesspartnerSharedSubsidiaryLookupService
				})
			},
			BasCurrencyFk: {
				type: FieldType.Lookup,
				lookupOptions: createLookup({
					dataServiceToken: BasicsSharedCurrencyLookupService,
					readonly: true,
					showDescription: true,
					descriptionMember: 'Currency'
				})
			}
		},
		labels: {
			...prefixAllTranslationKeys('project.main.', {
				StadiumFk: { key: 'entityStadiumFk'},
				BusinessPartnerFk: { key: 'entityBusinesspartnerFk'},
				BusinessPartner: { key: 'businessPartnerText'},
				SaleFk: { key: 'entityProjectSale'},
				Rank: { key: 'entityRank'},
				IsActive: { key: 'entityIsActive'},
				Quotation: { key: 'entityQuotation'},
				Discount: { key: 'entityDiscount'},
				GlobalPercentage: { key: 'entityGlobalPercentage'},
				OtherDiscount: { key: 'entityOtherDiscount'},
				FinalQuotation: { key: 'entityFinalQuotation'},
				NumberProposals: { key: 'entityNumberProposals'},
				CommentText: { key: 'entityCommentText'},
				IsBiddingConsortium: { key: 'isBiddingConsortium'},
				SubsidiaryFk: { key: 'entitySubsidiary'}
			}),
			...prefixAllTranslationKeys('cloud.common.', {
				BasCurrencyFk: { key: 'entityCurrency'},
			})
		}
	},
} as IEntityInfo<ITenderResultEntity>);