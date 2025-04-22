/*
 * Copyright(c) RIB Software GmbH
 */

import { BasicsSharedCustomizeLookupOverloadProvider } from '@libs/basics/shared';
import { IBidMilestoneEntity, ISalesSharedLookupOptions, SALES_SHARED_LOOKUP_PROVIDER_TOKEN } from '@libs/sales/interfaces';
import { prefixAllTranslationKeys } from '@libs/platform/common';
import { ILayoutConfiguration } from '@libs/ui/common';
import { SalesBidMilestonesDataService } from '../../services/sales-bid-milestones-data.service';
import { EntityInfo } from '@libs/ui/business-base';
import { SalesBidMilestoneBehavior } from '../../behaviors/sales-bid-milestone-behavior.service';

/**
 * Represent sales bid Milestones entity info
 */
export const SALES_BID_MILESTONES_ENTITY_INFO: EntityInfo = EntityInfo.create<IBidMilestoneEntity>({
	grid: {
		title: { key: 'sales.common.milestone.milestoneContainerGridTitle' },
		behavior: ctx => ctx.injector.get(SalesBidMilestoneBehavior)
	},
	form: {
		title: { key: 'sales.common.milestone.milestoneContainerFormTitle' },
		containerUuid: 'c797b75acac84db2866e4a6a0c891204',
	},
	dataService: (ctx) => ctx.injector.get(SalesBidMilestonesDataService),
	dtoSchemeId: { moduleSubModule: 'Sales.Bid', typeName: 'BidMilestoneDto' },
	permissionUuid: 'af2323e0818c4f2dae3f4fc91a452959',

	layoutConfiguration: async (ctx) => {
		const salesSharedLookupProvider = await ctx.lazyInjector.inject(SALES_SHARED_LOOKUP_PROVIDER_TOKEN);

		return <ILayoutConfiguration<IBidMilestoneEntity>>{
			groups: [
				{
					gid: 'Basic Data',
					attributes: [
						'SalesDateKindFk',
						'SalesDateTypeFk',
						'Description',
						'MilestoneDate',
						'MdcTaxCodeFk',
						'Amount',
						'CommentText',
						'UserDefinedText1',
						'UserDefinedText2',
						'UserDefinedText3',
						'UserDefinedText4',
						'UserDefinedText5',
						'UserDefinedDate1',
						'UserDefinedDate2',
						'UserDefinedDate3',
						'UserDefinedDate4',
						'UserDefinedDate5',
						'UserDefinedNumber1',
						'UserDefinedNumber2',
						'UserDefinedNumber3',
						'UserDefinedNumber4',
						'UserDefinedNumber5',
					],
				},
			],
			overloads: {
				SalesDateKindFk: BasicsSharedCustomizeLookupOverloadProvider.provideSalesDateKindLookupOverload(true),
				SalesDateTypeFk: BasicsSharedCustomizeLookupOverloadProvider.provideSalesDateTypeLookupOverload(true),
				Description: { label: { text: 'Description', key: 'Description' }, visible: true },
				MilestoneDate: { label: { text: 'Milestone Date', key: 'MilestoneDate' }, visible: true },
				MdcTaxCodeFk: salesSharedLookupProvider.provideTaxCodeLookupOverload(
					new (class implements ISalesSharedLookupOptions {
						public readOnly: boolean = false;
						public showClearBtn: boolean = true;
					})(),
				),
				Amount: { label: { text: 'Amount', key: 'Amount' }, visible: true },
				CommentText: { label: { text: 'Comment', key: 'Comment' }, visible: true },
				UserDefinedText1: { label: { text: 'User Defined Text 1', key: 'UserDefinedText1' }, visible: true },
				UserDefinedText2: { label: { text: 'User Defined Text 2', key: 'UserDefinedText2' }, visible: true },
				UserDefinedText3: { label: { text: 'User Defined Text 3', key: 'UserDefinedText3' }, visible: true },
				UserDefinedText4: { label: { text: 'User Defined Text 4', key: 'UserDefinedText4' }, visible: true },
				UserDefinedText5: { label: { text: 'User Defined Text 5', key: 'UserDefinedText5' }, visible: true },
				UserDefinedDate1: { label: { text: 'User Defined Data 1', key: 'UserDefinedDate1' }, visible: true },
				UserDefinedDate2: { label: { text: 'User Defined Data 2', key: 'UserDefinedDate2' }, visible: true },
				UserDefinedDate3: { label: { text: 'User Defined Data 3', key: 'UserDefinedDate3' }, visible: true },
				UserDefinedDate4: { label: { text: 'User Defined Data 4', key: 'UserDefinedDate4' }, visible: true },
				UserDefinedDate5: { label: { text: 'User Defined Data 5', key: 'UserDefinedDate5' }, visible: true },
				UserDefinedNumber1: { label: { text: 'User Defined Number 1', key: 'UserDefinedNumber1' }, visible: true },
				UserDefinedNumber2: { label: { text: 'User Defined Number 2', key: 'UserDefinedNumber2' }, visible: true },
				UserDefinedNumber3: { label: { text: 'User Defined Number 3', key: 'UserDefinedNumber3' }, visible: true },
				UserDefinedNumber4: { label: { text: 'User Defined Number 4', key: 'UserDefinedNumber4' }, visible: true },
				UserDefinedNumber5: { label: { text: 'User Defined Number 5', key: 'UserDefinedNumber5' }, visible: true },
			},
			labels: {
				...prefixAllTranslationKeys('sales.contract.', {
					MdcTaxCodeFk: { key: 'entityTaxCode' },
					SalesDateKindFk: { key: 'entitySalesDateKindFk' },
					SalesDateTypeFk: { key: 'entitySalesDateTypeFk' },
				}),
			},
		};
	},
});
