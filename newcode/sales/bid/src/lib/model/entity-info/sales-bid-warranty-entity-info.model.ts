/*
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo } from '@libs/ui/business-base';
import { BasicsSharedCustomizeLookupOverloadProvider } from '@libs/basics/shared';
import { ILayoutConfiguration } from '@libs/ui/common';
import { IBidWarrantyEntity } from '@libs/sales/interfaces';
import { SalesCommonLabels } from '@libs/sales/common';
import { SalesBidWarrantyDataService } from '../../services/sales-bid-warranty-data.service';
import { SalesBidWarrantyBehavior } from '../../behaviors/sales-bid-warranty-behavior.service';

/**
 * Sales Bid Warranty Entity Info
 */
export const SALES_BID_WARRANTY_ENTITY_INFO: EntityInfo = EntityInfo.create<IBidWarrantyEntity>({
	grid: {
		title: { key: 'sales.common.warranty.warrantyContainerGridTitle' },
		behavior: (ctx) => ctx.injector.get(SalesBidWarrantyBehavior),
	},
	form: {
		title: { key: 'sales.common.warranty.warrantyContainerDetailTitle' },
		containerUuid: 'd69a56cbdcb34621a3eea71cfb23a443',
	},
	dataService: (ctx) => ctx.injector.get(SalesBidWarrantyDataService),
	dtoSchemeId: { moduleSubModule: 'Sales.Bid', typeName: 'BidWarrantyDto' },
	permissionUuid: '00867208667e47c797ec1ca8f8f74677',
	layoutConfiguration: async (ctx) => {
		return <ILayoutConfiguration<IBidWarrantyEntity>>{
			groups: [
				{
					gid: 'basicData',
					title: {
						text: 'Basic Data',
						key: 'cloud.common.entityProperties',
					},
					attributes: [
						'BasWarrantysecurityFk',
						'BasWarrantyobligationFk',
						'Description',
						'HandoverDate',
						'DurationMonths',
						'WarrantyEnddate',
						'CommentText',
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
						'UserDefinedText1',
						'UserDefinedText2',
						'UserDefinedText3',
						'UserDefinedText4',
						'UserDefinedText5',
					],
				},
			],
			labels: {
				...SalesCommonLabels.getSalesCommonLabels(),
			},
			overloads: {
				BasWarrantysecurityFk: BasicsSharedCustomizeLookupOverloadProvider.provideWarrantySecurityLookupOverload(true),
				BasWarrantyobligationFk: BasicsSharedCustomizeLookupOverloadProvider.provideWarrantyObligationLookupOverload(true),
			},
		};
	},
});
