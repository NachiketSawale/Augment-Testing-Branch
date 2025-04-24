/*
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo, IEntityInfo } from '@libs/ui/business-base';
import { ProjectMainSaleDataService } from '../services/project-main-sale-data.service';
import { BasicsSharedCurrencyLookupService, BasicsSharedCustomizeLookupOverloadProvider } from '@libs/basics/shared';
import { createLookup, FieldType } from '@libs/ui/common';
import { prefixAllTranslationKeys } from '@libs/platform/common';
import { ISaleEntity } from '@libs/project/interfaces';

export const projectMainSaleEntityInfo: EntityInfo = EntityInfo.create({
	grid: {
		title: {key: 'project.main.listSaleTitle'},
	},
	form: {
		title: { key: 'project.main.detailSaleTitle' },
		containerUuid: 'b85c94bf5b2a4496bd7e2cd7312b9104',
	},
	dataService: ctx => ctx.injector.get(ProjectMainSaleDataService),
	dtoSchemeId: {moduleSubModule: 'Project.Main', typeName: 'SaleDto'},
	permissionUuid: '011b0cf9e74e4e5094995de0ec1e9217',
	layoutConfiguration: {
		groups: [
			{
				gid: 'baseGroup',
				attributes: ['Code', 'Description', 'DecisionFk', 'ChancesFk', 'Volume', 'ProfitPercent', 'Remark', 'OutcomeFk', 'ClosingDate',
					'ClosingTime', 'BusinessPartnerFk', 'RemarkOutcome', 'StadiumFk', 'ValuationLowest', 'ValuationHighest', 'ValuationOwn', 'ValuationDifference',
					'Rank', 'Remark01', 'Remark02', 'Remark03', 'Remark04', 'Remark05', 'BasCurrencyFk']}
		],
		overloads: {
			DecisionFk: BasicsSharedCustomizeLookupOverloadProvider.provideProjectDecisionLookupOverload(true),
			ChancesFk: BasicsSharedCustomizeLookupOverloadProvider.provideProjectChanceLookupOverload(true),
			OutcomeFk: BasicsSharedCustomizeLookupOverloadProvider.provideProjectOutcomeLookupOverload(true),
			StadiumFk: BasicsSharedCustomizeLookupOverloadProvider.provideProjectStadiumLookupOverload(true),
			BasCurrencyFk: {
				type: FieldType.Lookup,
				lookupOptions: createLookup({
					dataServiceToken: BasicsSharedCurrencyLookupService,
					showDescription: true,
					descriptionMember: 'Currency'
				})
			},
		},
		labels: {
			...prefixAllTranslationKeys('project.main.', {
				DecisionFk: { key: 'entityDecisionFk'},
				ChancesFk: { key: 'entityChancesFk'},
				Volume: { key: 'entityVolume'},
				ProfitPercent: { key: 'entityProfitPercent'},
				Remark01: { key: 'entityRemark01'},
				Remark02: { key: 'entityRemark02'},
				Remark03: { key: 'entityRemark03'},
				Remark04: { key: 'entityRemark04'},
				Remark05: { key: 'entityRemark05'},
				OutcomeFk: { key: 'entityOutcomeFk'},
				ClosingDate: { key: 'entityClosingDate'},
				ClosingTime: { key: 'entityClosingTime'},
				BusinessPartnerFk: { key: 'entityBusinessPartner'},
				RemarkOutcome: { key: 'entityRemarkOutcome'},
				StadiumFk: { key: 'entityStadiumFk'},
				ValuationLowest: { key: 'entityValuationLowest'},
				ValuationHighest: { key: 'entityValuationHighest'},
				ValuationOwn: { key: 'entityValuationOwn'},
				ValuationDifference: { key: 'entityValuationDifference'},
				Rank: { key: 'entityRank'},
			}),
			...prefixAllTranslationKeys('cloud.common.',{
				Description: { key: 'entityDescription'},
				Remark: { key: 'entityRemark'},
				BasCurrencyFk: { key: 'entityCurrency'},
			})
		}
	},
} as IEntityInfo<ISaleEntity>);